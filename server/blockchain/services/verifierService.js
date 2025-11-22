// src/blockchain/services/verifierService.js
import { getContract } from '../utils/contractLoader.js';

class VerifierService {
    constructor() {
        this.contract = null;
    }

    _getContract() {
        if (!this.contract) {
            this.contract = getContract('CredentialVerifier');
        }
        return this.contract;
    }

    async verifyCredential(tokenId) {
        try {
            const contract = this._getContract();
            const result = await contract.methods.verifyCredential(tokenId).call();

            return {
                isValid: result.isValid,
                exists: result.exists,
                isActive: result.isActive,
                isExpired: result.isExpired,
                isRevoked: result.isRevoked,
                issuerAccredited: result.issuerAccredited
            };
        } catch (error) {
            console.error('Verify credential error:', error);
            throw new Error(`Failed to verify credential: ${error.message}`);
        }
    }

    async quickValidate(tokenId) {
        try {
            const contract = this._getContract();
            return await contract.methods.isCredentialValid(tokenId).call();
        } catch (error) {
            console.error('Quick validate error:', error);
            throw new Error(`Failed to validate credential: ${error.message}`);
        }
    }

    async verifyBatch(tokenIds) {
        try {
            const contract = this._getContract();
            const results = await contract.methods.verifyCredentialBatch(tokenIds).call();

            return results.map(result => ({
                isValid: result.isValid,
                exists: result.exists,
                isActive: result.isActive,
                isExpired: result.isExpired,
                isRevoked: result.isRevoked,
                issuerAccredited: result.issuerAccredited
            }));
        } catch (error) {
            console.error('Verify batch error:', error);
            throw new Error(`Failed to verify batch: ${error.message}`);
        }
    }
}

export default new VerifierService();
