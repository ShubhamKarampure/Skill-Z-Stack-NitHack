const ZKPVerifier = artifacts.require("ZKPVerifier");
const SelectiveDisclosure = artifacts.require("SelectiveDisclosure");
const fs = require('fs-extra');

module.exports = async function (callback) {
    try {
        console.log("\n🔍 Verifying ZKP Deployment...\n");

        // Get deployed contracts
        const zkpVerifier = await ZKPVerifier.deployed();
        const selectiveDisclosure = await SelectiveDisclosure.deployed();

        // Check verifier addresses
        const [ageAddr, credAddr, rankAddr] = await zkpVerifier.getVerifiers();

        console.log("✅ ZKP Contracts:");
        console.log("   ZKPVerifier:", zkpVerifier.address);
        console.log("   - Age Verifier:", ageAddr);
        console.log("   - Credential Verifier:", credAddr);
        console.log("   - Rank Verifier:", rankAddr);
        console.log("\n   SelectiveDisclosure:", selectiveDisclosure.address);

        // Verify SelectiveDisclosure links
        const sdZkpVerifier = await selectiveDisclosure.zkpVerifier();
        const sdCredentialNFT = await selectiveDisclosure.credentialNFT();

        console.log("\n✅ SelectiveDisclosure Configuration:");
        console.log("   Linked to ZKPVerifier:", sdZkpVerifier === zkpVerifier.address);
        console.log("   Linked to CredentialNFT:", sdCredentialNFT);

        // Read and display all addresses
        const addresses = await fs.readJson('deployed/development_addresses.json');

        console.log("\n📋 Complete Deployment Addresses:");
        console.log(JSON.stringify(addresses.zkp, null, 2));

        console.log("\n✨ ZKP verification complete!\n");

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
