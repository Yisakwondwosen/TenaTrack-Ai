/* eslint-env mocha */
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();
const functions = require("firebase-functions-test")();

// Mock dependencies to isolate tests
const oidcModule = proxyquire("../tenatrack-functions/oidcFlow", {
  "firebase-admin": {},
  "../../src/config/firebase": {},
});

describe("OIDC Flow", () => {
  after(() => {
    functions.cleanup();
  });

  describe("tokenExchangeEndpoint", () => {
    it("should return 400 if authorization code is missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await oidcModule.tokenExchangeEndpoint(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Missing authorization code" })).to.be.true;
    });

    it("should mint custom token on valid code", async () => {
      const req = { body: { code: "valid_code" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mintTokenStub = sinon.stub(oidcModule, "mintCustomToken").resolves("custom_token");
      await oidcModule.tokenExchangeEndpoint(req, res);
      expect(mintTokenStub.calledWith("valid_code")).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ token: "custom_token" })).to.be.true;
      mintTokenStub.restore();
    });
  });

  describe("validateJwt", () => {
    it("should throw error on invalid JWT", async () => {
      try {
        await oidcModule.validateJwt("invalid_jwt");
        throw new Error("Expected error not thrown");
      } catch (err) {
        expect(err.message).to.include("Invalid JWT");
      }
    });

    it("should return payload on valid JWT", async () => {
      const validJwt = "valid_jwt_token";
      const payload = { sub: "user123" };
      const verifyStub = sinon.stub(oidcModule, "verifyJwt").resolves(payload);
      const result = await oidcModule.validateJwt(validJwt);
      expect(result).to.deep.equal(payload);
      verifyStub.restore();
    });
  });

  describe("mintCustomToken", () => {
    it("should mint a Firebase custom token", async () => {
      const userId = "user123";
      const customToken = "custom_firebase_token";
      const adminStub = sinon.stub(oidcModule, "adminAuth").value({
        createCustomToken: sinon.stub().resolves(customToken),
      });
      const token = await oidcModule.mintCustomToken(userId);
      expect(token).to.equal(customToken);
      adminStub.restore();
    });
  });
});
