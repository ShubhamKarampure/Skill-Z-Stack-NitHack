import { useAuthStore, User } from "./store";
import { APIResponse, Credential, CredentialType } from "./types";

// --- CONFIGURATION ---
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api/v1";

// --- MOCK DATA (Backend Simulation) ---
const MOCK_CREDENTIALS_DB: Credential[] = [
  {
    tokenId: "1001",
    holder: "0x123...abc",
    issuer: "TechCertified Academy",
    credentialType: CredentialType.CERTIFICATE,
    credentialTypeName: "CERTIFICATE",
    metadataURI: "ipfs://QmHash1...",
    transactionHash: "0xabc123...",
    issuedAt: "2024-11-15T10:00:00Z",
    isRevoked: false,
    status: "ACTIVE",
    metadata: {
      name: "Advanced React Patterns",
      description: "Mastery of HOCs, Hooks, and Context.",
      image: "",
      skills: ["React", "TypeScript", "Performance Optimization"],
    },
  },
  {
    tokenId: "1002",
    holder: "0x123...abc",
    issuer: "Global Hackathon DAO",
    credentialType: CredentialType.BADGE,
    credentialTypeName: "BADGE",
    metadataURI: "ipfs://QmHash2...",
    transactionHash: "0xdef456...",
    issuedAt: "2024-11-20T14:30:00Z",
    isRevoked: false,
    status: "ACTIVE",
    metadata: {
      name: "Top Innovator 2024",
      description: "First place in Web3 category.",
      image: "",
      skills: ["Innovation", "Solidity", "Pitching"],
    },
  },
  {
    tokenId: "1003",
    holder: "0x123...abc",
    issuer: "TechCertified Academy",
    credentialType: CredentialType.CERTIFICATE,
    credentialTypeName: "CERTIFICATE",
    metadataURI: "ipfs://QmHash3...",
    transactionHash: "0xghi789...",
    issuedAt: "2024-10-15T10:00:00Z",
    isRevoked: false,
    status: "ACTIVE",
    metadata: {
      name: "Backend Architecture",
      description: "Node.js scalable systems.",
      image: "",
      skills: ["Node.js", "Express", "MongoDB"],
    },
  },
];

// --- HELPER FUNCTION ---
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      message: error.message || "Network Error",
    };
  }
}

// --- SERVICES ---

export const authService = {
  register: async (userData: any) => {
    return fetchAPI<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return fetchAPI<User>("/auth/profile", {
      method: "GET",
    });
  },
};

export const credentialService = {
  // Get All Credentials (Simulated)
  getAllCredentials: async (): Promise<APIResponse<Credential[]>> => {
    // Simulate network delay of 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Return mock data disguised as a real API response
    return {
      success: true,
      message: "Credentials fetched successfully",
      data: MOCK_CREDENTIALS_DB,
    };
  },

  getCredentialsByAddress: async (address: string) => {
    return fetchAPI<{ count: number, credentials: Credential[] }>(`/credentials/holder/${address}`, {
      method: "GET",
    });
  },
};

export const verifierService = {
  verifyZKProof: async (proofType: string, proof: any, publicSignals: any) => {
    return fetchAPI<{ isValid: boolean }>("/verifier/verify-zkp", {
      method: "POST",
      body: JSON.stringify({ proofType, proof, publicSignals }),
    });
  },
};

export const userService = {
  getCandidates: async (page = 1, limit = 10, search = "") => {
    const queryParams = new URLSearchParams({
      role: "student",
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      queryParams.append("search", search);
    }

    return fetchAPI<{ users: User[], totalPages: number, currentPage: number, total: number }>(`/users?${queryParams.toString()}`, {
      method: "GET",
    });
  },

  getUserById: async (id: string) => {
    return fetchAPI<{ user: User }>(`/users/${id}`, {
      method: "GET",
    });
  },
};
