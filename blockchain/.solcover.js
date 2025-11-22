module.exports = {
    skipFiles: [
        'Migrations.sol',
        'test/',
        'zkp/AgeVerifier.sol', // Auto-generated
        'zkp/CredentialProofVerifier.sol', // Auto-generated
        'zkp/UniversityRankVerifier.sol' // Auto-generated
    ],
    configureYulOptimizer: true,
    solcOptimizerDetails: {
        yul: true,
        yulDetails: {
            stackAllocation: true
        }
    },
    mocha: {
        timeout: 100000,
        grep: "@skip-on-coverage",
        invert: true
    }
};
