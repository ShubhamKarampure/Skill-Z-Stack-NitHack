// src/blockchain/services/credentialService.js
import { getContract } from '../utils/contractLoader.js';
import { getWeb3 } from '../utils/provider.js';

class CredentialService {
    constructor() {
        this.contract = null;
    }

    _getContract() {
        if (!this.contract) {
            this.contract = getContract('CredentialNFT');
        }
        return this.contract;
    }

    async issueCredential(issuerPrivateKey, holderAddress, credentialData) {
        try {
            const contract = this._getContract();
            const web3 = getWeb3();

            const issuerAccount = web3.eth.accounts.privateKeyToAccount(issuerPrivateKey);

            const {
                credentialType = 0,
                metadataURI,
                expirationDate = 0,
                revocable = true,
                dataHash
            } = credentialData;

            const credentialHash = dataHash || web3.utils.keccak256(JSON.stringify(credentialData));

            const tx = contract.methods.issueCredential(
                holderAddress,
                credentialType,
                metadataURI,
                expirationDate,
                revocable,
                credentialHash
            );

            // Fix: Handle BigInt properly
            const gasEstimate = await tx.estimateGas({ from: issuerAccount.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: issuerAccount.address,
                gas: Number(gasEstimate) + 100000, // Add fixed buffer
                gasPrice: gasPrice.toString()
            });

            const event = receipt.events.CredentialIssued;
            const tokenId = event.returnValues.tokenId;

            return {
                success: true,
                tokenId: tokenId.toString(),
                transactionHash: receipt.transactionHash,
                blockNumber: Number(receipt.blockNumber)
            };
        } catch (error) {
            console.error('Issue credential error:', error);
            throw new Error(`Failed to issue credential: ${error.message}`);
        }
    }

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
                credentialHash: credential.credentialHash
            };
        } catch (error) {
            console.error('Get credential error:', error);
            throw new Error(`Failed to get credential: ${error.message}`);
        }
    }

    async getHolderCredentials(holderAddress) {
        try {
            const contract = this._getContract();
            
            // Verify contract exists
            const web3 = getWeb3();
            const code = await web3.eth.getCode(contract.options.address);
            if (code === '0x') {
                throw new Error(`Contract not deployed at ${contract.options.address}`);
            }

            const tokenIds = await contract.methods.getHolderCredentials(holderAddress).call();
            return tokenIds.map(id => id.toString());
        } catch (error) {
            console.error('Get holder credentials error:', error);
            throw new Error(`Failed to get holder credentials: ${error.message}`);
        }
    }

    async revokeCredential(tokenId, issuerPrivateKey, reason) {
        try {
            const contract = this._getContract();
            const web3 = getWeb3();

            const issuerAccount = web3.eth.accounts.privateKeyToAccount(issuerPrivateKey);

            const tx = contract.methods.revokeCredential(tokenId, reason);

            const gasEstimate = await tx.estimateGas({ from: issuerAccount.address });
            const gasPrice = await web3.eth.getGasPrice();

            const receipt = await tx.send({
                from: issuerAccount.address,
                gas: Number(gasEstimate) + 50000,
                gasPrice: gasPrice.toString()
            });

            return {
                success: true,
                tokenId: tokenId.toString(),
                transactionHash: receipt.transactionHash
            };
        } catch (error) {
            console.error('Revoke credential error:', error);
            throw new Error(`Failed to revoke credential: ${error.message}`);
        }
    }
}

export default new CredentialService();
