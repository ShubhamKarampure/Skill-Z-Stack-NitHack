// src/controllers/credentialMetadataController.js
import { uploadFileToPinata, uploadJSONToPinata } from '../utils/pinata.js';
import CredentialModel from '../models/Credential.js';

export const uploadCredentialMetadata = async (req, res) => {
    try {
        const file = req.file;
        const { name, description, credentialType, additionalData } = req.body;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        // Upload image to Pinata
        const imageCID = await uploadFileToPinata(file.path);
        const imageURL = `ipfs://${imageCID}`;

        // Build metadata JSON
        const metadata = {
            name: name || 'Credential NFT',
            description: description || 'Issued credential',
            image: imageURL,
            credentialType: credentialType || 'DEGREE',
            issuedBy: req.user?.walletAddress || '',
            issuedAt: new Date().toISOString(),
            ...JSON.parse(additionalData || '{}')
        };

        // Upload metadata to Pinata
        const metadataCID = await uploadJSONToPinata(metadata);
        const metadataURI = `ipfs://${metadataCID}`;

        return res.status(201).json({
            success: true,
            message: 'Metadata uploaded successfully',
            data: {
                imageCID,
                imageURL,
                metadataCID,
                metadataURI,
                metadata
            }
        });

    } catch (error) {
        console.error('Upload Metadata Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload metadata',
            error: error.message
        });
    }
};

export const getMetadata = async (req, res) => {
    try {
        const { cid } = req.params;

        // In production, fetch from IPFS gateway
        const metadataURL = `https://gateway.pinata.cloud/ipfs/${cid}`;

        return res.status(200).json({
            success: true,
            metadataURL
        });

    } catch (error) {
        console.error('Get Metadata Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get metadata',
            error: error.message
        });
    }
};
