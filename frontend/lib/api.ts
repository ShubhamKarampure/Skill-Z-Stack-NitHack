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

    // Pass through if the server returns a specific error message structure
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
    return fetchAPI<UserProfile>("/auth/profile", {
      method: "GET",
    });
  },
};

export const credentialService = {
  // Get All Credentials (Simulated)
  getAllCredentials: async (): Promise<APIResponse<Credential[]>> => {
    // Simulate network delay of 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 100));

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

// --- SHARED INTERFACES ---

// The Clean UI Interface (Used by Admin & Enrollment)
export interface Institute {
  id: string;
  name: string;
  walletAddress: string;
  status: "pending" | "active" | "revoked";
  requestedAt: string;
  credentialCount: number;
  // Flags for Admin Logic
  isRegistered: boolean;
  isAccredited: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  instituteId: string;
  institute: Institute;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  joinedAt?: string;
}

// --- ENROLLMENT SERVICE ---
export const enrollmentService = {
  // 1. Get My Institutes
  getMyEnrollments: async () => {
    return fetchAPI<Enrollment[]>("/enrollments/my-enrollments", {
      method: "GET",
    });
  },

  // 2. Request to Join Institute
  requestEnrollment: async (instituteId: string, token: string) => {
    return fetchAPI<Enrollment>("/enrollments/request", {
      method: "POST",
      body: JSON.stringify({
        instituteId,
        token,
      }),
    });
  },
};

// --- ADMIN SERVICE (ADAPTER PATTERN) ---

// 1. Backend Types (Private to this file, matching DB structure)
interface BackendInstituteItem {
  _id: string;
  name: string;
  walletAddress: string;
  createdAt: string;
  credentialCount: number;
  instituteData: {
    isAccredited: boolean;
    isRegistered: boolean;
    isSuspended: boolean;
  };
}

interface BackendAdminResponse {
  success: boolean;
  institutes: {
    all: BackendInstituteItem[];
  };
}

export const adminService = {
  // GET: Fetches and Maps data to clean UI type
  getInstitutes: async (): Promise<{
    success: boolean;
    data: Institute[];
    message?: string;
  }> => {
    try {
      // Note: We cast the response because fetchAPI returns APIResponse<T>,
      // but the backend structure here is slightly nested differently
      const response = await fetchAPI<BackendAdminResponse>(
        "/issuers/admin/institutes",
        { method: "GET" }
      );

      // Access the nested data structure
      const rawData = (response as any).institutes?.all;

      if (response.success && rawData) {
        // --- MAPPING LOGIC ---
        const mappedData: Institute[] = rawData.map(
          (item: BackendInstituteItem) => {
            let status: Institute["status"] = "pending";

            if (item.instituteData?.isSuspended) {
              status = "revoked";
            } else if (
              item.instituteData?.isAccredited &&
              item.instituteData?.isRegistered
            ) {
              status = "active";
            } else {
              // If missing either registration or accreditation, it's pending action
              status = "pending";
            }

            return {
              id: item._id,
              name: item.name,
              walletAddress: item.walletAddress,
              requestedAt: item.createdAt,
              credentialCount: item.credentialCount || 0,
              // Map flags for UI buttons
              isRegistered: item.instituteData?.isRegistered || false,
              isAccredited: item.instituteData?.isAccredited || false,
              status: status,
            };
          }
        );

        return { success: true, data: mappedData };
      }

      return {
        success: false,
        data: [],
        message: "Invalid response structure",
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || "Network Error",
      };
    }
  },

  // ACTION 1: Register Issuer (Step 1)
  registerIssuer: async (walletAddress: string) => {
    return fetchAPI<{ success: boolean; message: string }>(
      "/issuers/register",
      {
        method: "POST",
        body: JSON.stringify({
          issuerAddress: walletAddress,
          name: "blank", // Hardcoded as requested
          metadataURI: "blank", // Hardcoded as requested
        }),
      }
    );
  },

  // ACTION 2: Accredit Issuer (Step 2)
  accreditIssuer: async (walletAddress: string) => {
    return fetchAPI<{ success: boolean; message: string }>(
      "/issuers/accredit",
      {
        method: "POST",
        body: JSON.stringify({
          issuerAddress: walletAddress,
        }),
      }
    );
  },

  // ACTION 3: Revoke
  revokeInstitute: async (walletAddress: string) => {
    return fetchAPI<{ success: boolean; message: string }>("/issuers/revoke", {
      method: "POST",
      body: JSON.stringify({ issuerAddress: walletAddress }),
    });
  },
};

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "student" | "institute" | "admin";
  walletAddress?: string;
  // Add other fields your UserModel returns
  instituteDetails?: {
    name: string;
    isAccredited: boolean;
  };
}
