const CredentialVerifier = artifacts.require("CredentialVerifier");
const CredentialNFT = artifacts.require("CredentialNFT");
const IssuerRegistry = artifacts.require("IssuerRegistry");
const { expect } = require('chai');
const { time } = require('@openzeppelin/test-helpers');

contract("CredentialVerifier", (accounts) => {
    const [admin, issuer, student, verifier] = accounts;
    let nft, registry, credentialVerifier;
    let tokenId;

    beforeEach(async () => {
        registry = await IssuerRegistry.new({ from: admin });
        nft = await CredentialNFT.new(registry.address, { from: admin });
        credentialVerifier = await CredentialVerifier.new(
            nft.address,
            registry.address,
            { from: admin }
        );

        // Setup issuer
        await registry.registerIssuer(
            issuer,
            "Test University",
            "ipfs://metadata",
            { from: admin }
        );
        await registry.accreditIssuer(issuer, { from: admin });

        // Issue a credential
        const tx = await nft.issueCredential(
            student,
            0, // DEGREE
            "ipfs://credential",
            0,
            true,
            web3.utils.keccak256("data"),
            { from: issuer }
        );
        tokenId = tx.logs[0].args.tokenId;
    });

    describe("Credential Verification", () => {
        it("should verify a valid credential", async () => {
            const result = await credentialVerifier.verifyCredential(tokenId);

            expect(result.isValid).to.be.true;
            expect(result.exists).to.be.true;
            expect(result.isActive).to.be.true;
            expect(result.isExpired).to.be.false;
            expect(result.isRevoked).to.be.false;
            expect(result.issuerAccredited).to.be.true;
        });

        it("should return false for non-existent credential", async () => {
            const result = await credentialVerifier.verifyCredential(999);
            expect(result.isValid).to.be.false;
            expect(result.exists).to.be.false;
        });

        it("should detect revoked credentials", async () => {
            await nft.revokeCredential(tokenId, "Test", { from: issuer });

            const result = await credentialVerifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.false;
            expect(result.isRevoked).to.be.true;
        });

        it("should detect expired credentials", async () => {
            const expiration = (await time.latest()).toNumber() + 100;
            const tx = await nft.issueCredential(
                student,
                1, // CERTIFICATE
                "ipfs://cert",
                expiration,
                true,
                web3.utils.keccak256("data2"),
                { from: issuer }
            );
            const expirableTokenId = tx.logs[0].args.tokenId;

            await time.increase(200);

            const result = await credentialVerifier.verifyCredential(expirableTokenId);
            expect(result.isValid).to.be.false;
            expect(result.isExpired).to.be.true;
        });

        it("should detect non-accredited issuer", async () => {
            await registry.revokeIssuer(issuer, "Test", { from: admin });

            const result = await credentialVerifier.verifyCredential(tokenId);
            expect(result.isValid).to.be.false;
            expect(result.issuerAccredited).to.be.false;
        });
    });

    describe("Quick Validation", () => {
        it("should quickly validate a valid credential", async () => {
            const isValid = await credentialVerifier.isCredentialValid(tokenId);
            expect(isValid).to.be.true;
        });

        it("should quickly invalidate a revoked credential", async () => {
            await nft.revokeCredential(tokenId, "Test", { from: issuer });

            const isValid = await credentialVerifier.isCredentialValid(tokenId);
            expect(isValid).to.be.false;
        });
    });

    describe("Ownership Verification", () => {
        it("should verify correct ownership", async () => {
            const isOwner = await credentialVerifier.verifyOwnership(tokenId, student);
            expect(isOwner).to.be.true;
        });

        it("should reject incorrect ownership claim", async () => {
            const isOwner = await credentialVerifier.verifyOwnership(tokenId, verifier);
            expect(isOwner).to.be.false;
        });
    });

    describe("Batch Verification", () => {
        let tokenId2, tokenId3;

        beforeEach(async () => {
            const tx2 = await nft.issueCredential(
                student,
                1,
                "ipfs://cert",
                0,
                true,
                web3.utils.keccak256("data2"),
                { from: issuer }
            );
            tokenId2 = tx2.logs[0].args.tokenId;

            const tx3 = await nft.issueCredential(
                student,
                2,
                "ipfs://badge",
                0,
                true,
                web3.utils.keccak256("data3"),
                { from: issuer }
            );
            tokenId3 = tx3.logs[0].args.tokenId;
        });

        it("should verify multiple credentials", async () => {
            const results = await credentialVerifier.verifyCredentialBatch(
                [tokenId, tokenId2, tokenId3]
            );

            expect(results.length).to.equal(3);
            expect(results[0].isValid).to.be.true;
            expect(results[1].isValid).to.be.true;
            expect(results[2].isValid).to.be.true;
        });
    });
});
