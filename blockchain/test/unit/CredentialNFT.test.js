const CredentialNFT = artifacts.require("CredentialNFT");
const IssuerRegistry = artifacts.require("IssuerRegistry");
const { expect } = require('chai');
const { expectRevert, expectEvent, time } = require('@openzeppelin/test-helpers');

contract("CredentialNFT", (accounts) => {
    const [admin, issuer, student1, student2, unauthorized] = accounts;
    let nft, registry;

    const CREDENTIAL_TYPES = {
        DEGREE: 0,
        CERTIFICATE: 1,
        BADGE: 2
    };

    beforeEach(async () => {
        registry = await IssuerRegistry.new({ from: admin });
        nft = await CredentialNFT.new(registry.address, { from: admin });

        // Register and accredit issuer
        await registry.registerIssuer(
            issuer,
            "Test University",
            "ipfs://metadata",
            { from: admin }
        );
        await registry.accreditIssuer(issuer, { from: admin });
    });

    describe("Credential Issuance", () => {
        it("should issue a credential to a student", async () => {
            const expirationDate = (await time.latest()).toNumber() + (365 * 24 * 60 * 60);
            const credentialHash = web3.utils.keccak256("credential_data");

            const tx = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.DEGREE,
                "ipfs://degree-metadata",
                expirationDate,
                true,
                credentialHash,
                { from: issuer }
            );

            expectEvent(tx, 'CredentialIssued', {
                issuer: issuer,
                holder: student1
            });

            const tokenId = tx.logs[0].args.tokenId;
            const owner = await nft.ownerOf(tokenId);
            expect(owner).to.equal(student1);
        });

        it("should reject issuance by non-accredited issuer", async () => {
            await expectRevert(
                nft.issueCredential(
                    student1,
                    CREDENTIAL_TYPES.DEGREE,
                    "ipfs://metadata",
                    0,
                    true,
                    web3.utils.keccak256("data"),
                    { from: unauthorized }
                ),
                "CredentialNFT: Issuer not accredited"
            );
        });

        it("should reject issuance to zero address", async () => {
            await expectRevert(
                nft.issueCredential(
                    "0x0000000000000000000000000000000000000000",
                    CREDENTIAL_TYPES.DEGREE,
                    "ipfs://metadata",
                    0,
                    true,
                    web3.utils.keccak256("data"),
                    { from: issuer }
                ),
                "CredentialNFT: Invalid holder address"
            );
        });

        it("should reject issuance with empty metadata URI", async () => {
            await expectRevert(
                nft.issueCredential(
                    student1,
                    CREDENTIAL_TYPES.DEGREE,
                    "",
                    0,
                    true,
                    web3.utils.keccak256("data"),
                    { from: issuer }
                ),
                "CredentialNFT: Empty metadata URI"
            );
        });

        it("should reject issuance with past expiration date", async () => {
            const pastDate = (await time.latest()).toNumber() - 1000;

            await expectRevert(
                nft.issueCredential(
                    student1,
                    CREDENTIAL_TYPES.DEGREE,
                    "ipfs://metadata",
                    pastDate,
                    true,
                    web3.utils.keccak256("data"),
                    { from: issuer }
                ),
                "CredentialNFT: Invalid expiration date"
            );
        });
    });

    describe("Credential Revocation", () => {
        let tokenId;

        beforeEach(async () => {
            const tx = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.DEGREE,
                "ipfs://metadata",
                0,
                true,
                web3.utils.keccak256("data"),
                { from: issuer }
            );
            tokenId = tx.logs[0].args.tokenId;
        });

        it("should revoke a credential by issuer", async () => {
            const tx = await nft.revokeCredential(
                tokenId,
                "Academic misconduct",
                { from: issuer }
            );

            expectEvent(tx, 'CredentialRevoked', {
                tokenId: tokenId,
                reason: "Academic misconduct"
            });

            // Changed: Check if token still exists using try-catch on ownerOf
            try {
                await nft.ownerOf(tokenId);
                expect.fail("Token should have been burned");
            } catch (error) {
                expect(error.message).to.include("ERC721: invalid token ID");
            }
        });

        it("should reject revocation by non-issuer", async () => {
            await expectRevert(
                nft.revokeCredential(tokenId, "Test", { from: unauthorized }),
                "CredentialNFT: Not the issuer"
            );
        });

        it("should reject revocation of non-revocable credential", async () => {
            const tx = await nft.issueCredential(
                student2,
                CREDENTIAL_TYPES.DEGREE,
                "ipfs://metadata2",
                0,
                false, // Not revocable
                web3.utils.keccak256("data2"),
                { from: issuer }
            );
            const nonRevocableTokenId = tx.logs[0].args.tokenId;

            await expectRevert(
                nft.revokeCredential(nonRevocableTokenId, "Test", { from: issuer }),
                "CredentialNFT: Credential not revocable"
            );
        });
    });

    describe("Credential Renewal", () => {
        let tokenId;

        beforeEach(async () => {
            const currentTime = (await time.latest()).toNumber();
            const initialExpiration = currentTime + 1000;

            const tx = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.CERTIFICATE,
                "ipfs://metadata",
                initialExpiration,
                true,
                web3.utils.keccak256("data"),
                { from: issuer }
            );
            tokenId = tx.logs[0].args.tokenId;
        });

        it("should renew a credential", async () => {
            const newExpiration = (await time.latest()).toNumber() + (730 * 24 * 60 * 60);

            const tx = await nft.renewCredential(tokenId, newExpiration, { from: issuer });

            expectEvent(tx, 'CredentialRenewed', {
                tokenId: tokenId,
                newExpirationDate: newExpiration.toString()
            });
        });

        it("should reject renewal with past date", async () => {
            const pastDate = (await time.latest()).toNumber() - 1000;

            await expectRevert(
                nft.renewCredential(tokenId, pastDate, { from: issuer }),
                "CredentialNFT: New expiration must be in future"
            );
        });
    });

    describe("Query Functions", () => {
        let tokenId1, tokenId2;

        beforeEach(async () => {
            const tx1 = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.DEGREE,
                "ipfs://degree",
                0,
                true,
                web3.utils.keccak256("data1"),
                { from: issuer }
            );
            tokenId1 = tx1.logs[0].args.tokenId;

            const tx2 = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.CERTIFICATE,
                "ipfs://cert",
                0,
                true,
                web3.utils.keccak256("data2"),
                { from: issuer }
            );
            tokenId2 = tx2.logs[0].args.tokenId;
        });

        it("should get credential details", async () => {
            const credential = await nft.getCredential(tokenId1);
            expect(credential.holderAddress).to.equal(student1);
            expect(credential.issuerAddress).to.equal(issuer);
            // Convert both to strings for comparison
            expect(credential.credentialType.toString()).to.equal(CREDENTIAL_TYPES.DEGREE.toString());
        });


        it("should get holder credentials", async () => {
            const credentials = await nft.getHolderCredentials(student1);
            expect(credentials.length).to.equal(2);
        });

        it("should get issuer credentials", async () => {
            const credentials = await nft.getIssuerCredentials(issuer);
            expect(credentials.length).to.equal(2);
        });

        it("should get total credentials", async () => {
            const total = await nft.getTotalCredentials();
            expect(total.toNumber()).to.equal(2);
        });
    });

    describe("Expiration Checks", () => {
        it("should detect expired credentials", async () => {
            const shortExpiration = (await time.latest()).toNumber() + 100;

            const tx = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.CERTIFICATE,
                "ipfs://metadata",
                shortExpiration,
                true,
                web3.utils.keccak256("data"),
                { from: issuer }
            );
            const tokenId = tx.logs[0].args.tokenId;

            // Fast forward time
            await time.increase(200);

            const isExpired = await nft.isExpired(tokenId);
            expect(isExpired).to.be.true;
        });

        it("should handle non-expiring credentials", async () => {
            const tx = await nft.issueCredential(
                student1,
                CREDENTIAL_TYPES.DEGREE,
                "ipfs://metadata",
                0, // Never expires
                true,
                web3.utils.keccak256("data"),
                { from: issuer }
            );
            const tokenId = tx.logs[0].args.tokenId;

            const isExpired = await nft.isExpired(tokenId);
            expect(isExpired).to.be.false;
        });
    });
});
