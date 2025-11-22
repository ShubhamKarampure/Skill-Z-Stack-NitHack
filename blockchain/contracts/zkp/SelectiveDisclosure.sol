// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ICredential.sol";
import "../libraries/CredentialTypes.sol";
import "./ZKPVerifier.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SelectiveDisclosure
 * @dev Enables privacy-preserving credential verification using zero-knowledge proofs
 * Allows students to prove claims about their credentials without revealing full details
 */
contract SelectiveDisclosure is ReentrancyGuard {
    // Contract references
    ICredential public credentialNFT;
    ZKPVerifier public zkpVerifier;

    // Admin
    address public admin;

    // Proof types
    enum ProofType {
        AGE_PROOF,
        CREDENTIAL_POSSESSION,
        UNIVERSITY_RANK
    }

    // Disclosure request structure
    struct DisclosureRequest {
        uint256 requestId;
        address requester;
        address holder;
        ProofType proofType;
        uint256 timestamp;
        bool verified;
        bytes32 proofHash;
    }

    // Claim structure
    struct Claim {
        string claimType;
        uint256 claimValue;
        bool verified;
        uint256 verificationTimestamp;
    }

    // Storage
    mapping(uint256 => DisclosureRequest) public disclosureRequests;
    mapping(bytes32 => bool) public usedProofs;
    mapping(address => uint256[]) public holderRequests;
    mapping(address => uint256[]) public verifierRequests;
    mapping(bytes32 => Claim) public verifiedClaims;

    uint256 public requestCounter;

    // Events
    event DisclosureRequested(
        uint256 indexed requestId,
        address indexed requester,
        address indexed holder,
        ProofType proofType,
        uint256 timestamp
    );

    event ProofVerified(
        uint256 indexed requestId,
        address indexed holder,
        ProofType proofType,
        bool success,
        bytes32 proofHash
    );

    event ClaimVerified(
        bytes32 indexed claimHash,
        address indexed holder,
        string claimType,
        bool verified
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "SelectiveDisclosure: Not admin");
        _;
    }

    constructor(address _credentialNFTAddress, address _zkpVerifierAddress) {
        require(
            _credentialNFTAddress != address(0),
            "SelectiveDisclosure: Invalid NFT address"
        );
        require(
            _zkpVerifierAddress != address(0),
            "SelectiveDisclosure: Invalid verifier address"
        );

        credentialNFT = ICredential(_credentialNFTAddress);
        zkpVerifier = ZKPVerifier(_zkpVerifierAddress);
        admin = msg.sender;
    }

    /**
     * @dev Request a selective disclosure from a credential holder
     */
    function requestDisclosure(
        address holder,
        ProofType proofType
    ) external returns (uint256) {
        require(holder != address(0), "SelectiveDisclosure: Invalid holder");

        requestCounter++;
        uint256 requestId = requestCounter;

        disclosureRequests[requestId] = DisclosureRequest({
            requestId: requestId,
            requester: msg.sender,
            holder: holder,
            proofType: proofType,
            timestamp: block.timestamp,
            verified: false,
            proofHash: bytes32(0)
        });

        holderRequests[holder].push(requestId);
        verifierRequests[msg.sender].push(requestId);

        emit DisclosureRequested(
            requestId,
            msg.sender,
            holder,
            proofType,
            block.timestamp
        );

        return requestId;
    }

    /**
     * @dev Verify age proof (prove age > threshold without revealing birth year)
     */
    function verifyAgeProof(
        uint256 requestId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory publicInputs
    ) external nonReentrant returns (bool) {
        DisclosureRequest storage request = disclosureRequests[requestId];
        require(
            request.requestId == requestId,
            "SelectiveDisclosure: Invalid request"
        );
        require(
            request.holder == msg.sender,
            "SelectiveDisclosure: Not the holder"
        );
        require(
            request.proofType == ProofType.AGE_PROOF,
            "SelectiveDisclosure: Wrong proof type"
        );
        require(!request.verified, "SelectiveDisclosure: Already verified");

        // Verify the zero-knowledge proof
        bool isValid = zkpVerifier.verifyAgeProof(a, b, c, publicInputs);

        // Generate proof hash
        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, publicInputs));
        require(
            !usedProofs[proofHash],
            "SelectiveDisclosure: Proof already used"
        );

        if (isValid) {
            request.verified = true;
            request.proofHash = proofHash;
            usedProofs[proofHash] = true;

            // Store verified claim
            bytes32 claimHash = keccak256(
                abi.encodePacked(msg.sender, "AGE_ABOVE_THRESHOLD")
            );
            verifiedClaims[claimHash] = Claim({
                claimType: "AGE_ABOVE_THRESHOLD",
                claimValue: publicInputs[0],
                verified: true,
                verificationTimestamp: block.timestamp
            });

            emit ClaimVerified(
                claimHash,
                msg.sender,
                "AGE_ABOVE_THRESHOLD",
                true
            );
        }

        emit ProofVerified(
            requestId,
            msg.sender,
            ProofType.AGE_PROOF,
            isValid,
            proofHash
        );

        return isValid;
    }

    /**
     * @dev Verify credential possession proof
     */
    function verifyCredentialPossession(
        uint256 requestId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory publicInputs // [currentTimestamp, credentialHash]
    ) external nonReentrant returns (bool) {
        DisclosureRequest storage request = disclosureRequests[requestId];
        require(
            request.requestId == requestId,
            "SelectiveDisclosure: Invalid request"
        );
        require(
            request.holder == msg.sender,
            "SelectiveDisclosure: Not the holder"
        );
        require(
            request.proofType == ProofType.CREDENTIAL_POSSESSION,
            "SelectiveDisclosure: Wrong proof type"
        );
        require(!request.verified, "SelectiveDisclosure: Already verified");

        // Verify the zero-knowledge proof
        bool isValid = zkpVerifier.verifyCredentialProof(a, b, c, publicInputs);

        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, publicInputs));
        require(
            !usedProofs[proofHash],
            "SelectiveDisclosure: Proof already used"
        );

        if (isValid) {
            request.verified = true;
            request.proofHash = proofHash;
            usedProofs[proofHash] = true;

            bytes32 claimHash = keccak256(
                abi.encodePacked(msg.sender, "CREDENTIAL_POSSESSION")
            );
            verifiedClaims[claimHash] = Claim({
                claimType: "CREDENTIAL_POSSESSION",
                claimValue: 1,
                verified: true,
                verificationTimestamp: block.timestamp
            });

            emit ClaimVerified(
                claimHash,
                msg.sender,
                "CREDENTIAL_POSSESSION",
                true
            );
        }

        emit ProofVerified(
            requestId,
            msg.sender,
            ProofType.CREDENTIAL_POSSESSION,
            isValid,
            proofHash
        );

        return isValid;
    }

    /**
     * @dev Verify university rank proof (prove rank within range)
     */
    function verifyUniversityRankProof(
        uint256 requestId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory publicInputs // [minRank, maxRank, credentialHash]
    ) external nonReentrant returns (bool) {
        DisclosureRequest storage request = disclosureRequests[requestId];
        require(
            request.requestId == requestId,
            "SelectiveDisclosure: Invalid request"
        );
        require(
            request.holder == msg.sender,
            "SelectiveDisclosure: Not the holder"
        );
        require(
            request.proofType == ProofType.UNIVERSITY_RANK,
            "SelectiveDisclosure: Wrong proof type"
        );
        require(!request.verified, "SelectiveDisclosure: Already verified");

        // Verify the zero-knowledge proof
        bool isValid = zkpVerifier.verifyRankProof(a, b, c, publicInputs);

        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, publicInputs));
        require(
            !usedProofs[proofHash],
            "SelectiveDisclosure: Proof already used"
        );

        if (isValid) {
            request.verified = true;
            request.proofHash = proofHash;
            usedProofs[proofHash] = true;

            bytes32 claimHash = keccak256(
                abi.encodePacked(msg.sender, "UNIVERSITY_IN_RANK_RANGE")
            );
            verifiedClaims[claimHash] = Claim({
                claimType: "UNIVERSITY_IN_RANK_RANGE",
                claimValue: publicInputs[1], // maxRank
                verified: true,
                verificationTimestamp: block.timestamp
            });

            emit ClaimVerified(
                claimHash,
                msg.sender,
                "UNIVERSITY_IN_RANK_RANGE",
                true
            );
        }

        emit ProofVerified(
            requestId,
            msg.sender,
            ProofType.UNIVERSITY_RANK,
            isValid,
            proofHash
        );

        return isValid;
    }

    /**
     * @dev Get disclosure request details
     */
    function getDisclosureRequest(
        uint256 requestId
    ) external view returns (DisclosureRequest memory) {
        return disclosureRequests[requestId];
    }

    /**
     * @dev Get all requests for a holder
     */
    function getHolderRequests(
        address holder
    ) external view returns (uint256[] memory) {
        return holderRequests[holder];
    }

    /**
     * @dev Get all requests made by a verifier
     */
    function getVerifierRequests(
        address verifier
    ) external view returns (uint256[] memory) {
        return verifierRequests[verifier];
    }

    /**
     * @dev Check if a claim has been verified
     */
    function isClaimVerified(
        address holder,
        string memory claimType
    ) external view returns (bool) {
        bytes32 claimHash = keccak256(abi.encodePacked(holder, claimType));
        return verifiedClaims[claimHash].verified;
    }

    /**
     * @dev Get verified claim details
     */
    function getClaim(
        address holder,
        string memory claimType
    ) external view returns (Claim memory) {
        bytes32 claimHash = keccak256(abi.encodePacked(holder, claimType));
        return verifiedClaims[claimHash];
    }

    /**
     * @dev Check if a proof has been used
     */
    function isProofUsed(bytes32 proofHash) external view returns (bool) {
        return usedProofs[proofHash];
    }

    /**
     * @dev Update ZKP verifier address
     */
    function updateZKPVerifier(address newVerifier) external onlyAdmin {
        require(
            newVerifier != address(0),
            "SelectiveDisclosure: Invalid address"
        );
        zkpVerifier = ZKPVerifier(newVerifier);
    }

    /**
     * @dev Get total number of requests
     */
    function getTotalRequests() external view returns (uint256) {
        return requestCounter;
    }
}
