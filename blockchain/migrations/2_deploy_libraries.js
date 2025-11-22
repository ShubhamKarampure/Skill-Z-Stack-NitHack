const CredentialTypes = artifacts.require("CredentialTypes");
const DateUtils = artifacts.require("DateUtils");

module.exports = async function (deployer) {
    console.log("\n=== Deploying Libraries ===\n");

    // Deploy CredentialTypes library
    console.log("Deploying CredentialTypes library...");
    await deployer.deploy(CredentialTypes);
    console.log("✓ CredentialTypes deployed at:", CredentialTypes.address);

    // Deploy DateUtils library
    console.log("Deploying DateUtils library...");
    await deployer.deploy(DateUtils);
    console.log("✓ DateUtils deployed at:", DateUtils.address);

    console.log("\n=== Libraries Deployed Successfully ===\n");
};
