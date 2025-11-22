import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const uploadToPinata = async (filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const res = await axios.post(url, data, {
        maxBodyLength: Infinity,
        headers: {
            ...data.getHeaders(),
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
        }
    });

    return res.data.IpfsHash;
};
