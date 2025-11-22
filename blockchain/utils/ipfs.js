// utils/ipfs.js
require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { generateMetadataHash } = require('./crypto');
const { IPFS_GATEWAYS } = require('./constants');

// Initialize Pinata SDK
const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

/**
 * Test Pinata authentication
 * @returns {Promise<boolean>} True if authenticated
 */
async function testAuthentication() {
    try {
        const result = await pinata.testAuthentication();
        console.log('✓ Pinata authentication successful');
        return result.authenticated;
    } catch (error) {
        console.error('✗ Pinata authentication failed:', error.message);
        throw new Error('Pinata authentication failed');
    }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - Metadata object to upload
 * @param {string} name - Name for the pinned file
 * @returns {Promise<Object>} Upload result with IPFS hash
 */
async function uploadMetadata(metadata, name = 'credential-metadata') {
    try {
        // Add hash to metadata for integrity verification
        metadata.contentHash = generateMetadataHash(metadata);
        metadata.uploadTimestamp = Math.floor(Date.now() / 1000);

        const options = {
            pinataMetadata: {
                name: name,
                keyvalues: {
                    type: 'credential-metadata',
                    timestamp: metadata.uploadTimestamp.toString()
                }
            },
            pinataOptions: {
                cidVersion: 1
            }
        };

        const result = await pinata.pinJSONToIPFS(metadata, options);

        console.log(`✓ Metadata uploaded to IPFS: ${result.IpfsHash}`);

        return {
            success: true,
            ipfsHash: result.IpfsHash,
            pinSize: result.PinSize,
            timestamp: result.Timestamp,
            gatewayUrl: `${IPFS_GATEWAYS.PINATA}${result.IpfsHash}`
        };
    } catch (error) {
        console.error('✗ Failed to upload metadata to IPFS:', error.message);
        throw error;
    }
}

/**
 * Upload file to IPFS via Pinata
 * @param {string} filePath - Path to file to upload
 * @param {string} name - Name for the pinned file
 * @returns {Promise<Object>} Upload result with IPFS hash
 */
async function uploadFile(filePath, name) {
    try {
        const readableStreamForFile = fs.createReadStream(filePath);

        const options = {
            pinataMetadata: {
                name: name || path.basename(filePath),
                keyvalues: {
                    type: 'file',
                    originalName: path.basename(filePath)
                }
            },
            pinataOptions: {
                cidVersion: 1
            }
        };

        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

        console.log(`✓ File uploaded to IPFS: ${result.IpfsHash}`);

        return {
            success: true,
            ipfsHash: result.IpfsHash,
            pinSize: result.PinSize,
            timestamp: result.Timestamp,
            gatewayUrl: `${IPFS_GATEWAYS.PINATA}${result.IpfsHash}`
        };
    } catch (error) {
        console.error('✗ Failed to upload file to IPFS:', error.message);
        throw error;
    }
}

/**
 * Retrieve metadata from IPFS
 * @param {string} ipfsHash - IPFS hash (CID)
 * @param {string} gateway - IPFS gateway to use
 * @returns {Promise<Object>} Retrieved metadata
 */
async function retrieveMetadata(ipfsHash, gateway = IPFS_GATEWAYS.PINATA) {
    try {
        // Remove ipfs:// prefix if present
        ipfsHash = ipfsHash.replace('ipfs://', '');

        const url = `${gateway}${ipfsHash}`;
        const response = await axios.get(url, { timeout: 10000 });

        console.log(`✓ Metadata retrieved from IPFS: ${ipfsHash}`);

        return {
            success: true,
            metadata: response.data,
            ipfsHash: ipfsHash
        };
    } catch (error) {
        console.error('✗ Failed to retrieve metadata from IPFS:', error.message);
        throw error;
    }
}

/**
 * Pin existing IPFS hash to Pinata
 * @param {string} ipfsHash - IPFS hash to pin
 * @param {string} name - Name for the pin
 * @returns {Promise<Object>} Pin result
 */
async function pinByHash(ipfsHash, name) {
    try {
        const options = {
            pinataMetadata: {
                name: name,
                keyvalues: {
                    type: 'pinned-hash'
                }
            }
        };

        const result = await pinata.pinByHash(ipfsHash, options);

        console.log(`✓ Hash pinned to Pinata: ${ipfsHash}`);

        return {
            success: true,
            ipfsHash: result.IpfsHash,
            status: result.status
        };
    } catch (error) {
        console.error('✗ Failed to pin hash:', error.message);
        throw error;
    }
}

/**
 * Unpin content from Pinata
 * @param {string} ipfsHash - IPFS hash to unpin
 * @returns {Promise<boolean>} True if unpinned successfully
 */
async function unpinContent(ipfsHash) {
    try {
        await pinata.unpin(ipfsHash);
        console.log(`✓ Content unpinned from Pinata: ${ipfsHash}`);
        return true;
    } catch (error) {
        console.error('✗ Failed to unpin content:', error.message);
        throw error;
    }
}

/**
 * List all pinned content
 * @param {Object} filters - Filters for listing (optional)
 * @returns {Promise<Array>} Array of pinned items
 */
async function listPinnedContent(filters = {}) {
    try {
        const result = await pinata.pinList(filters);
        console.log(`✓ Found ${result.count} pinned items`);
        return result.rows;
    } catch (error) {
        console.error('✗ Failed to list pinned content:', error.message);
        throw error;
    }
}

/**
 * Generate complete credential metadata object
 * @param {Object} credentialInfo - Credential information
 * @returns {Object} Complete metadata object
 */
function generateCredentialMetadata(credentialInfo) {
    const {
        credentialId,
        holderName,
        holderAddress,
        issuerName,
        issuerAddress,
        credentialType,
        degree,
        fieldOfStudy,
        university,
        issueDate,
        expirationDate,
        grade,
        description,
        imageUrl
    } = credentialInfo;

    return {
        name: `${credentialType} - ${holderName}`,
        description: description || `${credentialType} credential issued to ${holderName}`,
        image: imageUrl || '',
        attributes: [
            {
                trait_type: 'Credential ID',
                value: credentialId
            },
            {
                trait_type: 'Holder Name',
                value: holderName
            },
            {
                trait_type: 'Holder Address',
                value: holderAddress
            },
            {
                trait_type: 'Issuer Name',
                value: issuerName
            },
            {
                trait_type: 'Issuer Address',
                value: issuerAddress
            },
            {
                trait_type: 'Credential Type',
                value: credentialType
            },
            {
                trait_type: 'Degree',
                value: degree || 'N/A'
            },
            {
                trait_type: 'Field of Study',
                value: fieldOfStudy || 'N/A'
            },
            {
                trait_type: 'University',
                value: university || 'N/A'
            },
            {
                trait_type: 'Issue Date',
                value: new Date(issueDate * 1000).toISOString(),
                display_type: 'date'
            },
            {
                trait_type: 'Expiration Date',
                value: expirationDate === 0 ? 'Never' : new Date(expirationDate * 1000).toISOString(),
                display_type: expirationDate === 0 ? 'string' : 'date'
            },
            {
                trait_type: 'Grade',
                value: grade || 'N/A'
            }
        ],
        properties: {
            credentialId: credentialId,
            holderAddress: holderAddress,
            issuerAddress: issuerAddress,
            issueDate: issueDate,
            expirationDate: expirationDate
        }
    };
}

/**
 * Convert IPFS hash to different formats
 * @param {string} ipfsHash - IPFS hash
 * @returns {Object} Different format representations
 */
function formatIPFSHash(ipfsHash) {
    ipfsHash = ipfsHash.replace('ipfs://', '');

    return {
        hash: ipfsHash,
        uri: `ipfs://${ipfsHash}`,
        pinataGateway: `${IPFS_GATEWAYS.PINATA}${ipfsHash}`,
        ipfsIoGateway: `${IPFS_GATEWAYS.IPFS_IO}${ipfsHash}`,
        cloudflareGateway: `${IPFS_GATEWAYS.CLOUDFLARE}${ipfsHash}`
    };
}

module.exports = {
    testAuthentication,
    uploadMetadata,
    uploadFile,
    retrieveMetadata,
    pinByHash,
    unpinContent,
    listPinnedContent,
    generateCredentialMetadata,
    formatIPFSHash
};
