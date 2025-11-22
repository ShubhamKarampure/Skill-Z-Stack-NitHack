// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IVerifier.sol";
import "../interfaces/ICredential.sol";
import "../interfaces/IIssuer.sol";
import "../libraries/CredentialTypes.sol";
import "../libraries/DateUtils.sol";

/**
 * @title CredentialVerifier
 * @dev Provides comprehensive verification functions for credentials
 * Checks credential validity, issuer accreditation, expiration, and revocation
 */
contract CredentialVerifier is IVerifier {
    using DateUtils for uint256;

    // Contract references
    ICredential public credentialNFT;
    IIssuer public issuerRegistry;

    // Verification tracking
    mapping(address => uint256) private verificationCounts;

    constructor(address _credentialNFTAddress, address _issuerRegistryAddress) {
        require(
            _credentialNFTAddress != address(0),
            "CredentialVerifier: Invalid NFT address"
        );
        require(
            _issuerRegistryAddress != address(0),
            "CredentialVerifier: Invalid registry address"
        );

        credentialNFT = ICredential(_credentialNFTAddress);
        issuerRegistry = IIssuer(_issuerRegistryAddress);
    }

    /**
     * @dev Verify a credential's authenticity and validity (internal logic)
     */
    function _verifyCredentialInternal(
        uint256 tokenId
    ) internal view returns (CredentialTypes.VerificationResult memory) {
        bool exists = credentialNFT.credentialExists(tokenId);
        bool isRevoked = !exists &&
            tokenId <= credentialNFT.getTotalCredentials();
        bool isExpired = exists ? credentialNFT.isExpired(tokenId) : false;

        address issuer = exists ? credentialNFT.getIssuer(tokenId) : address(0);
        bool issuerAccredited = issuer != address(0)
            ? issuerRegistry.isAccredited(issuer)
            : false;

        CredentialTypes.CredentialStatus status;
        if (isRevoked) {
            status = CredentialTypes.CredentialStatus.REVOKED;
        } else if (isExpired) {
            status = CredentialTypes.CredentialStatus.EXPIRED;
        } else if (exists) {
            status = CredentialTypes.CredentialStatus.ACTIVE;
        } else {
            status = CredentialTypes.CredentialStatus.REVOKED;
        }

        bool isActive = exists && !isRevoked && !isExpired;
        bool isValid = isActive && issuerAccredited;

        return
            CredentialTypes.VerificationResult({
                isValid: isValid,
                exists: exists,
                isActive: isActive,
                isExpired: isExpired,
                isRevoked: isRevoked,
                issuerAccredited: issuerAccredited,
                status: status
            });
    }

    /**
     * @dev Verify a credential's authenticity and validity (view-only, no events)
     */
    function verifyCredential(
        uint256 tokenId
    )
        external
        view
        override
        returns (CredentialTypes.VerificationResult memory)
    {
        return _verifyCredentialInternal(tokenId);
    }

    /**
     * @dev Verify a credential and emit event (non-view version for tracking)
     */
    function verifyCredentialWithEvent(
        uint256 tokenId
    ) external returns (CredentialTypes.VerificationResult memory) {
        CredentialTypes.VerificationResult
            memory result = _verifyCredentialInternal(tokenId);

        verificationCounts[msg.sender]++;
        emit CredentialVerified(
            tokenId,
            msg.sender,
            result.isValid,
            block.timestamp
        );

        return result;
    }

    /**
     * @dev Verify multiple credentials in batch
     */
    function verifyCredentialBatch(
        uint256[] memory tokenIds
    )
        external
        view
        override
        returns (CredentialTypes.VerificationResult[] memory)
    {
        CredentialTypes.VerificationResult[]
            memory results = new CredentialTypes.VerificationResult[](
                tokenIds.length
            );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            results[i] = _verifyCredentialInternal(tokenIds[i]);
        }

        return results;
    }

    /**
     * @dev Verify multiple credentials in batch with event emission
     */
    function verifyCredentialBatchWithEvent(
        uint256[] memory tokenIds
    ) external returns (CredentialTypes.VerificationResult[] memory) {
        CredentialTypes.VerificationResult[]
            memory results = new CredentialTypes.VerificationResult[](
                tokenIds.length
            );

        uint256 validCount = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            results[i] = _verifyCredentialInternal(tokenIds[i]);
            if (results[i].isValid) {
                validCount++;
            }
        }

        verificationCounts[msg.sender] += tokenIds.length;
        emit BatchVerificationCompleted(
            msg.sender,
            tokenIds.length,
            validCount,
            block.timestamp
        );

        return results;
    }

    /**
     * @dev Quick check if credential is valid
     */
    function isCredentialValid(
        uint256 tokenId
    ) external view override returns (bool) {
        if (!credentialNFT.credentialExists(tokenId)) {
            return false;
        }

        if (credentialNFT.isRevoked(tokenId)) {
            return false;
        }

        if (credentialNFT.isExpired(tokenId)) {
            return false;
        }

        address issuer = credentialNFT.getIssuer(tokenId);
        if (!issuerRegistry.isAccredited(issuer)) {
            return false;
        }

        return true;
    }

    /**
     * @dev Verify credential ownership
     */
    function verifyOwnership(
        uint256 tokenId,
        address claimedHolder
    ) external view override returns (bool) {
        if (!credentialNFT.credentialExists(tokenId)) {
            return false;
        }

        CredentialTypes.Credential memory credential = credentialNFT
            .getCredential(tokenId);
        return credential.holderAddress == claimedHolder;
    }

    /**
     * @dev Verify that issuer is accredited
     */
    function verifyIssuer(
        address issuerAddress
    ) external view override returns (bool) {
        return issuerRegistry.isAccredited(issuerAddress);
    }

    /**
     * @dev Verify credential against a specific hash
     */
    function verifyCredentialHash(
        uint256 tokenId,
        bytes32 claimedHash
    ) external view override returns (bool) {
        if (!credentialNFT.credentialExists(tokenId)) {
            return false;
        }

        CredentialTypes.Credential memory credential = credentialNFT
            .getCredential(tokenId);
        return credential.credentialHash == claimedHash;
    }

    /**
     * @dev Get verification count for a verifier
     */
    function getVerificationCount(
        address verifierAddress
    ) external view override returns (uint256) {
        return verificationCounts[verifierAddress];
    }

    /**
     * @dev Verify credential with detailed checks
     */
    function verifyCredentialDetailed(
        uint256 tokenId
    )
        external
        view
        override
        returns (
            bool exists,
            bool isActive,
            bool issuerAccredited,
            bool isExpired,
            bool isRevoked
        )
    {
        exists = credentialNFT.credentialExists(tokenId);
        isRevoked = credentialNFT.isRevoked(tokenId);
        isExpired = exists ? credentialNFT.isExpired(tokenId) : false;

        address issuer = exists ? credentialNFT.getIssuer(tokenId) : address(0);
        issuerAccredited = issuer != address(0)
            ? issuerRegistry.isAccredited(issuer)
            : false;

        isActive = exists && !isRevoked && !isExpired;

        return (exists, isActive, issuerAccredited, isExpired, isRevoked);
    }

    /**
     * @dev Verify zero-knowledge proof claim
     */
    function verifyZKProof(
        bytes32 proofHash,
        CredentialTypes.ZKPClaim memory claim
    ) external pure override returns (bool) {
        // This will be implemented when ZKP contracts are added
        // For now, return basic validation
        require(
            proofHash != bytes32(0),
            "CredentialVerifier: Invalid proof hash"
        );
        require(
            bytes(claim.claimType).length > 0,
            "CredentialVerifier: Invalid claim type"
        );

        // No event emission in view function
        return true;
    }

    /**
     * @dev Verify zero-knowledge proof claim with event
     */
    function verifyZKProofWithEvent(
        bytes32 proofHash,
        CredentialTypes.ZKPClaim memory claim
    ) external returns (bool) {
        require(
            proofHash != bytes32(0),
            "CredentialVerifier: Invalid proof hash"
        );
        require(
            bytes(claim.claimType).length > 0,
            "CredentialVerifier: Invalid claim type"
        );

        emit ZKPVerified(proofHash, msg.sender, true, block.timestamp);

        return true;
    }

    /**
     * @dev Check if credential type matches expected type
     */
    function verifyCredentialType(
        uint256 tokenId,
        CredentialTypes.CredentialType expectedType
    ) external view override returns (bool) {
        if (!credentialNFT.credentialExists(tokenId)) {
            return false;
        }

        CredentialTypes.Credential memory credential = credentialNFT
            .getCredential(tokenId);
        return credential.credentialType == expectedType;
    }

    /**
     * @dev Get verification result as boolean and reason
     */
    function getVerificationStatus(
        uint256 tokenId
    ) external view override returns (bool isValid, string memory reason) {
        if (!credentialNFT.credentialExists(tokenId)) {
            return (false, "Credential does not exist");
        }

        if (credentialNFT.isRevoked(tokenId)) {
            return (false, "Credential has been revoked");
        }

        if (credentialNFT.isExpired(tokenId)) {
            return (false, "Credential has expired");
        }

        address issuer = credentialNFT.getIssuer(tokenId);
        if (!issuerRegistry.isAccredited(issuer)) {
            return (false, "Issuer is not accredited");
        }

        return (true, "Credential is valid");
    }
}
