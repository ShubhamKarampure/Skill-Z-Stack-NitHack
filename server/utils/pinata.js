// src/utils/pinata.js
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export const uploadFileToPinata = async (filePath) => {
    try {
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

        const data = new FormData();
        data.append('file', fs.createReadStream(filePath));

        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY
            }
        });

        // Delete local file after upload
        fs.unlinkSync(filePath);

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Pinata file upload error:', error);
        throw new Error('Failed to upload file to IPFS');
    }
};

export const uploadJSONToPinata = async (jsonData) => {
    try {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

        const response = await axios.post(url, jsonData, {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY
            }
        });

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Pinata JSON upload error:', error);
        throw new Error('Failed to upload JSON to IPFS');
    }
};
