import zkpService from '../blockchain/services/zkpService.js';
import VerificationLogModel from '../models/VerificationLog.js';

export const verifyProof = async (req, res) => {
    try {
        const { proofType, proof, publicSignals } = req.body;

        if (!proofType || !proof || !publicSignals) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: proofType, proof, publicSignals'
            });
        }

        let isValid = false;

        switch (proofType) {
            case 'age':
                isValid = await zkpService.verifyAgeProof(proof, publicSignals);
                break;
            case 'credential':
                isValid = await zkpService.verifyCredentialProof(proof, publicSignals);
                break;
            case 'rank':
                isValid = await zkpService.verifyRankProof(proof, publicSignals);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid proofType. Must be one of: age, credential, rank'
                });
        }

        // Log verification
        await VerificationLogModel.create({
            tokenId: 'ZKP-' + Date.now(), // Placeholder for ZKP
            verifier: req.user?.walletAddress || 'anonymous',
            result: { isValid, proofType },
            verifiedAt: new Date()
        });

        return res.status(200).json({
            success: true,
            isValid
        });

    } catch (error) {
        console.error('Verify Proof Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify proof',
            error: error.message
        });
    }
};
