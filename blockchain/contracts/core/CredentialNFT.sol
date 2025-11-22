// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ICredential.sol";
import "../interfaces/IIssuer.sol";
import "../libraries/CredentialTypes.sol";
import "../libraries/DateUtils.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CredentialNFT
 * @dev Main NFT contract for issuing and managing credentials
 * Extends ERC721 with credential-specific functionality
 */
contract CredentialNFT is ICredential, ERC721URIStorage, Pausable {
    using Counters for Counters.Counter;
    using DateUtils for uint256;

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Reference to IssuerRegistry contract
    IIssuer public issuerRegistry;

    // Credential data storage
    mapping(uint256 => CredentialTypes.Credential) private credentials;
    mapping(uint256 => bool) private _credentialExists;

    // Holder and issuer tracking
    mapping(address => uint256[]) private holderCredentials;
    mapping(address => uint256[]) private issuerCredentials;

    // Soulbound/transfer settings
    mapping(uint256 => bool) private transferable;

    // Contract admin
    address public admin;

    modifier onlyIssuer(uint256 tokenId) {
        require(
            credentials[tokenId].issuerAddress == msg.sender,
            "CredentialNFT: Not the issuer"
        );
        _;
    }

    modifier onlyAccreditedIssuer() {
        require(
            issuerRegistry.isAccredited(msg.sender),
            "CredentialNFT: Issuer not accredited"
        );
        _;
    }

    constructor(
        address _issuerRegistryAddress
    ) ERC721("Skills Passport Credential", "SPC") {
        require(
            _issuerRegistryAddress != address(0),
            "CredentialNFT: Invalid registry address"
        );
        issuerRegistry = IIssuer(_issuerRegistryAddress);
        admin = msg.sender;
    }

    /**
     * @dev Issue a new credential NFT to a holder
     */
    function issueCredential(
        address holder,
        CredentialTypes.CredentialType credentialType,
        string memory metadataURI,
        uint256 expirationDate,
        bool isRevocable,
        bytes32 credentialHash
    ) external override onlyAccreditedIssuer whenNotPaused returns (uint256) {
        require(holder != address(0), "CredentialNFT: Invalid holder address");
        require(
            bytes(metadataURI).length > 0,
            "CredentialNFT: Empty metadata URI"
        );
        require(
            expirationDate == 0 || expirationDate > block.timestamp,
            "CredentialNFT: Invalid expiration date"
        );

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Mint NFT to holder
        _safeMint(holder, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store credential data
        credentials[tokenId] = CredentialTypes.Credential({
            credentialId: tokenId,
            issuerAddress: msg.sender,
            holderAddress: holder,
            credentialType: credentialType,
            metadataURI: metadataURI,
            issueDate: block.timestamp,
            expirationDate: expirationDate,
            isRevocable: isRevocable,
            credentialHash: credentialHash
        });

        _credentialExists[tokenId] = true;
        transferable[tokenId] = true; // Default transferable

        // Update tracking
        holderCredentials[holder].push(tokenId);
        issuerCredentials[msg.sender].push(tokenId);

        // Increment issuer's credential count
        issuerRegistry.incrementIssuerCredentialCount(msg.sender);

        emit CredentialIssued(
            tokenId,
            msg.sender,
            holder,
            credentialType,
            metadataURI,
            expirationDate
        );

        return tokenId;
    }

    /**
     * @dev Revoke a credential (only by original issuer)
     */
    function revokeCredential(
        uint256 tokenId,
        string memory reason
    ) external override onlyIssuer(tokenId) whenNotPaused {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        require(
            credentials[tokenId].isRevocable,
            "CredentialNFT: Credential not revocable"
        );

        address holder = ownerOf(tokenId);

        // Burn the NFT to revoke
        _burn(tokenId);
        _credentialExists[tokenId] = false;

        emit CredentialRevoked(
            tokenId,
            msg.sender,
            holder,
            block.timestamp,
            reason
        );
    }

    /**
     * @dev Renew an expirable credential with new expiration date
     */
    function renewCredential(
        uint256 tokenId,
        uint256 newExpirationDate
    ) external override onlyIssuer(tokenId) whenNotPaused {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        require(
            newExpirationDate > block.timestamp,
            "CredentialNFT: New expiration must be in future"
        );

        uint256 oldExpirationDate = credentials[tokenId].expirationDate;
        credentials[tokenId].expirationDate = newExpirationDate;

        emit CredentialRenewed(tokenId, oldExpirationDate, newExpirationDate);
    }

    /**
     * @dev Update credential metadata URI
     */
    function updateMetadata(
        uint256 tokenId,
        string memory newMetadataURI
    ) external override onlyIssuer(tokenId) whenNotPaused {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        require(
            bytes(newMetadataURI).length > 0,
            "CredentialNFT: Empty metadata URI"
        );

        string memory oldMetadataURI = credentials[tokenId].metadataURI;
        credentials[tokenId].metadataURI = newMetadataURI;
        _setTokenURI(tokenId, newMetadataURI);

        emit CredentialMetadataUpdated(tokenId, oldMetadataURI, newMetadataURI);
    }

    /**
     * @dev Get complete credential information
     */
    function getCredential(
        uint256 tokenId
    ) external view override returns (CredentialTypes.Credential memory) {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        return credentials[tokenId];
    }

    /**
     * @dev Get all credentials owned by a holder
     */
    function getHolderCredentials(
        address holder
    ) external view override returns (uint256[] memory) {
        return holderCredentials[holder];
    }

    /**
     * @dev Get all credentials issued by an issuer
     */
    function getIssuerCredentials(
        address issuer
    ) external view override returns (uint256[] memory) {
        return issuerCredentials[issuer];
    }

    /**
     * @dev Check if a credential exists
     */
    function credentialExists(
        uint256 tokenId
    ) external view override returns (bool) {
        return _credentialExists[tokenId];
    }

    /**
     * @dev Check if a credential is revoked (burned)
     */
    function isRevoked(uint256 tokenId) external view override returns (bool) {
        return
            !_credentialExists[tokenId] && tokenId <= _tokenIdCounter.current();
    }

    /**
     * @dev Check if a credential is expired
     */
    function isExpired(uint256 tokenId) external view override returns (bool) {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        return credentials[tokenId].expirationDate.isExpired();
    }

    /**
     * @dev Get credential status
     */
    function getCredentialStatus(
        uint256 tokenId
    ) external view override returns (CredentialTypes.CredentialStatus) {
        if (
            !_credentialExists[tokenId] && tokenId <= _tokenIdCounter.current()
        ) {
            return CredentialTypes.CredentialStatus.REVOKED;
        }

        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );

        if (credentials[tokenId].expirationDate.isExpired()) {
            return CredentialTypes.CredentialStatus.EXPIRED;
        }

        return CredentialTypes.CredentialStatus.ACTIVE;
    }

    /**
     * @dev Get issuer address for a credential
     */
    function getIssuer(
        uint256 tokenId
    ) external view override returns (address) {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        return credentials[tokenId].issuerAddress;
    }

    /**
     * @dev Get total number of credentials issued
     */
    function getTotalCredentials() external view override returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Check if credential is transferable
     */
    function isTransferable(
        uint256 tokenId
    ) external view override returns (bool) {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        return transferable[tokenId];
    }

    /**
     * @dev Make credential soulbound (non-transferable)
     */
    function makeSoulbound(uint256 tokenId) external onlyIssuer(tokenId) {
        require(
            _credentialExists[tokenId],
            "CredentialNFT: Credential does not exist"
        );
        transferable[tokenId] = false;
    }

    /**
     * @dev Override transfer to enforce soulbound restrictions
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Allow minting and burning
        if (from == address(0) || to == address(0)) {
            return;
        }

        // Check if transferable
        require(transferable[tokenId], "CredentialNFT: Token is soulbound");

        emit CredentialTransferred(tokenId, from, to, block.timestamp);
    }

    /**
     * @dev Pause contract
     */
    function pause() external {
        require(msg.sender == admin, "CredentialNFT: Not admin");
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external {
        require(msg.sender == admin, "CredentialNFT: Not admin");
        _unpause();
    }
}
