// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CredentialTypes
 * @dev Library containing all data structures and enums for the credential system
 */
library CredentialTypes {
    
    /**
     * @dev Enum representing different types of credentials
     */
    enum CredentialType {
        DEGREE,              // Academic degree (B.Tech, M.Tech, PhD, etc.)
        CERTIFICATE,         // Course completion certificate
        BADGE,               // Achievement or skill badge
        LICENSE,             // Professional license
        MEMBERSHIP,          // Club or organization membership
        SKILL_CERTIFICATION, // Technical or professional skill certification
        AWARD,               // Competition or achievement award
        OTHER                // Other credential types
    }

    /**
     * @dev Enum representing the current status of a credential
     */
    enum CredentialStatus {
        ACTIVE,      // Credential is valid and active
        EXPIRED,     // Credential has passed expiration date
        REVOKED,     // Credential has been revoked by issuer
        SUSPENDED    // Credential temporarily suspended
    }

    /**
     * @dev Struct representing complete credential metadata
     * @param credentialId Unique identifier for the credential (token ID)
     * @param issuerAddress Ethereum address of the issuing institution
     * @param holderAddress Ethereum address of the credential holder (student)
     * @param credentialType Type of credential from CredentialType enum
     * @param metadataURI IPFS CID or URI containing full credential metadata
     * @param issueDate Timestamp when credential was issued
     * @param expirationDate Timestamp when credential expires (0 for non-expiring)
     * @param isRevocable Whether this credential can be revoked
     * @param credentialHash Keccak256 hash of credential data for integrity verification
     */
    struct Credential {
        uint256 credentialId;
        address issuerAddress;
        address holderAddress;
        CredentialType credentialType;
        string metadataURI;
        uint256 issueDate;
        uint256 expirationDate;
        bool isRevocable;
        bytes32 credentialHash;
    }

    /**
     * @dev Struct for issuer information
     * @param issuerAddress Ethereum address of the issuer
     * @param name Name of the issuing institution
     * @param isAccredited Whether issuer is accredited in the registry
     * @param accreditationDate Timestamp of accreditation
     * @param totalIssued Total number of credentials issued by this issuer
     */
    struct Issuer {
        address issuerAddress;
        string name;
        bool isAccredited;
        uint256 accreditationDate;
        uint256 totalIssued;
    }

    /**
     * @dev Struct for verification result
     * @param isValid Overall validity of the credential
     * @param exists Whether the credential NFT exists
     * @param isActive Whether credential status is ACTIVE
     * @param isExpired Whether credential has expired
     * @param isRevoked Whether credential has been revoked
     * @param issuerAccredited Whether the issuer is accredited
     * @param status Current status of the credential
     */
    struct VerificationResult {
        bool isValid;
        bool exists;
        bool isActive;
        bool isExpired;
        bool isRevoked;
        bool issuerAccredited;
        CredentialStatus status;
    }

    /**
     * @dev Struct for ZKP claim (used in zero-knowledge proofs)
     * @param claimType Type of claim being made
     * @param claimValue Value or threshold for the claim
     * @param proofHash Hash of the zero-knowledge proof
     */
    struct ZKPClaim {
        string claimType;
        uint256 claimValue;
        bytes32 proofHash;
    }

    /**
     * @dev Helper function to convert CredentialType enum to string
     * @param credType The credential type enum value
     * @return String representation of the credential type
     */
    function credentialTypeToString(CredentialType credType) 
        internal 
        pure 
        returns (string memory) 
    {
        if (credType == CredentialType.DEGREE) return "DEGREE";
        if (credType == CredentialType.CERTIFICATE) return "CERTIFICATE";
        if (credType == CredentialType.BADGE) return "BADGE";
        if (credType == CredentialType.LICENSE) return "LICENSE";
        if (credType == CredentialType.MEMBERSHIP) return "MEMBERSHIP";
        if (credType == CredentialType.SKILL_CERTIFICATION) return "SKILL_CERTIFICATION";
        if (credType == CredentialType.AWARD) return "AWARD";
        return "OTHER";
    }

    /**
     * @dev Helper function to convert CredentialStatus enum to string
     * @param status The credential status enum value
     * @return String representation of the credential status
     */
    function credentialStatusToString(CredentialStatus status) 
        internal 
        pure 
        returns (string memory) 
    {
        if (status == CredentialStatus.ACTIVE) return "ACTIVE";
        if (status == CredentialStatus.EXPIRED) return "EXPIRED";
        if (status == CredentialStatus.REVOKED) return "REVOKED";
        if (status == CredentialStatus.SUSPENDED) return "SUSPENDED";
        return "UNKNOWN";
    }
}
