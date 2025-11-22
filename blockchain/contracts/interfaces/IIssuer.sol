// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/CredentialTypes.sol";

/**
 * @title IIssuer
 * @dev Interface for the Issuer Registry contract
 * Manages issuer accreditation and validation
 */
interface IIssuer {
    // Events
    event IssuerRegistered(
        address indexed issuerAddress,
        string name,
        uint256 registrationDate
    );

    event IssuerAccredited(
        address indexed issuerAddress,
        uint256 accreditationDate,
        address indexed accreditedBy
    );

    event IssuerRevoked(
        address indexed issuerAddress,
        uint256 revocationDate,
        string reason,
        address indexed revokedBy
    );

    event IssuerUpdated(
        address indexed issuerAddress,
        string newName,
        uint256 updateDate
    );

    event IssuerSuspended(
        address indexed issuerAddress,
        uint256 suspensionDate,
        string reason
    );

    event IssuerReactivated(
        address indexed issuerAddress,
        uint256 reactivationDate
    );

    /**
     * @dev Register a new issuer (pending accreditation)
     * @param issuerAddress Ethereum address of the issuer
     * @param name Name of the issuing institution
     * @param metadataURI IPFS CID containing issuer details
     */
    function registerIssuer(
        address issuerAddress,
        string memory name,
        string memory metadataURI
    ) external;

    /**
     * @dev Accredit an issuer (grant permission to issue credentials)
     * @param issuerAddress Address of the issuer to accredit
     */
    function accreditIssuer(address issuerAddress) external;

    /**
     * @dev Revoke issuer accreditation
     * @param issuerAddress Address of the issuer to revoke
     * @param reason Reason for revocation
     */
    function revokeIssuer(address issuerAddress, string memory reason) external;

    /**
     * @dev Suspend issuer temporarily
     * @param issuerAddress Address of the issuer to suspend
     * @param reason Reason for suspension
     */
    function suspendIssuer(
        address issuerAddress,
        string memory reason
    ) external;

    /**
     * @dev Reactivate a suspended issuer
     * @param issuerAddress Address of the issuer to reactivate
     */
    function reactivateIssuer(address issuerAddress) external;

    /**
     * @dev Update issuer information
     * @param issuerAddress Address of the issuer
     * @param newName New name for the issuer
     * @param newMetadataURI New metadata URI
     */
    function updateIssuer(
        address issuerAddress,
        string memory newName,
        string memory newMetadataURI
    ) external;

    /**
     * @dev Check if an issuer is accredited
     * @param issuerAddress Address to check
     * @return True if accredited and active, false otherwise
     */
    function isAccredited(address issuerAddress) external view returns (bool);

    /**
     * @dev Check if an issuer is registered (may not be accredited)
     * @param issuerAddress Address to check
     * @return True if registered, false otherwise
     */
    function isRegistered(address issuerAddress) external view returns (bool);

    /**
     * @dev Get issuer information
     * @param issuerAddress Address of the issuer
     * @return Issuer struct with all details
     */
    function getIssuer(
        address issuerAddress
    ) external view returns (CredentialTypes.Issuer memory);

    /**
     * @dev Get all accredited issuers
     * @return Array of accredited issuer addresses
     */
    function getAllAccreditedIssuers() external view returns (address[] memory);

    /**
     * @dev Get total number of accredited issuers
     * @return Count of accredited issuers
     */
    function getAccreditedIssuerCount() external view returns (uint256);

    /**
     * @dev Get total credentials issued by an issuer
     * @param issuerAddress Address of the issuer
     * @return Total number of credentials issued
     */
    function getIssuerCredentialCount(
        address issuerAddress
    ) external view returns (uint256);

    /**
     * @dev Increment credential count for an issuer
     * @param issuerAddress Address of the issuer
     */
    function incrementIssuerCredentialCount(address issuerAddress) external;

    /**
     * @dev Check if issuer is suspended
     * @param issuerAddress Address to check
     * @return True if suspended, false otherwise
     */
    function isSuspended(address issuerAddress) external view returns (bool);
}
