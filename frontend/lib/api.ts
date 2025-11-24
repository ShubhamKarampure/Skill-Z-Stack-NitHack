import { useAuthStore, User } from "./store";
import { APIResponse, Credential, CredentialType } from "./types";
import { signAndSendTransaction } from "./blockchain-client"; // Import the transaction handler
import { ethers } from "ethers";

// --- CONFIGURATION ---
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api/v1";

// --- HELPER FUNCTION: STANDARD FETCH ---
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      cache: "no-cache",
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

// --- NEW HELPER: TRANSACTION ORCHESTRATOR ---
async function executeTransactionFlow<T>(
  prepareEndpoint: string,
  finalizeEndpoint: string,
  payload: any
): Promise<APIResponse<T>> {
  try {
    // 1. PREPARE: Get raw transaction data from backend
    const prepareRes = await fetchAPI<any>(prepareEndpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!prepareRes.success) {
      throw new Error(prepareRes.message || "Failed to prepare transaction");
    }

    const txData = prepareRes.data?.txData || prepareRes.txData;

    if (!txData) {
      throw new Error("Invalid server response: Missing transaction data.");
    }

    // 2. SIGN & SEND: User signs via MetaMask / Local Provider
    // (Ensure your blockchain-client.ts handles gas limits correctly now)
    const receipt = await signAndSendTransaction(txData);

    if (!receipt) {
      throw new Error("Transaction failed: No receipt received.");
    }

    // 3. PARSE LOGS: Robustly extract Token ID
    // We define the ABI events we care about to parse them safely
    let tokenId: string | null = null;

    // Interface includes CredentialIssued (Mint) and standard Transfer (ERC721/20)
    const iface = new ethers.Interface([
      "event CredentialIssued(uint256 indexed tokenId, address indexed issuer, address indexed holder, uint8 credentialType, string metadataURI, uint256 expirationDate)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ]);

    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });

        if (parsedLog) {
          // Priority 1: Custom Issue Event
          if (parsedLog.name === "CredentialIssued") {
            tokenId = parsedLog.args.tokenId.toString();
            break;
          }
          // Priority 2: Standard ERC721 Mint (Transfer from 0x0)
          if (
            parsedLog.name === "Transfer" &&
            parsedLog.args.from === ethers.ZeroAddress
          ) {
            tokenId = parsedLog.args.tokenId.toString();
            // Keep searching in case CredentialIssued is emitted later
          }
        }
      } catch (e) {
        // Log didn't match interface, skip it
        continue;
      }
    }

    // Fallback: If no event matched, try naive topic extraction (e.g. for non-standard events)
    if (!tokenId && receipt.logs.length > 0) {
      try {
        // Try last topic (standard for indexed uint256 as last argument)
        const logs = receipt.logs;
        const lastLog = logs[logs.length - 1];
        const lastTopic = lastLog.topics[lastLog.topics.length - 1];
        tokenId = BigInt(lastTopic).toString();
      } catch (e) {
        console.warn("Could not extract Token ID via fallback method.");
      }
    }

    // 4. FINALIZE: Update backend database
    return await fetchAPI<T>(finalizeEndpoint, {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        txHash: receipt.hash, // v6 uses .hash, v5 used .transactionHash
        blockNumber: receipt.blockNumber,
        tokenId: tokenId, // Pass the extracted ID
      }),
    });
  } catch (error: any) {
    console.error("Transaction Flow Error:", error);
    return {
      success: false,
      message: error.message || "Transaction process failed.",
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

  loginWithWallet: async (walletAddress: string) => {
    return fetchAPI<User>("/auth/login-wallet", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
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
  // Read operations
  getAllCredentials: async () =>
    fetchAPI<Credential[]>("/credentials", { method: "GET" }),

  getCredentialsByAddress: async (address: string) => {
    return fetchAPI<{ count: number; credentials: Credential[] }>(
      `/credentials/holder/${address}`,
      {
        method: "GET",
      }
    );
  },

  // WRITE: Updated to use executeTransactionFlow
  issueCredential: async (data: {
    holderAddress: string;
    credentialType: number;
    metadataURI: string;
    expirationDate?: number;
    revocable?: boolean;
    credentialData: any;
    metadata?: any;
  }) => {
    return executeTransactionFlow(
      "/credentials/issue/prepare",
      "/credentials/issue/finalize",
      data
    );
  },

  getIssuedCredentials: async () => {
    return fetchAPI<Credential[]>("/credentials/issued", {
      method: "GET",
    });
  },

  // WRITE: Updated to use executeTransactionFlow
  revokeCredential: async (data: {
    tokenId: string;
    reason: string;
    issuerPrivateKey?: string; // Legacy param, ignored
  }) => {
    return executeTransactionFlow(
      "/credentials/revoke/prepare",
      "/credentials/revoke/finalize",
      data
    );
  },
};

export const metadataService = {
  uploadMetadata: async (formData: FormData) => {
    return fetchAPI<{
      imageCID: string;
      imageURL: string;
      metadataCID: string;
      metadataURI: string;
      metadata: any;
    }>("/metadata/upload", {
      method: "POST",
      body: formData,
    });
  },
};

export const templateService = {
  createTemplate: async (data: {
    name: string;
    description: string;
    type: CredentialType;
    image: string;
    skills: string[];
    metadataURI?: string;
    issuerPrivateKey?: string; // Legacy
  }) => {
    const user = useAuthStore.getState().user;
    if (!user?.walletAddress) {
      return { success: false, message: "User wallet not connected" };
    }

    // A template is essentially a self-issued credential in this system
    // We use the new transaction flow
    return executeTransactionFlow(
      "/credentials/issue/prepare",
      "/credentials/issue/finalize",
      {
        holderAddress: user.walletAddress, // Self-issue
        credentialType: data.type,
        metadataURI: data.metadataURI || "ipfs://placeholder-for-template",
        metadata: {
          name: data.name,
          description: data.description,
          image: data.image,
          skills: data.skills,
        },
        credentialData: {}, // Empty specific data
        revocable: true,
      }
    );
  },

  getTemplates: async () => {
    return fetchAPI<Credential[]>("/credentials/templates", {
      method: "GET",
    });
  },

  deleteTemplate: async (id: string) => {
    return { success: false, message: "Not implemented" };
  },
};

export const verifierService = {
  verifyZKProof: async (
    tokenId: string,
    proofType: string,
    proof: any,
    publicSignals: any
  ) => {
    return fetchAPI<{ isValid: boolean }>(`/verify/verify/${tokenId}`, {
      method: "GET",
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

    return fetchAPI<{
      users: User[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/users?${queryParams.toString()}`, {
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

export interface Institute {
  id: string;
  name: string;
  walletAddress: string;
  status: "pending" | "active" | "revoked";
  requestedAt: string;
  credentialCount: number;
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

export const enrollmentService = {
  getMyEnrollments: async () => {
    return fetchAPI<Enrollment[]>("/enrollments/my-enrollments", {
      method: "GET",
    });
  },

  getEnrolledStudents: async () => {
    return fetchAPI<EnrolledStudent[]>("/enrollments/students", {
      method: "GET",
    });
  },

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

// --- ADMIN SERVICE ---

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
  getInstitutes: async (): Promise<{
    success: boolean;
    data: Institute[];
    message?: string;
  }> => {
    try {
      const response = await fetchAPI<BackendAdminResponse>(
        "/issuers/admin/institutes",
        { method: "GET" }
      );

      const rawData = (response as any).institutes?.all;

      if (response.success && rawData) {
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
              status = "pending";
            }

            return {
              id: item._id,
              name: item.name,
              walletAddress: item.walletAddress,
              requestedAt: item.createdAt,
              credentialCount: item.credentialCount || 0,
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

  // WRITE: Refactored to use executeTransactionFlow
  registerIssuer: async (walletAddress: string) => {
    return executeTransactionFlow(
      "/issuers/register/prepare",
      "/issuers/register/finalize",
      {
        issuerAddress: walletAddress,
        name: "New Institute", // You might want to make this dynamic
        metadataURI: "ipfs://placeholder",
      }
    );
  },

  // WRITE: Refactored to use executeTransactionFlow
  accreditIssuer: async (walletAddress: string) => {
    return executeTransactionFlow(
      "/issuers/accredit/prepare",
      "/issuers/accredit/finalize",
      { issuerAddress: walletAddress }
    );
  },

  // WRITE: Refactored to use executeTransactionFlow
  revokeInstitute: async (walletAddress: string) => {
    return executeTransactionFlow(
      "/issuers/suspend/prepare",
      "/issuers/suspend/finalize",
      {
        issuerAddress: walletAddress,
        reason: "Admin Action",
      }
    );
  },
};

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "student" | "institute" | "admin";
  walletAddress?: string;
  instituteDetails?: {
    name: string;
    isAccredited: boolean;
  };
}

export const instituteService = {
  getAccreditedInstitutes: async (): Promise<APIResponse<Institute[]>> => {
    console.log("Fetching accredited institutes...");
    const response = await fetchAPI<Institute[]>("/enrollments/institutes", {
      method: "GET",
    });
    return response;
  },
};

export interface EnrolledStudent {
  _id: string;
  name: string;
  email: string;
  walletAddress?: string;
  enrolledAt: string;
}
