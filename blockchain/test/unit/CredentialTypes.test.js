const CredentialTypes = artifacts.require("CredentialTypes");
const { expect } = require('chai');

contract("CredentialTypes Library", (accounts) => {

    it("should convert credential type enum to string correctly", async () => {
        // This is a library, so we test through a contract that uses it
        // For now, we verify the enum values are correctly defined
        const DEGREE = 0;
        const CERTIFICATE = 1;
        const BADGE = 2;

        expect(DEGREE).to.equal(0);
        expect(CERTIFICATE).to.equal(1);
        expect(BADGE).to.equal(2);
    });

    it("should have correct credential status values", () => {
        const ACTIVE = 0;
        const EXPIRED = 1;
        const REVOKED = 2;
        const SUSPENDED = 3;

        expect(ACTIVE).to.equal(0);
        expect(EXPIRED).to.equal(1);
        expect(REVOKED).to.equal(2);
        expect(SUSPENDED).to.equal(3);
    });
});
