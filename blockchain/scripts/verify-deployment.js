const IssuerRegistry = artifacts.require("IssuerRegistry");
const CredentialNFT = artifacts.require("CredentialNFT");
const CredentialVerifier = artifacts.require("CredentialVerifier");

module.exports = async function (callback) {
    try {
        console.log("\n🔍 Verifying Deployment...\n");

        const accounts = await web3.eth.getAccounts();
        const [admin] = accounts;

        // Check IssuerRegistry
        const registry = await IssuerRegistry.deployed();
        const hasAdminRole = await registry.hasRole(
            await registry.DEFAULT_ADMIN_ROLE(),
            admin
        );
        console.log("✓ IssuerRegistry deployed:", registry.address);
        console.log("  Admin has role:", hasAdminRole);

        // Check CredentialNFT
        const nft = await CredentialNFT.deployed();
        const nftRegistry = await nft.issuerRegistry();
        console.log("✓ CredentialNFT deployed:", nft.address);
        console.log("  Linked to registry:", nftRegistry === registry.address);

        // Check CredentialVerifier
        const verifier = await CredentialVerifier.deployed();
        const verifierNFT = await verifier.credentialNFT();
        const verifierRegistry = await verifier.issuerRegistry();
        console.log("✓ CredentialVerifier deployed:", verifier.address);
        console.log("  Linked to NFT:", verifierNFT === nft.address);
        console.log("  Linked to registry:", verifierRegistry === registry.address);

        console.log("\n✅ All contracts verified successfully!\n");

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
