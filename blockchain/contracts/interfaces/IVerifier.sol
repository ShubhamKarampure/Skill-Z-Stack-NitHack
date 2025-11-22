// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/CredentialTypes.sol";

/**
 * @title IVerifier
 * @dev Interface for the Credential Verifier contract
 * Provides verification functions for credentials
 */
interface IVerifier {
    
    // Events
    event CredentialVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        bool isValid,
        uint256 verificationDate
    );
    
    event BatchVerificationCompleted(
        address indexed verifier,
        uint256 totalVerified,
        uint256 validCount,
        uint256 verificationDate
    );
    
    event ZKPVerified(
        bytes32 indexed proofHash,
        address indexed verifier,
        bool isValid,
        uint256 verificationDate
    );

    /**
     * @dev Verify a credential's authenticity and validity
     * @param tokenId The ID of the credential to verify
     * @return VerificationResult struct with detailed verification status
     */
    function verifyCredential(uint256 tokenId) 
        external 
        view 
        returns (CredentialTypes.VerificationResult memory);

    /**
     * @dev Verify multiple credentials in batch
     * @param tokenIds Array of credential IDs to verify
     * @return Array of VerificationResult structs
     */
    function verifyCredentialBatch(uint256[] memory tokenIds) 
        external 
        view 
        returns (CredentialTypes.VerificationResult[] memory);

    /**
     * @dev Quick check if credential is valid (simplified version)
     * @param tokenId The ID of the credential
     * @return True if valid, false otherwise
     */
    function isCredentialValid(uint256 tokenId) external view returns (bool);

    /**
     * @dev Verify credential ownership
     * @param tokenId The ID of the credential
     * @param claimedHolder Address claiming to own the credential
     * @return True if holder owns the credential, false otherwise
     */
    function verifyOwnership(uint256 tokenId, address claimedHolder) 
        external 
        view 
        returns (bool);

    /**
     * @dev Verify that issuer is accredited
     * @param issuerAddress Address of the issuer to verify
     * @return True if issuer is accredited, false otherwise
     */
    function verifyIssuer(address issuerAddress) external view returns (bool);

    /**
     * @dev Verify credential against a specific hash
     * @param tokenId The ID of the credential
     * @param claimedHash Hash to verify against
     * @return True if hashes match, false otherwise
     */
    function verifyCredentialHash(uint256 tokenId, bytes32 claimedHash) 
        external 
        view 
        returns (bool);

    /**
     * @dev Get verification history count for a verifier
     * @param verifierAddress Address of the verifier
     * @return Number of verifications performed
     */
    function getVerificationCount(address verifierAddress) 
        external 
        view 
        returns (uint256);

    /**
     * @dev Verify credential with detailed checks
     * @param tokenId The ID of the credential
     * @return exists Whether credential exists
     * @return isActive Whether credential is active (not revoked/expired)
     * @return issuerAccredited Whether issuer is accredited
     * @return isExpired Whether credential is expired
     * @return isRevoked Whether credential is revoked
     */
    function verifyCredentialDetailed(uint256 tokenId) 
        external 
        view 
        returns (
            bool exists,
            bool isActive,
            bool issuerAccredited,
            bool isExpired,
            bool isRevoked
        );

    /**
     * @dev Verify zero-knowledge proof claim
     * @param proofHash Hash of the ZK proof
     * @param claim The claim being verified
     * @return True if proof is valid, false otherwise
     */
    function verifyZKProof(
        bytes32 proofHash,
        CredentialTypes.ZKPClaim memory claim
    ) external view returns (bool);

    /**
     * @dev Check if credential type matches expected type
     * @param tokenId The ID of the credential
     * @param expectedType The expected credential type
     * @return True if types match, false otherwise
     */
    function verifyCredentialType(
        uint256 tokenId,
        CredentialTypes.CredentialType expectedType
    ) external view returns (bool);

    /**
     * @dev Get verification result as boolean and reason
     * @param tokenId The ID of the credential
     * @return isValid Whether credential is valid
     * @return reason Reason if invalid (empty if valid)
     */
    function getVerificationStatus(uint256 tokenId) 
        external 
        view 
        returns (bool isValid, string memory reason);
}
