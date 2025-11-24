// utils/constants.js
require('dotenv').config();

/**
 * Network Configurations
 */
const NETWORKS = {
  development: {
    name: "Development (Ganache)",
    networkId: 1337,
    rpcUrl: process.env.GANACHE_URL || "http://localhost:8545",
    gasPrice: "20000000000", // 20 Gwei
    gasLimit: 6721975,
    confirmations: 0,
    timeoutBlocks: 200,
  },
  ganache: {
    name: "Ganache Local",
    networkId: 5777,
    rpcUrl: "http://127.0.0.1:8545",
    gasPrice: "20000000000",
    gasLimit: 6721975,
    confirmations: 0,
    timeoutBlocks: 200,
  },
  sepolia: {
    name: "Sepolia Testnet",
    networkId: 11155111,
    rpcUrl:
      process.env.ALCHEMY_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    gasPrice: "30000000000", // 30 Gwei
    gasLimit: 8000000,
    confirmations: 2,
    timeoutBlocks: 200,
    chainId: 11155111,
  },
  mainnet: {
    name: "Ethereum Mainnet",
    networkId: 1,
    rpcUrl:
      process.env.MAINNET_RPC_URL ||
      "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    gasPrice: "50000000000", // 50 Gwei
    gasLimit: 8000000,
    confirmations: 3,
    timeoutBlocks: 200,
    chainId: 1,
  },
};

/**
 * Gas Limit Configurations for Different Operations
 */
const GAS_LIMITS = {
    // Credential operations
    ISSUE_CREDENTIAL: 500000,
    REVOKE_CREDENTIAL: 150000,
    RENEW_CREDENTIAL: 100000,
    UPDATE_METADATA: 80000,
    TRANSFER_CREDENTIAL: 120000,

    // Issuer operations
    REGISTER_ISSUER: 300000,
    ACCREDIT_ISSUER: 200000,
    REVOKE_ISSUER: 150000,
    UPDATE_ISSUER: 100000,

    // Verification operations
    VERIFY_CREDENTIAL: 100000,
    VERIFY_BATCH: 500000,

    // ZKP operations
    VERIFY_ZK_PROOF: 300000,

    // DAO operations
    CREATE_PROPOSAL: 250000,
    VOTE_PROPOSAL: 150000,
    EXECUTE_PROPOSAL: 300000,

    // Default
    DEFAULT: 200000
};

/**
 * Credential Type Mappings (matches Solidity enum)
 */
const CREDENTIAL_TYPES = {
    DEGREE: 0,
    CERTIFICATE: 1,
    BADGE: 2,
    LICENSE: 3,
    MEMBERSHIP: 4,
    SKILL_CERTIFICATION: 5,
    AWARD: 6,
    OTHER: 7
};

/**
 * Credential Type Display Names
 */
const CREDENTIAL_TYPE_NAMES = {
    0: 'Degree',
    1: 'Certificate',
    2: 'Badge',
    3: 'License',
    4: 'Membership',
    5: 'Skill Certification',
    6: 'Award',
    7: 'Other'
};

/**
 * Credential Status Mappings (matches Solidity enum)
 */
const CREDENTIAL_STATUS = {
    ACTIVE: 0,
    EXPIRED: 1,
    REVOKED: 2,
    SUSPENDED: 3
};

/**
 * Credential Status Display Names
 */
const CREDENTIAL_STATUS_NAMES = {
    0: 'Active',
    1: 'Expired',
    2: 'Revoked',
    3: 'Suspended'
};

/**
 * Time Constants (in seconds)
 */
const TIME_CONSTANTS = {
    SECONDS_PER_DAY: 86400,
    SECONDS_PER_HOUR: 3600,
    SECONDS_PER_MINUTE: 60,
    DAYS_PER_YEAR: 365,
    SECONDS_PER_YEAR: 31536000, // 365 * 86400
    DAYS_PER_MONTH: 30,
    SECONDS_PER_MONTH: 2592000 // 30 * 86400
};

/**
 * Contract Names
 */
