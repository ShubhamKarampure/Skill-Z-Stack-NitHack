// src/blockchain/services/credentialService.js
import { getContract } from "../utils/contractLoader.js";
import { getWeb3 } from "../utils/provider.js";

class CredentialService {
  constructor() {
    this.contract = null;
  }

  _getContract() {
    if (!this.contract) {
      this.contract = getContract("CredentialNFT");
    }
    return this.contract;
  }

  /**
   * REFRACTORED: Prepares unsigned transaction data for issuing a credential.
   * The Frontend will handle the signing and gas estimation.
   */
  async prepareIssueCredential(issuerAddress, holderAddress, credentialData) {
    try {
      const contract = this._getContract();
      const web3 = getWeb3();

      const {
        credentialType = 0,
        metadataURI,
        expirationDate = 0,
        revocable = true,
        dataHash,
      } = credentialData;

      // Preserve the original hashing logic
      const credentialHash =
        dataHash || web3.utils.keccak256(JSON.stringify(credentialData));

      // Generate the Transaction Object (Unsigned)
      const txObject = contract.methods.issueCredential(
        holderAddress,
        credentialType,
        metadataURI,
        expirationDate,
        revocable,
        credentialHash
      );

      // Encode the ABI (The raw data payload for the blockchain)
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: issuerAddress,
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare issue credential error:", error);
      throw new Error(
        `Failed to prepare credential transaction: ${error.message}`
      );
    }
  }

  /**
   * REFRACTORED: Prepares unsigned transaction data for revoking a credential.
   */
  async prepareRevokeCredential(tokenId, issuerAddress, reason) {
    try {
      const contract = this._getContract();

      const txObject = contract.methods.revokeCredential(tokenId, reason);
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: issuerAddress,
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare revoke credential error:", error);
      throw new Error(`Failed to prepare revoke transaction: ${error.message}`);
    }
  }

  // --- READ-ONLY METHODS (UNCHANGED) ---

  async getCredential(tokenId) {
    try {
      const contract = this._getContract();
      const credential = await contract.methods.getCredential(tokenId).call();

      return {
        tokenId: tokenId.toString(),
        holder: credential.holderAddress,
        issuer: credential.issuerAddress,
        credentialType: Number(credential.credentialType),
        metadataURI: credential.metadataURI,
        issuanceDate: Number(credential.issuanceDate),
        expirationDate: Number(credential.expirationDate),
        revocable: credential.revocable,
        credentialHash: credential.credentialHash,
      };
    } catch (error) {
      console.error("Get credential error:", error);
      throw new Error(`Failed to get credential: ${error.message}`);
    }
  }

  async getHolderCredentials(holderAddress) {
    try {
      const contract = this._getContract();

      const web3 = getWeb3();
      const code = await web3.eth.getCode(contract.options.address);
      if (code === "0x") {
        throw new Error(`Contract not deployed at ${contract.options.address}`);
      }

      const tokenIds = await contract.methods
        .getHolderCredentials(holderAddress)
        .call();
      return tokenIds.map((id) => id.toString());
    } catch (error) {
      console.error("Get holder credentials error:", error);
      throw new Error(`Failed to get holder credentials: ${error.message}`);
    }
  }
}

export default new CredentialService();
