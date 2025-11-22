// src/blockchain/services/issuerService.js
import { getContract } from '../utils/contractLoader.js';
import { getAdminAccount } from '../utils/wallet.js';
import { getWeb3 } from '../utils/provider.js';

class IssuerService {
    constructor() {
        this.contract = null;
    }

    _getContract() {
        if (!this.contract) {
            this.contract = getContract('IssuerRegistry');
        }
        return this.contract;
    }

    async registerIssuer(issuerAddress, name, metadataURI) {
        try {
            const contract = this._getContract();
            const admin = getAdminAccount();
            const web3 = getWeb3();

            const tx = contract.methods.registerIssuer(issuerAddress, name, metadataURI);

            // Fix: Convert BigInt to Number
            const gasEstimate = await tx.estimateGas({ from: admin.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: admin.address,
                gas: Number(gasEstimate) + 50000, // Add buffer without multiplication
                gasPrice: gasPrice.toString() // Convert BigInt to string
            });

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                issuerAddress,
                blockNumber: Number(receipt.blockNumber)
            };
        } catch (error) {
            console.error('Register issuer error:', error);
            throw new Error(`Failed to register issuer: ${error.message}`);
        }
    }

    async accreditIssuer(issuerAddress) {
        try {
            const contract = this._getContract();
            const admin = getAdminAccount();
            const web3 = getWeb3();

            const tx = contract.methods.accreditIssuer(issuerAddress);

            // Fix: Convert BigInt properly
            const gasEstimate = await tx.estimateGas({ from: admin.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: admin.address,
                gas: Number(gasEstimate) + 50000,
                gasPrice: gasPrice.toString()
            });

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                issuerAddress
            };
        } catch (error) {
            console.error('Accredit issuer error:', error);
            throw new Error(`Failed to accredit issuer: ${error.message}`);
        }
    }

    async isAccredited(issuerAddress) {
        try {
            const contract = this._getContract();
            return await contract.methods.isAccredited(issuerAddress).call();
        } catch (error) {
            console.error('Check accreditation error:', error);
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
                accreditationDate: Number(issuer.accreditationDate)
            };
        } catch (error) {
            console.error('Get issuer error:', error);
            throw new Error(`Failed to get issuer: ${error.message}`);
        }
    }

    async getAllAccreditedIssuers() {
        try {
            const contract = this._getContract();
            return await contract.methods.getAllAccreditedIssuers().call();
        } catch (error) {
            console.error('Get all issuers error:', error);
            throw new Error(`Failed to get all issuers: ${error.message}`);
        }
    }

    async suspendIssuer(issuerAddress, reason) {
        try {
            const contract = this._getContract();
            const admin = getAdminAccount();
            const web3 = getWeb3();

            const tx = contract.methods.suspendIssuer(issuerAddress, reason);

            const gasEstimate = await tx.estimateGas({ from: admin.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: admin.address,
                gas: Number(gasEstimate) + 50000,
                gasPrice: gasPrice.toString()
            });

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                issuerAddress
            };
        } catch (error) {
            console.error('Suspend issuer error:', error);
            throw new Error(`Failed to suspend issuer: ${error.message}`);
        }
    }

    async revokeIssuer(issuerAddress, reason) {
        try {
            const contract = this._getContract();
            const admin = getAdminAccount();
            const web3 = getWeb3();

            const tx = contract.methods.revokeIssuer(issuerAddress, reason);

            const gasEstimate = await tx.estimateGas({ from: admin.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: admin.address,
                gas: Number(gasEstimate) + 50000,
                gasPrice: gasPrice.toString()
            });

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                issuerAddress
            };
        } catch (error) {
            console.error('Revoke issuer error:', error);
            throw new Error(`Failed to revoke issuer: ${error.message}`);
        }
    }
}

export default new IssuerService();
