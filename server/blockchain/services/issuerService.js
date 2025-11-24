// src/blockchain/services/issuerService.js
import { getContract } from "../utils/contractLoader.js";
import { getWeb3 } from "../utils/provider.js";
// Removed: import { getAdminAccount } from '../utils/wallet.js';

class IssuerService {
  constructor() {
    this.contract = null;
  }

  _getContract() {
    if (!this.contract) {
      this.contract = getContract("IssuerRegistry");
    }
    return this.contract;
  }

  /**
   * REFRACTORED: Prepare registration transaction.
   * @param {string} senderAddress - The address paying for this tx (Admin or Self)
   */
  async prepareRegisterIssuer(senderAddress, issuerAddress, name, metadataURI) {
    try {
      const contract = this._getContract();

      const txObject = contract.methods.registerIssuer(
        issuerAddress,
        name,
        metadataURI
      );
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: senderAddress,
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare register issuer error:", error);
      throw new Error(`Failed to prepare register issuer: ${error.message}`);
    }
  }

  /**
   * REFRACTORED: Prepare accreditation transaction.
   */
  async prepareAccreditIssuer(senderAddress, issuerAddress) {
    try {
      const contract = this._getContract();
   
      const txObject = contract.methods.accreditIssuer(issuerAddress);
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: senderAddress, // Usually the Admin
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare accredit issuer error:", error);
      throw new Error(`Failed to prepare accredit issuer: ${error.message}`);
    }
  }

  /**
   * REFRACTORED: Prepare suspension transaction.
   */
  async prepareSuspendIssuer(senderAddress, issuerAddress, reason) {
    try {
      const contract = this._getContract();

      const txObject = contract.methods.suspendIssuer(issuerAddress, reason);
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: senderAddress,
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare suspend issuer error:", error);
      throw new Error(`Failed to prepare suspend issuer: ${error.message}`);
    }
  }

  /**
   * REFRACTORED: Prepare revocation transaction.
   */
  async prepareRevokeIssuer(senderAddress, issuerAddress, reason) {
    try {
      const contract = this._getContract();

      const txObject = contract.methods.revokeIssuer(issuerAddress, reason);
      const encodedABI = txObject.encodeABI();

      return {
        to: contract.options.address,
        from: senderAddress,
        data: encodedABI,
      };
    } catch (error) {
      console.error("Prepare revoke issuer error:", error);
      throw new Error(`Failed to prepare revoke issuer: ${error.message}`);
    }
  }

  // --- READ-ONLY METHODS (UNCHANGED) ---

  async isAccredited(issuerAddress) {
    try {
      const contract = this._getContract();
      return await contract.methods.isAccredited(issuerAddress).call();
    } catch (error) {
      console.error("Check accreditation error:", error);
      throw new Error(`Failed to check accreditation: ${error.message}`);
    }
  }

  async getIssuer(issuerAddress) {
    try {
      const contract = this._getContract();
      const issuer = await contract.methods.getIssuer(issuerAddress).call();

      return {
        address: issuer.issuerAddress,
        name: issuer.name,
        metadataURI: issuer.metadataURI,
        isAccredited: issuer.isAccredited,
        isSuspended: issuer.isSuspended,
        registrationDate: Number(issuer.registrationDate),
        accreditationDate: Number(issuer.accreditationDate),
      };
    } catch (error) {
      console.error("Get issuer error:", error);
      throw new Error(`Failed to get issuer: ${error.message}`);
    }
  }

  async getAllAccreditedIssuers() {
    try {
      const contract = this._getContract();
      return await contract.methods.getAllAccreditedIssuers().call();
    } catch (error) {
      console.error("Get all issuers error:", error);
      throw new Error(`Failed to get all issuers: ${error.message}`);
    }
  }
}

export default new IssuerService();
