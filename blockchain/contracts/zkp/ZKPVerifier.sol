// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ZKPVerifier
 * @dev Interface for all ZK proof verifiers
 */
interface IZKPVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) external view returns (bool);
}

/**
 * @title ZKPVerifier
 * @dev Main contract that aggregates all proof verifiers
 */
contract ZKPVerifier {
    // Verifier contract addresses
    address public ageVerifierAddress;
    address public credentialVerifierAddress;
    address public rankVerifierAddress;

    // Admin
    address public admin;

    // Events
    event VerifierUpdated(string indexed verifierType, address newAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "ZKPVerifier: Not admin");
        _;
    }

    constructor(
        address _ageVerifier,
        address _credentialVerifier,
        address _rankVerifier
    ) {
        require(
            _ageVerifier != address(0),
            "ZKPVerifier: Invalid age verifier"
        );
        require(
            _credentialVerifier != address(0),
            "ZKPVerifier: Invalid credential verifier"
        );
        require(
            _rankVerifier != address(0),
            "ZKPVerifier: Invalid rank verifier"
        );

        ageVerifierAddress = _ageVerifier;
        credentialVerifierAddress = _credentialVerifier;
        rankVerifierAddress = _rankVerifier;
        admin = msg.sender;
    }

    /**
     * @dev Verify age proof
     */
    function verifyAgeProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public view returns (bool) {
        (bool success, bytes memory data) = ageVerifierAddress.staticcall(
            abi.encodeWithSignature(
                "verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[1])",
                a,
                b,
                c,
                input
            )
        );

        require(success, "ZKPVerifier: Age verification failed");
        return abi.decode(data, (bool));
    }

    /**
     * @dev Verify credential possession proof
     */
    function verifyCredentialProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public view returns (bool) {
        (bool success, bytes memory data) = credentialVerifierAddress
            .staticcall(
                abi.encodeWithSignature(
                    "verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])",
                    a,
                    b,
                    c,
                    input
                )
            );

        require(success, "ZKPVerifier: Credential verification failed");
        return abi.decode(data, (bool));
    }

    /**
     * @dev Verify university rank proof
     */
    function verifyRankProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) public view returns (bool) {
        (bool success, bytes memory data) = rankVerifierAddress.staticcall(
            abi.encodeWithSignature(
                "verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[3])",
                a,
                b,
                c,
                input
            )
        );

        require(success, "ZKPVerifier: Rank verification failed");
        return abi.decode(data, (bool));
    }

    /**
     * @dev Update age verifier address
     */
    function updateAgeVerifier(address newAddress) external onlyAdmin {
        require(newAddress != address(0), "ZKPVerifier: Invalid address");
        ageVerifierAddress = newAddress;
        emit VerifierUpdated("AGE", newAddress);
    }

    /**
     * @dev Update credential verifier address
     */
    function updateCredentialVerifier(address newAddress) external onlyAdmin {
        require(newAddress != address(0), "ZKPVerifier: Invalid address");
        credentialVerifierAddress = newAddress;
        emit VerifierUpdated("CREDENTIAL", newAddress);
    }

    /**
     * @dev Update rank verifier address
     */
    function updateRankVerifier(address newAddress) external onlyAdmin {
        require(newAddress != address(0), "ZKPVerifier: Invalid address");
        rankVerifierAddress = newAddress;
        emit VerifierUpdated("RANK", newAddress);
    }

    /**
     * @dev Get all verifier addresses
     */
    function getVerifiers() external view returns (address, address, address) {
        return (
            ageVerifierAddress,
            credentialVerifierAddress,
            rankVerifierAddress
        );
    }
}
