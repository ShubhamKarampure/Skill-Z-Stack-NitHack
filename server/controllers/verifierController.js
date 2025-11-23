// src/controllers/verifierController.js
import verifierService from '../blockchain/services/verifierService.js';
import VerificationLogModel from '../models/VerificationLog.js';

export const verifyCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Verify on blockchain
    const verification = await verifierService.verifyCredential(tokenId);

    // Log verification
    await VerificationLogModel.create({
      tokenId,
      verifier: req.user?.walletAddress || 'anonymous',
      result: verification,
      verifiedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      tokenId,  
      verification
    });

  } catch (error) {
    console.error('Verify Credential Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify credential',
      error: error.message
    });
  }
};

export const quickValidate = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const isValid = await verifierService.quickValidate(tokenId);

    return res.status(200).json({
      success: true,
      tokenId,
      isValid
    });

  } catch (error) {
    console.error('Quick Validate Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate credential',
      error: error.message
    });
  }
};

export const verifyBatch = async (req, res) => {
  try {
    const { tokenIds } = req.body;

    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'tokenIds array is required'
      });
    }

    const results = await verifierService.verifyBatch(tokenIds);

    // Log batch verification
    await VerificationLogModel.insertMany(
      tokenIds.map((tokenId, index) => ({
        tokenId,
        verifier: req.user?.walletAddress || 'anonymous',
        result: results[index],
        verifiedAt: new Date()
      }))
    );

    return res.status(200).json({
      success: true,
      count: results.length,
      results: tokenIds.map((tokenId, index) => ({
        tokenId,
        ...results[index]
      }))
    });

  } catch (error) {
    console.error('Verify Batch Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify batch',
      error: error.message
    });
  }
};

export const getVerificationHistory = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const logs = await VerificationLogModel.find({ tokenId })
      .sort({ verifiedAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      tokenId,
      count: logs.length,
      history: logs
    });

  } catch (error) {
    console.error('Get Verification History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get verification history',
      error: error.message
    });
  }
};