const CONTRACT_NAMES = {
    CREDENTIAL_NFT: 'CredentialNFT',
    ISSUER_REGISTRY: 'IssuerRegistry',
    CREDENTIAL_VERIFIER: 'CredentialVerifier',
    REVOCATION_REGISTRY: 'RevocationRegistry',
    ZKP_VERIFIER: 'ZKPVerifier',
    SELECTIVE_DISCLOSURE: 'SelectiveDisclosure',
    ISSUER_DAO: 'IssuerDAO',
    TIMELOCK: 'Timelock'
};

/**
 * IPFS Gateways
 */
const IPFS_GATEWAYS = {
    PINATA: 'https://gateway.pinata.cloud/ipfs/',
    IPFS_IO: 'https://ipfs.io/ipfs/',
    CLOUDFLARE: 'https://cloudflare-ipfs.com/ipfs/',
    INFURA: 'https://infura-ipfs.io/ipfs/'
};

/**
 * Error Messages
 */
const ERROR_MESSAGES = {
    INVALID_ADDRESS: 'Invalid Ethereum address',
    INVALID_TOKEN_ID: 'Invalid token ID',
    UNAUTHORIZED: 'Unauthorized operation',
    CREDENTIAL_NOT_FOUND: 'Credential not found',
    ISSUER_NOT_ACCREDITED: 'Issuer is not accredited',
    CREDENTIAL_EXPIRED: 'Credential has expired',
    CREDENTIAL_REVOKED: 'Credential has been revoked',
    INVALID_EXPIRATION_DATE: 'Invalid expiration date',
    NETWORK_ERROR: 'Network connection error',
    TRANSACTION_FAILED: 'Transaction failed',
    INSUFFICIENT_GAS: 'Insufficient gas for transaction'
};

/**
 * DAO Configuration
 */
const DAO_CONFIG = {
    VOTING_PERIOD: 7 * TIME_CONSTANTS.SECONDS_PER_DAY, // 7 days
    VOTING_DELAY: 1 * TIME_CONSTANTS.SECONDS_PER_DAY, // 1 day
    QUORUM_PERCENTAGE: 50, // 50% quorum required
    PROPOSAL_THRESHOLD: 1, // Minimum tokens to create proposal
    TIMELOCK_DELAY: 2 * TIME_CONSTANTS.SECONDS_PER_DAY // 2 days
};

/**
 * Deployment Configuration
 */
const DEPLOYMENT_CONFIG = {
    VERIFY_CONTRACTS: process.env.VERIFY_CONTRACTS === 'true',
    SAVE_DEPLOYMENTS: true,
    DEPLOYMENT_FILE: './deployed/addresses.json',
    ABI_OUTPUT_DIR: './deployed/abis/',
    GAS_REPORTER: process.env.REPORT_GAS === 'true'
};

/**
 * Helper function to get network by chainId
 */
function getNetworkByChainId(chainId) {
    const network = Object.values(NETWORKS).find(net => net.chainId === chainId);
    return network || NETWORKS.development;
}

/**
 * Helper function to get credential type name
 */
function getCredentialTypeName(typeId) {
    return CREDENTIAL_TYPE_NAMES[typeId] || 'Unknown';
}

/**
 * Helper function to get credential status name
 */
function getCredentialStatusName(statusId) {
    return CREDENTIAL_STATUS_NAMES[statusId] || 'Unknown';
}

/**
 * Helper function to calculate expiration date
 */
function calculateExpirationDate(durationInDays) {
    const now = Math.floor(Date.now() / 1000);
    return now + (durationInDays * TIME_CONSTANTS.SECONDS_PER_DAY);
}

/**
 * Helper function to check if date is expired
 */
function isExpired(expirationTimestamp) {
    if (expirationTimestamp === 0) return false; // Never expires
    const now = Math.floor(Date.now() / 1000);
    return now > expirationTimestamp;
}

module.exports = {
    NETWORKS,
    GAS_LIMITS,
    CREDENTIAL_TYPES,
    CREDENTIAL_TYPE_NAMES,
    CREDENTIAL_STATUS,
    CREDENTIAL_STATUS_NAMES,
    TIME_CONSTANTS,
    CONTRACT_NAMES,
    IPFS_GATEWAYS,
    ERROR_MESSAGES,
    DAO_CONFIG,
    DEPLOYMENT_CONFIG,
    getNetworkByChainId,
    getCredentialTypeName,
    getCredentialStatusName,
    calculateExpirationDate,
    isExpired
};
