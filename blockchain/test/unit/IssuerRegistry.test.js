const IssuerRegistry = artifacts.require("IssuerRegistry");
const { expect } = require('chai');
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

contract("IssuerRegistry", (accounts) => {
    const [admin, issuer1, issuer2, issuer3, unauthorized] = accounts;
    let registry;

    beforeEach(async () => {
        registry = await IssuerRegistry.new({ from: admin });
    });

    describe("Issuer Registration", () => {
        it("should register a new issuer", async () => {
            const tx = await registry.registerIssuer(
                issuer1,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );

            expectEvent(tx, 'IssuerRegistered', {
                issuerAddress: issuer1,
                name: "Test University"
            });

            const isRegistered = await registry.isRegistered(issuer1);
            expect(isRegistered).to.be.true;
        });

        it("should reject registration with zero address", async () => {
            await expectRevert(
                registry.registerIssuer(
                    "0x0000000000000000000000000000000000000000",
                    "Test",
                    "ipfs://test",
                    { from: admin }
                ),
                "IssuerRegistry: Invalid issuer address"
            );
        });

        it("should reject duplicate registration", async () => {
            await registry.registerIssuer(
                issuer1,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );

            await expectRevert(
                registry.registerIssuer(
                    issuer1,
                    "Test University 2",
                    "ipfs://metadata2",
                    { from: admin }
                ),
                "IssuerRegistry: Issuer already registered"
            );
        });

        it("should reject empty name", async () => {
            await expectRevert(
                registry.registerIssuer(
                    issuer1,
                    "",
                    "ipfs://metadata",
                    { from: admin }
                ),
                "IssuerRegistry: Name cannot be empty"
            );
        });
    });

    describe("Issuer Accreditation", () => {
        beforeEach(async () => {
            await registry.registerIssuer(
                issuer1,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
        });

        it("should accredit a registered issuer", async () => {
            const tx = await registry.accreditIssuer(issuer1, { from: admin });

            expectEvent(tx, 'IssuerAccredited', {
                issuerAddress: issuer1
            });

            const isAccredited = await registry.isAccredited(issuer1);
            expect(isAccredited).to.be.true;
        });

        it("should reject accreditation of unregistered issuer", async () => {
            await expectRevert(
                registry.accreditIssuer(issuer2, { from: admin }),
                "IssuerRegistry: Issuer not registered"
            );
        });

        it("should reject duplicate accreditation", async () => {
            await registry.accreditIssuer(issuer1, { from: admin });

            await expectRevert(
                registry.accreditIssuer(issuer1, { from: admin }),
                "IssuerRegistry: Already accredited"
            );
        });

        it("should reject accreditation by unauthorized user", async () => {
            await expectRevert.unspecified(
                registry.accreditIssuer(issuer1, { from: unauthorized })
            );
        });
    });

    describe("Issuer Revocation", () => {
        beforeEach(async () => {
            await registry.registerIssuer(
                issuer1,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
            await registry.accreditIssuer(issuer1, { from: admin });
        });

        it("should revoke an accredited issuer", async () => {
            const tx = await registry.revokeIssuer(
                issuer1,
                "Violation of policies",
                { from: admin }
            );

            expectEvent(tx, 'IssuerRevoked', {
                issuerAddress: issuer1,
                reason: "Violation of policies"
            });

            const isAccredited = await registry.isAccredited(issuer1);
            expect(isAccredited).to.be.false;
        });

        it("should reject revocation of non-accredited issuer", async () => {
            await registry.registerIssuer(
                issuer2,
                "Test University 2",
                "ipfs://metadata2",
                { from: admin }
            );

            await expectRevert(
                registry.revokeIssuer(issuer2, "Test", { from: admin }),
                "IssuerRegistry: Not accredited"
            );
        });
    });

    describe("Issuer Suspension", () => {
        beforeEach(async () => {
            await registry.registerIssuer(
                issuer1,
                "Test University",
                "ipfs://metadata",
                { from: admin }
            );
            await registry.accreditIssuer(issuer1, { from: admin });
        });

        it("should suspend an issuer", async () => {
            const tx = await registry.suspendIssuer(
                issuer1,
                "Under investigation",
                { from: admin }
            );

            expectEvent(tx, 'IssuerSuspended', {
                issuerAddress: issuer1
            });

            const isSuspended = await registry.isSuspended(issuer1);
            expect(isSuspended).to.be.true;
        });

        it("should reactivate a suspended issuer", async () => {
            await registry.suspendIssuer(
                issuer1,
                "Under investigation",
                { from: admin }
            );

            const tx = await registry.reactivateIssuer(issuer1, { from: admin });

            expectEvent(tx, 'IssuerReactivated', {
                issuerAddress: issuer1
            });

            const isSuspended = await registry.isSuspended(issuer1);
            expect(isSuspended).to.be.false;
        });
    });

    describe("Query Functions", () => {
        beforeEach(async () => {
            await registry.registerIssuer(
                issuer1,
                "University 1",
                "ipfs://metadata1",
                { from: admin }
            );
            await registry.registerIssuer(
                issuer2,
                "University 2",
                "ipfs://metadata2",
                { from: admin }
            );
            await registry.accreditIssuer(issuer1, { from: admin });
        });

        it("should get issuer details", async () => {
            const issuer = await registry.getIssuer(issuer1);
            expect(issuer.issuerAddress).to.equal(issuer1);
            expect(issuer.name).to.equal("University 1");
            expect(issuer.isAccredited).to.be.true;
        });

        it("should get all accredited issuers", async () => {
            const accreditedIssuers = await registry.getAllAccreditedIssuers();
            expect(accreditedIssuers.length).to.equal(1);
            expect(accreditedIssuers[0]).to.equal(issuer1);
        });

        it("should get accredited issuer count", async () => {
            const count = await registry.getAccreditedIssuerCount();
            expect(count.toNumber()).to.equal(1);
        });
    });
});
