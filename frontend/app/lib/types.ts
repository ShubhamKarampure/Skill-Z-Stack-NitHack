import { User } from "./store";

// --- RESPONSE INTERFACES ---
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

// --- CREDENTIAL TYPES ---
export enum CredentialType {
  DEGREE = 0,
  CERTIFICATE = 1,
  BADGE = 2,
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
