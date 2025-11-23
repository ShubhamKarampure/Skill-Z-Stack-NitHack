// --- ENUMS & TYPES ---

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  statusCode?: number;
}

export enum CredentialType {
  DEGREE = 0,
  CERTIFICATE = 1,
  BADGE = 2,
}

export enum NodeStatus {
  OWNED = "OWNED",
  VERIFYING = "VERIFYING",
  GHOST = "GHOST",
}

export type NodeCategory =
  | "Frontend"
  | "Backend"
  | "Design"
  | "DevOps"
  | "Core";

// --- INTERFACES ---

export interface ConstellationNode {
  id: string;
  name: string;
  type?: CredentialType;
  status: NodeStatus;
  category: NodeCategory;
  relatedIds: string[];
  description?: string;
  logoSlug?: string;
  // Optional coordinates for pre-calculated layouts
  x?: number;
  y?: number;
}

export interface CredentialMetadata {
  name: string;
  description: string;
  image: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  honors?: string;
  skills?: string[];
  achievements?: string[];
  additionalAttributes?: any;
}

export interface Credential {
  tokenId: string;
  holder: string;
  issuer: string;
  credentialType: CredentialType;
  credentialTypeName: "DEGREE" | "CERTIFICATE" | "BADGE";
  metadataURI: string;
  metadata: CredentialMetadata;
  transactionHash: string;
  blockNumber?: number;
  isRevoked: boolean;
  revocationReason?: string;
  expirationDate?: string;
  issuedAt: string;
  verificationCount?: number;
  status?: "ACTIVE" | "REVOKED" | "EXPIRED";
}
