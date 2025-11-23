import { getContract } from '../utils/contractLoader.js';

class ZKPService {
    constructor() {
        this.ageVerifier = null;
        this.credentialVerifier = null;
        this.rankVerifier = null;
    }

    _getAgeVerifier() {
        if (!this.ageVerifier) {
            this.ageVerifier = getContract('AgeVerifier');
        }
        return this.ageVerifier;
    }

    _getCredentialVerifier() {
        if (!this.credentialVerifier) {
            this.credentialVerifier = getContract('CredentialProofVerifier');
        }
        return this.credentialVerifier;
    }

    _getRankVerifier() {
        if (!this.rankVerifier) {
            this.rankVerifier = getContract('UniversityRankVerifier');
        }
        return this.rankVerifier;
    }

    async verifyAgeProof(proof, publicSignals) {
        try {
            const contract = this._getAgeVerifier();
            const { a, b, c } = proof;
            
            // Ensure publicSignals is an array of strings/numbers
            const signals = Array.isArray(publicSignals) ? publicSignals : [publicSignals];

            const isValid = await contract.methods.verifyProof(a, b, c, signals).call();
            return isValid;
        } catch (error) {
            console.error('Verify age proof error:', error);
            throw new Error(`Failed to verify age proof: ${error.message}`);
        }
    }

    async verifyCredentialProof(proof, publicSignals) {
        try {
            const contract = this._getCredentialVerifier();
            const { a, b, c } = proof;
            
            const signals = Array.isArray(publicSignals) ? publicSignals : [publicSignals];

            const isValid = await contract.methods.verifyProof(a, b, c, signals).call();
            return isValid;
        } catch (error) {
            console.error('Verify credential proof error:', error);
            throw new Error(`Failed to verify credential proof: ${error.message}`);
        }
    }

    async verifyRankProof(proof, publicSignals) {
        try {
            const contract = this._getRankVerifier();
            const { a, b, c } = proof;
            
            const signals = Array.isArray(publicSignals) ? publicSignals : [publicSignals];

            const isValid = await contract.methods.verifyProof(a, b, c, signals).call();
            return isValid;
        } catch (error) {
            console.error('Verify rank proof error:', error);
            throw new Error(`Failed to verify rank proof: ${error.message}`);
        }
    }
}

export default new ZKPService();
