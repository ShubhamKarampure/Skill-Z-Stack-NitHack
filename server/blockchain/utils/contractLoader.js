// src/blockchain/utils/contractLoader.js
import { getWeb3 } from './provider.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load contract addresses
const addressesPath = path.join(__dirname, '../config/development_addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));

// Load ABIs
const loadABI = (contractName) => {
    const abiPath = path.join(__dirname, '../abis', `${contractName}.json`);
    const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    return contractJson.abi;
};

// Contract instances cache
const contracts = {};

export const getContract = (contractName) => {
    if (!contracts[contractName]) {
        const web3 = getWeb3();
        const abi = loadABI(contractName);
        let address;

        switch (contractName) {
            case 'IssuerRegistry':
                address = addresses.IssuerRegistry;
                break;
            case 'CredentialNFT':
                address = addresses.CredentialNFT;
                break;
            case 'CredentialVerifier':
                address = addresses.CredentialVerifier;
                break;
            case 'RevocationRegistry':
                address = addresses.RevocationRegistry;
                break;
            case 'IssuerDAO':
                address = addresses.governance?.IssuerDAO;
                break;
            case 'Timelock':
                address = addresses.governance?.Timelock;
                break;
            case 'AgeVerifier':
                address = addresses.zkp?.AgeVerifier;
                break;
            case 'CredentialProofVerifier':
                address = addresses.zkp?.CredentialProofVerifier;
                break;
            case 'UniversityRankVerifier':
                address = addresses.zkp?.UniversityRankVerifier;
                break;
            case 'ZKPVerifier':
                address = addresses.zkp?.ZKPVerifier;
                break;
            case 'SelectiveDisclosure':
                address = addresses.zkp?.SelectiveDisclosure;
                break;
            default:
                throw new Error(`Unknown contract: ${contractName}`);
        }

        if (!address) {
            throw new Error(`Address not found for ${contractName}`);
        }

        contracts[contractName] = new web3.eth.Contract(abi, address);
        console.log(`✓ Loaded ${contractName} at ${address}`);
    }

    return contracts[contractName];
};

export const loadAllContracts = () => {
    return {
        issuerRegistry: getContract('IssuerRegistry'),
        credentialNFT: getContract('CredentialNFT'),
        credentialVerifier: getContract('CredentialVerifier'),
        revocationRegistry: getContract('RevocationRegistry'),
        issuerDAO: getContract('IssuerDAO'),
        timelock: getContract('Timelock')
    };
};

export { addresses };
