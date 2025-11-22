// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/CredentialTypes.sol";

/**
 * @title ICredential
 * @dev Interface for the Credential NFT contract
 * Defines all operations related to credential issuance, transfer, and management
 */
interface ICredential {
    // Events
    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed issuer,
        address indexed holder,
        CredentialTypes.CredentialType credentialType,
        string metadataURI,
        uint256 expirationDate
    );

    event CredentialRevoked(
        uint256 indexed tokenId,
        address indexed issuer,
        address indexed holder,
        uint256 revocationDate,
        string reason
    );

    event CredentialTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 transferDate
    );

    event CredentialRenewed(
        uint256 indexed tokenId,
        uint256 oldExpirationDate,
        uint256 newExpirationDate
    );

    event CredentialMetadataUpdated(
        uint256 indexed tokenId,
        string oldMetadataURI,
        string newMetadataURI
    );

    /**
     * @dev Issue a new credential NFT to a holder
     * @param holder Address of the credential recipient
     * @param credentialType Type of credential being issued
     * @param metadataURI IPFS CID or URI containing credential metadata
     * @param expirationDate Timestamp when credential expires (0 for non-expiring)
     * @param isRevocable Whether this credential can be revoked
     * @param credentialHash Hash of credential data for integrity
     * @return tokenId The ID of the newly minted credential NFT
     */
    function issueCredential(
        address holder,
        CredentialTypes.CredentialType credentialType,
        string memory metadataURI,
        uint256 expirationDate,
        bool isRevocable,
        bytes32 credentialHash
    ) external returns (uint256 tokenId);

    /**
     * @dev Revoke a credential (only by original issuer)
     * @param tokenId The ID of the credential to revoke
     * @param reason Reason for revocation
     */
    function revokeCredential(uint256 tokenId, string memory reason) external;

    /**
     * @dev Renew an expirable credential with new expiration date
     * @param tokenId The ID of the credential to renew
     * @param newExpirationDate New expiration timestamp
     */
    function renewCredential(
        uint256 tokenId,
        uint256 newExpirationDate
    ) external;

    /**
     * @dev Update credential metadata URI
     * @param tokenId The ID of the credential
     * @param newMetadataURI New IPFS CID or URI
     */
    function updateMetadata(
        uint256 tokenId,
        string memory newMetadataURI
    ) external;

    /**
     * @dev Get complete credential information
     * @param tokenId The ID of the credential
     * @return Credential struct with all details
     */
    function getCredential(
        uint256 tokenId
    ) external view returns (CredentialTypes.Credential memory);

    /**
     * @dev Get all credentials owned by a holder
     * @param holder Address of the credential holder
     * @return Array of token IDs owned by the holder
     */
    function getHolderCredentials(
        address holder
    ) external view returns (uint256[] memory);

    /**
     * @dev Get all credentials issued by an issuer
     * @param issuer Address of the issuer
     * @return Array of token IDs issued by the issuer
     */
    function getIssuerCredentials(
        address issuer
    ) external view returns (uint256[] memory);

    /**
     * @dev Check if a credential exists
     * @param tokenId The ID of the credential
     * @return True if credential exists, false otherwise
     */
    function credentialExists(uint256 tokenId) external view returns (bool);

    /**
     * @dev Check if a credential is revoked
     * @param tokenId The ID of the credential
     * @return True if revoked, false otherwise
     */
    function isRevoked(uint256 tokenId) external view returns (bool);

    /**
     * @dev Check if a credential is expired
     * @param tokenId The ID of the credential
     * @return True if expired, false otherwise
     */
    function isExpired(uint256 tokenId) external view returns (bool);

    /**
     * @dev Get credential status
     * @param tokenId The ID of the credential
     * @return Status enum (ACTIVE, EXPIRED, REVOKED, SUSPENDED)
     */
    function getCredentialStatus(
        uint256 tokenId
    ) external view returns (CredentialTypes.CredentialStatus);

    /**
     * @dev Get issuer address for a credential
     * @param tokenId The ID of the credential
     * @return Address of the issuer
     */
    function getIssuer(uint256 tokenId) external view returns (address);

    /**
     * @dev Get total number of credentials issued
     * @return Total credential count
     */
    function getTotalCredentials() external view returns (uint256);

    /**
     * @dev Check if credential is transferable
     * @param tokenId The ID of the credential
     * @return True if transferable, false if soulbound
     */
    function isTransferable(uint256 tokenId) external view returns (bool);
}
