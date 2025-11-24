import { getWeb3 } from "./provider.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAddressFile = () => {
  const network = process.env.NETWORK || "development";

  if (network === "sepolia") {
    console.log("Loading Contract Addresses: SEPOLIA");
    return "sepolia_addresses.json";
  } else {
    console.log("Loading Contract Addresses: DEVELOPMENT");
    return "development_addresses.json";
  }
};

const addressesPath = path.join(__dirname, "../config", getAddressFile());

if (!fs.existsSync(addressesPath)) {
  console.error(`Address file not found at: ${addressesPath}`);
  process.exit(1);
}

const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

const loadABI = (contractName) => {
  try {
    const abiPath = path.join(__dirname, "../abis", `${contractName}.json`);
    const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    return contractJson.abi;
  } catch (error) {
    console.error(`Failed to load ABI for ${contractName}:`, error.message);
    throw error;
  }
};

const contracts = {};

export const getContract = (contractName) => {
  if (!contracts[contractName]) {
    const web3 = getWeb3();
    const abi = loadABI(contractName);
    let address;

    switch (contractName) {
      case "IssuerRegistry":
        address = addresses.IssuerRegistry;
        break;
      case "CredentialNFT":
        address = addresses.CredentialNFT;
        break;
      case "CredentialVerifier":
        address = addresses.CredentialVerifier;
        break;
      case "RevocationRegistry":
        address = addresses.RevocationRegistry;
        break;
      case "IssuerDAO":
        address = addresses.governance?.IssuerDAO;
        break;
      case "Timelock":
        address = addresses.governance?.Timelock;
        break;
      case "AgeVerifier":
        address = addresses.zkp?.AgeVerifier;
        break;
      case "CredentialProofVerifier":
        address = addresses.zkp?.CredentialProofVerifier;
        break;
      case "UniversityRankVerifier":
        address = addresses.zkp?.UniversityRankVerifier;
        break;
      case "ZKPVerifier":
        address = addresses.zkp?.ZKPVerifier;
        break;
      case "SelectiveDisclosure":
        address = addresses.zkp?.SelectiveDisclosure;
        break;
      default:
        throw new Error(`Unknown contract: ${contractName}`);
    }

    if (!address) {
      console.warn(`Address missing for ${contractName}`);
      return null;
    }

    contracts[contractName] = new web3.eth.Contract(abi, address);
  }

  return contracts[contractName];
};

export { addresses };
