const IssuerRegistry = artifacts.require("IssuerRegistry");
const CredentialNFT = artifacts.require("CredentialNFT");

module.exports = async function (callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const [admin, university, student] = accounts;

        console.log("\n🔧 Setting up demo data...\n");

        const registry = await IssuerRegistry.deployed();
        const nft = await CredentialNFT.deployed();

        // Register and accredit university
        console.log("1. Registering Stanford University...");
        await registry.registerIssuer(
            university,
            "Stanford University",
            "ipfs://QmStanfordMetadata",
            { from: admin }
        );

        console.log("2. Accrediting Stanford University...");
        await registry.accreditIssuer(university, { from: admin });

        // Issue sample credential
        console.log("3. Issuing sample credential...");
        const tx = await nft.issueCredential(
            student,
            0, // DEGREE
            "ipfs://QmSampleDegree",
            0, // Never expires
            true,
            web3.utils.keccak256("Sample Degree Data"),
            { from: university }
        );

        const tokenId = tx.logs[0].args.tokenId;

        console.log("\n✅ Demo setup complete!");
        console.log("\nDemo Accounts:");
        console.log("   Admin:", admin);
        console.log("   University:", university);
        console.log("   Student:", student);
        console.log("\nSample Credential:");
        console.log("   Token ID:", tokenId.toString());

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
