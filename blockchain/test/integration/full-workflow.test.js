const IssuerRegistry = artifacts.require("IssuerRegistry");
const CredentialNFT = artifacts.require("CredentialNFT");
const CredentialVerifier = artifacts.require("CredentialVerifier");
const RevocationRegistry = artifacts.require("RevocationRegistry");
const { expect } = require('chai');
const { expectEvent, time } = require('@openzeppelin/test-helpers');

contract("Full Workflow Integration", (accounts) => {
    const [admin, university, student, employer] = accounts;
    let registry, nft, verifier, revocationRegistry;

    describe("Complete Credential Lifecycle", () => {
        it("should complete full workflow from registration to verification", async () => {
            // Step 1: Deploy contracts
            console.log("  → Deploying contracts...");
            registry = await IssuerRegistry.new({ from: admin });
            nft = await CredentialNFT.new(registry.address, { from: admin });
            verifier = await CredentialVerifier.new(
                nft.address,
                registry.address,
                { from: admin }
            );
            revocationRegistry = await RevocationRegistry.new({ from: admin });

            // Step 2: Register university as issuer
            console.log("  → Registering university...");
            const registerTx = await registry.registerIssuer(
                university,
                "Stanford University",
                "ipfs://stanford-metadata",
                { from: admin }
            );
            expectEvent(registerTx, 'IssuerRegistered');

            // Step 3: Accredit the university
            console.log("  → Accrediting university...");
            const accreditTx = await registry.accreditIssuer(university, { from: admin });
            expectEvent(accreditTx, 'IssuerAccredited');

            const isAccredited = await registry.isAccredited(university);
            expect(isAccredited).to.be.true;

            // Step 4: Issue credential to student
            console.log("  → Issuing degree credential...");
            const credentialHash = web3.utils.keccak256(
                JSON.stringify({
                    student: student,
                    degree: "Computer Science",
                    gpa: "3.9"
                })
            );

            const issueTx = await nft.issueCredential(
                student,
                0, // DEGREE
                "ipfs://degree-credential",
                0, // Never expires
                true,
                credentialHash,
                { from: university }
            );

            expectEvent(issueTx, 'CredentialIssued');
            const tokenId = issueTx.logs[0].args.tokenId;

            // Step 5: Student owns the credential
            console.log("  → Verifying ownership...");
            const owner = await nft.ownerOf(tokenId);
            expect(owner).to.equal(student);

            // Step 6: Employer verifies the credential
            console.log("  → Employer verifying credential...");
            const verificationResult = await verifier.verifyCredential(tokenId, {
                from: employer
            });

            expect(verificationResult.isValid).to.be.true;
            expect(verificationResult.exists).to.be.true;
            expect(verificationResult.issuerAccredited).to.be.true;
            expect(verificationResult.isExpired).to.be.false;
            expect(verificationResult.isRevoked).to.be.false;

            // Step 7: Get credential details
            console.log("  → Retrieving credential details...");
            const credential = await nft.getCredential(tokenId);
            expect(credential.holderAddress).to.equal(student);
            expect(credential.issuerAddress).to.equal(university);
            expect(parseInt(credential.credentialType)).to.equal(0);

            console.log("  ✓ Full workflow completed successfully!");
        });
    });

    describe("Revocation Workflow", () => {
        let tokenId;

        beforeEach(async () => {
            registry = await IssuerRegistry.new({ from: admin });
            nft = await CredentialNFT.new(registry.address, { from: admin });
            verifier = await CredentialVerifier.new(
                nft.address,
                registry.address,
                { from: admin }
            );

            await registry.registerIssuer(
                university,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
            await registry.accreditIssuer(university, { from: admin });

            const tx = await nft.issueCredential(
                student,
                0,
                "ipfs://credential",
                0,
                true,
                web3.utils.keccak256("data"),
                { from: university }
            );
            tokenId = tx.logs[0].args.tokenId;
        });

        it("should handle credential revocation workflow", async () => {
            console.log("  → Issuing credential...");
            let result = await verifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.true;

            console.log("  → Revoking credential...");
            await nft.revokeCredential(tokenId, "Academic misconduct", {
                from: university
            });

            console.log("  → Verifying revoked credential...");
            result = await verifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.false;
            expect(result.isRevoked).to.be.true;

            console.log("  ✓ Revocation workflow completed!");
        });
    });

    describe("Expiration Workflow", () => {
        it("should handle expiring credentials", async () => {
            registry = await IssuerRegistry.new({ from: admin });
            nft = await CredentialNFT.new(registry.address, { from: admin });
            verifier = await CredentialVerifier.new(
                nft.address,
                registry.address,
                { from: admin }
            );

            await registry.registerIssuer(
                university,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
            await registry.accreditIssuer(university, { from: admin });

            console.log("  → Issuing expirable credential...");
            const expiration = (await time.latest()).toNumber() + 365 * 24 * 60 * 60;
            const tx = await nft.issueCredential(
                student,
                1, // CERTIFICATE
                "ipfs://cert",
                expiration,
                true,
                web3.utils.keccak256("data"),
                { from: university }
            );
            const tokenId = tx.logs[0].args.tokenId;

            console.log("  → Verifying before expiration...");
            let result = await verifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.true;
            expect(result.isExpired).to.be.false;

            console.log("  → Fast forwarding time past expiration...");
            await time.increase(366 * 24 * 60 * 60);

            console.log("  → Verifying after expiration...");
            result = await verifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.false;
            expect(result.isExpired).to.be.true;

            console.log("  → Renewing credential...");
            const newExpiration = (await time.latest()).toNumber() + 365 * 24 * 60 * 60;
            await nft.renewCredential(tokenId, newExpiration, { from: university });

            console.log("  → Verifying after renewal...");
            result = await verifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.true;
            expect(result.isExpired).to.be.false;

            console.log("  ✓ Expiration workflow completed!");
        });
    });

    describe("Multiple Credentials Workflow", () => {
        it("should handle student with multiple credentials", async () => {
            registry = await IssuerRegistry.new({ from: admin });
            nft = await CredentialNFT.new(registry.address, { from: admin });
            verifier = await CredentialVerifier.new(
                nft.address,
                registry.address,
                { from: admin }
            );

            await registry.registerIssuer(
                university,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
            await registry.accreditIssuer(university, { from: admin });

            console.log("  → Issuing multiple credentials...");
            await nft.issueCredential(
                student,
                0, // DEGREE
                "ipfs://degree",
                0,
                true,
                web3.utils.keccak256("degree"),
                { from: university }
            );

            await nft.issueCredential(
                student,
                1, // CERTIFICATE
                "ipfs://cert1",
                0,
                true,
                web3.utils.keccak256("cert1"),
                { from: university }
            );

            await nft.issueCredential(
                student,
                2, // BADGE
                "ipfs://badge",
                0,
                true,
                web3.utils.keccak256("badge"),
                { from: university }
            );

            console.log("  → Querying student credentials...");
            const studentCredentials = await nft.getHolderCredentials(student);
            expect(studentCredentials.length).to.equal(3);

            console.log("  → Batch verifying all credentials...");
            const results = await verifier.verifyCredentialBatch(studentCredentials);
            expect(results.length).to.equal(3);
            expect(results.every(r => r.isValid)).to.be.true;

            console.log("  ✓ Multiple credentials workflow completed!");
        });
    });
});
