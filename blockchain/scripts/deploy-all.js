const IssuerRegistry = artifacts.require("IssuerRegistry");
const CredentialNFT = artifacts.require("CredentialNFT");
const CredentialVerifier = artifacts.require("CredentialVerifier");
const fs = require('fs-extra');

module.exports = async function (callback) {
    try {
        console.log("\n📋 Deployment Summary\n");
        console.log("=".repeat(50));

        const issuerRegistry = await IssuerRegistry.deployed();
        const credentialNFT = await CredentialNFT.deployed();
        const credentialVerifier = await CredentialVerifier.deployed();

        console.log("\n✅ Core Contracts:");
        console.log("   IssuerRegistry:", issuerRegistry.address);
        console.log("   CredentialNFT:", credentialNFT.address);
        console.log("   CredentialVerifier:", credentialVerifier.address);

        // Check if governance is deployed
        try {
            const IssuerDAO = artifacts.require("IssuerDAO");
            const dao = await IssuerDAO.deployed();
            console.log("\n✅ Governance:");
            console.log("   IssuerDAO:", dao.address);
        } catch (e) {
            console.log("\n⚠️  Governance: Not deployed");
        }

        console.log("\n" + "=".repeat(50));
        console.log("\n✨ All contracts deployed successfully!\n");

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
