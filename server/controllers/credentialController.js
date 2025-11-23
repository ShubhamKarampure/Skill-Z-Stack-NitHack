// src/controllers/credentialController.js
import credentialService from '../blockchain/services/credentialService.js';
import UserModel from '../models/User.js';
import CredentialModel from '../models/Credential.js';

export const issueCredential = async (req, res) => {
  try {
    const {
      issuerPrivateKey,
      holderAddress,
      credentialType,
      metadataURI,
      expirationDate,
      revocable,
      credentialData,
      metadata // Allow passing metadata directly for DB storage
    } = req.body;

    // Validation
    if (!issuerPrivateKey || !holderAddress || !metadataURI) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Issue on blockchain
    const result = await credentialService.issueCredential(
      issuerPrivateKey,
      holderAddress,
      {
        credentialType: credentialType || 0,
        metadataURI,
        expirationDate: expirationDate || 0,
        revocable: revocable !== undefined ? revocable : true,
        ...credentialData
      }
    );

    // Save metadata to database
    const credential = await CredentialModel.create({
      tokenId: result.tokenId,
      holder: holderAddress.toLowerCase(),
      issuer: req.user?.walletAddress || holderAddress,
      credentialType: credentialType || 0,
      metadataURI,
      metadata, // Save the metadata object
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      issuedAt: new Date()
    });

    // Update user's credentials
    await UserModel.findOneAndUpdate(
      { walletAddress: holderAddress.toLowerCase() },
      { $push: { 'studentData.credentials': result.tokenId } }
    );

    return res.status(201).json({
      success: true,
      message: 'Credential issued successfully',
      data: {
        ...result,
        credential
      }
    });

  } catch (error) {
    console.error('Issue Credential Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to issue credential',
      error: error.message
    });
  }
};

export const getCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Get from blockchain
    const credential = await credentialService.getCredential(tokenId);

    // Get metadata from database
    const metadata = await CredentialModel.findOne({ tokenId });

    return res.status(200).json({
      success: true,
      data: {
        credential: {
          ...credential,
          metadata
        }
      }
    });

  } catch (error) {
    console.error('Get Credential Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get credential',
      error: error.message
    });
  }
};

export const getHolderCredentials = async (req, res) => {
  try {
    const { address } = req.params;

    // Get token IDs from blockchain
    const tokenIds = await credentialService.getHolderCredentials(address);

    // Get details for each
    const credentials = [];
    for (const tokenId of tokenIds) {
      try {
        const onChainData = await credentialService.getCredential(tokenId);
        const metadata = await CredentialModel.findOne({ tokenId });
        
        // Only include credentials that have metadata in our DB
        // This filters out "Unknown Credential" ghosts that exist on-chain but not in DB
        if (metadata) {
          credentials.push({ ...onChainData, metadata });
        }
      } catch (err) {
        console.warn(`Skipping credential ${tokenId} due to error:`, err.message);
        // Optionally, try to fetch just from DB if blockchain fails
        const metadata = await CredentialModel.findOne({ tokenId });
        if (metadata) {
           credentials.push({ 
             tokenId, 
             status: 'SYNC_ERROR', 
             isRevoked: true,
             metadata 
           });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        count: credentials.length,
        credentials
      }
    });

  } catch (error) {
    console.error('Get Holder Credentials Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get credentials',
      error: error.message
    });
  }
};

export const revokeCredential = async (req, res) => {
  try {
    const { tokenId, issuerPrivateKey, reason } = req.body;

    if (!tokenId || !issuerPrivateKey || !reason) {
      return res.status(400).json({
        success: false,
        message: 'tokenId, issuerPrivateKey, and reason are required'
      });
    }

    const result = await credentialService.revokeCredential(
      tokenId,
      issuerPrivateKey,
      reason
    );

    // Update database
    await CredentialModel.findOneAndUpdate(
      { tokenId },
      {
        isRevoked: true,
        revocationReason: reason,
        revokedAt: new Date(),
        revocationTxHash: result.transactionHash
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Credential revoked successfully',
      data: result
    });

  } catch (error) {
    console.error('Revoke Credential Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke credential',
      error: error.message
    });
  }
};

export const getInstituteTemplates = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress.toLowerCase();

    // Find credentials where issuer is the current user AND holder is the current user
    // This convention represents a "Template"
    const templates = await CredentialModel.find({
      issuer: walletAddress,
      holder: walletAddress
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get Templates Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch credential templates',
      error: error.message
    });
  }
};

export const getIssuedCredentials = async (req, res) => {
  try {
    const issuerAddress = req.user.walletAddress.toLowerCase();
    
    const credentials = await CredentialModel.find({
      issuer: issuerAddress,
      holder: { $ne: issuerAddress } 
    }).sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      data: credentials
    });
  } catch (error) {
    console.error('Get Issued Credentials Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get issued credentials',
      error: error.message
    });
  }
};
