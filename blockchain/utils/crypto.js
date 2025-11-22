// utils/crypto.js
const crypto = require('crypto');
const { keccak256 } = require('web3-utils');

/**
 * Generate Keccak256 hash of data
 * @param {string|Buffer|Object} data - Data to hash
 * @returns {string} Hash in hex format with 0x prefix
 */
function generateHash(data) {
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }
    return keccak256(data);
}

/**
 * Generate credential hash from credential data
 * @param {Object} credentialData - Credential information
 * @returns {string} Credential hash
 */
function generateCredentialHash(credentialData) {
    const {
        holder,
        issuer,
        credentialType,
        issueDate,
        degree,
        university,
        grade
    } = credentialData;

    // Combine all credential fields for hashing
    const dataString = [
        holder,
        issuer,
        credentialType,
        issueDate,
        degree || '',
        university || '',
        grade || ''
    ].join('|');

    return generateHash(dataString);
}

/**
 * Generate metadata hash for integrity verification
 * @param {Object} metadata - Metadata object
 * @returns {string} Metadata hash
 */
function generateMetadataHash(metadata) {
    const metadataString = JSON.stringify(metadata, Object.keys(metadata).sort());
    return generateHash(metadataString);
}

/**
 * Verify credential hash matches data
 * @param {Object} credentialData - Credential data
 * @param {string} expectedHash - Expected hash to verify against
 * @returns {boolean} True if hash matches
 */
function verifyCredentialHash(credentialData, expectedHash) {
    const computedHash = generateCredentialHash(credentialData);
    return computedHash.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Generate random salt for hashing
 * @param {number} length - Length of salt in bytes
 * @returns {string} Random salt in hex format
 */
function generateSalt(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash data with salt (SHA256)
 * @param {string} data - Data to hash
 * @param {string} salt - Salt for hashing
 * @returns {string} Salted hash
 */
function hashWithSalt(data, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(data + salt);
    return hash.digest('hex');
}

/**
 * Generate commitment for zero-knowledge proof
 * @param {string} secret - Secret value
 * @param {string} salt - Random salt
 * @returns {string} Commitment hash
 */
function generateCommitment(secret, salt) {
    return keccak256(secret + salt);
}

/**
 * Sign message with private key
 * @param {string} message - Message to sign
 * @param {string} privateKey - Private key (with or without 0x prefix)
 * @returns {Object} Signature object with r, s, v
 */
function signMessage(message, privateKey) {
    const Web3 = require('web3');
    const web3 = new Web3();

    // Ensure private key has 0x prefix
    if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
    }

    const messageHash = generateHash(message);
    const signature = web3.eth.accounts.sign(messageHash, privateKey);

    return {
        messageHash: signature.messageHash,
        r: signature.r,
        s: signature.s,
        v: signature.v,
        signature: signature.signature
    };
}

/**
 * Recover signer address from signature
 * @param {string} message - Original message
 * @param {string} signature - Signature string
 * @returns {string} Recovered address
 */
function recoverSigner(message, signature) {
    const Web3 = require('web3');
    const web3 = new Web3();

    const messageHash = generateHash(message);
    return web3.eth.accounts.recover(messageHash, signature);
}

/**
 * Verify signature matches expected signer
 * @param {string} message - Original message
 * @param {string} signature - Signature string
 * @param {string} expectedSigner - Expected signer address
 * @returns {boolean} True if signature is valid
 */
function verifySignature(message, signature, expectedSigner) {
    const recoveredAddress = recoverSigner(message, signature);
    return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
}

/**
 * Generate Merkle root from array of hashes
 * @param {Array<string>} leaves - Array of leaf hashes
 * @returns {string} Merkle root hash
 */
function generateMerkleRoot(leaves) {
    if (leaves.length === 0) {
        throw new Error('Cannot generate Merkle root from empty array');
    }

    if (leaves.length === 1) {
        return leaves[0];
    }

    const tree = [...leaves];

    while (tree.length > 1) {
        const newLevel = [];

        for (let i = 0; i < tree.length; i += 2) {
            if (i + 1 < tree.length) {
                const combined = tree[i] + tree[i + 1].replace('0x', '');
                newLevel.push(keccak256(combined));
            } else {
                newLevel.push(tree[i]);
            }
        }

        tree.splice(0, tree.length, ...newLevel);
    }

    return tree[0];
}

/**
 * Encrypt data using AES-256-GCM
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key (32 bytes)
 * @returns {Object} Encrypted data with IV and auth tag
 */
function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

/**
 * Decrypt data using AES-256-GCM
 * @param {string} encryptedData - Encrypted data in hex
 * @param {string} key - Decryption key (32 bytes)
 * @param {string} iv - Initialization vector
 * @param {string} authTag - Authentication tag
 * @returns {string} Decrypted data
 */
function decryptData(encryptedData, key, iv, authTag) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(key, 'hex'),
        Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate deterministic hash from multiple inputs
 * @param {...string} inputs - Variable number of input strings
 * @returns {string} Combined hash
 */
function hashMultiple(...inputs) {
    const combined = inputs.join('');
    return generateHash(combined);
}

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid address
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Normalize Ethereum address to checksum format
 * @param {string} address - Address to normalize
 * @returns {string} Checksummed address
 */
function toChecksumAddress(address) {
    const Web3 = require('web3');
    const web3 = new Web3();
    return web3.utils.toChecksumAddress(address);
}

module.exports = {
    generateHash,
    generateCredentialHash,
    generateMetadataHash,
    verifyCredentialHash,
    generateSalt,
    hashWithSalt,
    generateCommitment,
    signMessage,
    recoverSigner,
    verifySignature,
    generateMerkleRoot,
    encryptData,
    decryptData,
    hashMultiple,
    isValidAddress,
    toChecksumAddress
};
