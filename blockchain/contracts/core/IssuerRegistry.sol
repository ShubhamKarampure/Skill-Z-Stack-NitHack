// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IIssuer.sol";
import "../libraries/CredentialTypes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title IssuerRegistry
 * @dev Manages issuer registration, accreditation, and validation
 * Only accredited issuers can issue credentials
 */
contract IssuerRegistry is IIssuer, AccessControl, Pausable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ACCREDITOR_ROLE = keccak256("ACCREDITOR_ROLE");

    // Issuer data storage
    mapping(address => CredentialTypes.Issuer) private issuers;
    mapping(address => bool) private registered;
    mapping(address => bool) private suspended;
    mapping(address => string) private issuerMetadataURIs;

    // Arrays for enumeration
    address[] private accreditedIssuersList;
    address[] private allIssuersList;

    // Issuer credential count tracking
    mapping(address => uint256) private issuerCredentialCounts;

    constructor() {
        // Grant admin role to contract deployer
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(ACCREDITOR_ROLE, msg.sender);
    }

    /**
     * @dev Register a new issuer (pending accreditation)
     */
    function registerIssuer(
        address issuerAddress,
        string memory name,
        string memory metadataURI
    ) external override whenNotPaused {
        require(
            issuerAddress != address(0),
            "IssuerRegistry: Invalid issuer address"
        );
        require(
            !registered[issuerAddress],
            "IssuerRegistry: Issuer already registered"
        );
        require(bytes(name).length > 0, "IssuerRegistry: Name cannot be empty");

        issuers[issuerAddress] = CredentialTypes.Issuer({
            issuerAddress: issuerAddress,
            name: name,
            isAccredited: false,
            accreditationDate: 0,
            totalIssued: 0
        });

        registered[issuerAddress] = true;
        issuerMetadataURIs[issuerAddress] = metadataURI;
        allIssuersList.push(issuerAddress);

        emit IssuerRegistered(issuerAddress, name, block.timestamp);
    }

    /**
     * @dev Accredit an issuer (grant permission to issue credentials)
     */
    function accreditIssuer(
        address issuerAddress
    ) external override onlyRole(ACCREDITOR_ROLE) whenNotPaused {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        require(
            !issuers[issuerAddress].isAccredited,
            "IssuerRegistry: Already accredited"
        );
        require(
            !suspended[issuerAddress],
            "IssuerRegistry: Issuer is suspended"
        );

        issuers[issuerAddress].isAccredited = true;
        issuers[issuerAddress].accreditationDate = block.timestamp;
        accreditedIssuersList.push(issuerAddress);

        emit IssuerAccredited(issuerAddress, block.timestamp, msg.sender);
    }

    /**
     * @dev Revoke issuer accreditation
     */
    function revokeIssuer(
        address issuerAddress,
        string memory reason
    ) external override onlyRole(ACCREDITOR_ROLE) whenNotPaused {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        require(
            issuers[issuerAddress].isAccredited,
            "IssuerRegistry: Not accredited"
        );

        issuers[issuerAddress].isAccredited = false;
        _removeFromAccreditedList(issuerAddress);

        emit IssuerRevoked(issuerAddress, block.timestamp, reason, msg.sender);
    }

    /**
     * @dev Suspend issuer temporarily
     */
    function suspendIssuer(
        address issuerAddress,
        string memory reason
    ) external override onlyRole(ADMIN_ROLE) whenNotPaused {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        require(!suspended[issuerAddress], "IssuerRegistry: Already suspended");

        suspended[issuerAddress] = true;

        if (issuers[issuerAddress].isAccredited) {
            issuers[issuerAddress].isAccredited = false;
            _removeFromAccreditedList(issuerAddress);
        }

        emit IssuerSuspended(issuerAddress, block.timestamp, reason);
    }

    /**
     * @dev Reactivate a suspended issuer
     */
    function reactivateIssuer(
        address issuerAddress
    ) external override onlyRole(ADMIN_ROLE) whenNotPaused {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        require(suspended[issuerAddress], "IssuerRegistry: Not suspended");

        suspended[issuerAddress] = false;

        emit IssuerReactivated(issuerAddress, block.timestamp);
    }

    /**
     * @dev Update issuer information
     */
    function updateIssuer(
        address issuerAddress,
        string memory newName,
        string memory newMetadataURI
    ) external override whenNotPaused {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        require(
            msg.sender == issuerAddress || hasRole(ADMIN_ROLE, msg.sender),
            "IssuerRegistry: Unauthorized"
        );

        if (bytes(newName).length > 0) {
            issuers[issuerAddress].name = newName;
        }

        if (bytes(newMetadataURI).length > 0) {
            issuerMetadataURIs[issuerAddress] = newMetadataURI;
        }

        emit IssuerUpdated(issuerAddress, newName, block.timestamp);
    }

    /**
     * @dev Check if an issuer is accredited
     */
    function isAccredited(
        address issuerAddress
    ) external view override returns (bool) {
        return issuers[issuerAddress].isAccredited && !suspended[issuerAddress];
    }

    /**
     * @dev Check if an issuer is registered
     */
    function isRegistered(
        address issuerAddress
    ) external view override returns (bool) {
        return registered[issuerAddress];
    }

    /**
     * @dev Get issuer information
     */
    function getIssuer(
        address issuerAddress
    ) external view override returns (CredentialTypes.Issuer memory) {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        return issuers[issuerAddress];
    }

    /**
     * @dev Get all accredited issuers
     */
    function getAllAccreditedIssuers()
        external
        view
        override
        returns (address[] memory)
    {
        return accreditedIssuersList;
    }

    /**
     * @dev Get total number of accredited issuers
     */
    function getAccreditedIssuerCount()
        external
        view
        override
        returns (uint256)
    {
        return accreditedIssuersList.length;
    }

    /**
     * @dev Get total credentials issued by an issuer
     */
    function getIssuerCredentialCount(
        address issuerAddress
    ) external view override returns (uint256) {
        return issuerCredentialCounts[issuerAddress];
    }

    /**
     * @dev Increment credential count for an issuer (called by CredentialNFT)
     */
    function incrementIssuerCredentialCount(
        address issuerAddress
    ) external override {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        issuerCredentialCounts[issuerAddress]++;
        issuers[issuerAddress].totalIssued++;
    }

    /**
     * @dev Check if issuer is suspended
     */
    function isSuspended(
        address issuerAddress
    ) external view override returns (bool) {
        return suspended[issuerAddress];
    }

    /**
     * @dev Get issuer metadata URI
     */
    function getIssuerMetadataURI(
        address issuerAddress
    ) external view returns (string memory) {
        require(
            registered[issuerAddress],
            "IssuerRegistry: Issuer not registered"
        );
        return issuerMetadataURIs[issuerAddress];
    }

    /**
     * @dev Get all registered issuers (including non-accredited)
     */
    function getAllIssuers() external view returns (address[] memory) {
        return allIssuersList;
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Internal function to remove issuer from accredited list
     */
    function _removeFromAccreditedList(address issuerAddress) private {
        for (uint256 i = 0; i < accreditedIssuersList.length; i++) {
            if (accreditedIssuersList[i] == issuerAddress) {
                accreditedIssuersList[i] = accreditedIssuersList[
                    accreditedIssuersList.length - 1
                ];
                accreditedIssuersList.pop();
                break;
            }
        }
    }
}
