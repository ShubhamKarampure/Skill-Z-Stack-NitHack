// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RevocationRegistry
 * @dev Tracks revoked credentials for verification purposes
 * Provides a centralized registry of all revoked credential IDs
 */
contract RevocationRegistry is Ownable, Pausable {
    // Revocation tracking
    mapping(uint256 => bool) private revokedCredentials;
    mapping(uint256 => RevocationInfo) private revocationDetails;

    // Authorized contracts that can add revocations
    mapping(address => bool) private authorizedContracts;

    // Revocation information
    struct RevocationInfo {
        uint256 tokenId;
        address issuer;
        address holder;
        uint256 revocationDate;
        string reason;
        bool exists;
    }

    // Arrays for enumeration
    uint256[] private revokedTokenIds;

    // Events
    event CredentialRevoked(
        uint256 indexed tokenId,
        address indexed issuer,
        address indexed holder,
        uint256 revocationDate,
        string reason
    );

    event ContractAuthorized(
        address indexed contractAddress,
        uint256 timestamp
    );
    event ContractDeauthorized(
        address indexed contractAddress,
        uint256 timestamp
    );

    modifier onlyAuthorized() {
        require(
            authorizedContracts[msg.sender] || msg.sender == owner(),
            "RevocationRegistry: Not authorized"
        );
        _;
    }

    constructor() {}

    /**
     * @dev Add a revoked credential to the registry
     */
    function addRevocation(
        uint256 tokenId,
        address issuer,
        address holder,
        string memory reason
    ) external onlyAuthorized whenNotPaused {
        require(
            !revokedCredentials[tokenId],
            "RevocationRegistry: Already revoked"
        );

        revokedCredentials[tokenId] = true;
        revocationDetails[tokenId] = RevocationInfo({
            tokenId: tokenId,
            issuer: issuer,
            holder: holder,
            revocationDate: block.timestamp,
            reason: reason,
            exists: true
        });

        revokedTokenIds.push(tokenId);

        emit CredentialRevoked(
            tokenId,
            issuer,
            holder,
            block.timestamp,
            reason
        );
    }

    /**
     * @dev Check if a credential is revoked
     */
    function isRevoked(uint256 tokenId) external view returns (bool) {
        return revokedCredentials[tokenId];
    }

    /**
     * @dev Get revocation details
     */
    function getRevocationInfo(
        uint256 tokenId
    ) external view returns (RevocationInfo memory) {
        require(
            revocationDetails[tokenId].exists,
            "RevocationRegistry: Not revoked"
        );
        return revocationDetails[tokenId];
    }

    /**
     * @dev Get all revoked token IDs
     */
    function getAllRevokedTokenIds() external view returns (uint256[] memory) {
        return revokedTokenIds;
    }

    /**
     * @dev Get total number of revoked credentials
     */
    function getTotalRevoked() external view returns (uint256) {
        return revokedTokenIds.length;
    }

    /**
     * @dev Authorize a contract to add revocations
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        require(
            contractAddress != address(0),
            "RevocationRegistry: Invalid address"
        );
        require(
            !authorizedContracts[contractAddress],
            "RevocationRegistry: Already authorized"
        );

        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress, block.timestamp);
    }

    /**
     * @dev Deauthorize a contract
     */
    function deauthorizeContract(address contractAddress) external onlyOwner {
        require(
            authorizedContracts[contractAddress],
            "RevocationRegistry: Not authorized"
        );

        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress, block.timestamp);
    }

    /**
     * @dev Check if a contract is authorized
     */
    function isAuthorized(
        address contractAddress
    ) external view returns (bool) {
        return authorizedContracts[contractAddress];
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
