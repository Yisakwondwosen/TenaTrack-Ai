/* eslint-env mocha */
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();
const functions = require("firebase-functions-test")();

const logAuthEventStub = sinon.stub();
const mintFirebaseTokenStub = sinon.stub();
const validateJwtStub = sinon.stub();

const authTriggers = proxyquire("../tenatrack-functions/authTriggers", {
  "../../src/config/firebase": {
    validateJwt: validateJwtStub,
    mintFirebaseToken: mintFirebaseTokenStub,
    logAuthEvent: logAuthEventStub,
  },
  "firebase-admin": {
    initializeApp: sinon.stub(),
  },
});

describe("authTriggers functions", () => {
  after(() => {
    functions.cleanup();
  });

  describe("tokenExchange", () => {
    it("should return 400 if idToken is missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await authTriggers.tokenExchange(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Missing idToken" })).to.be.true;
    });

    it("should return firebase_token on valid idToken", async () => {
      const req = { body: { idToken: "valid_token" } };
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      const payload = { sub: "user123" };
      validateJwtStub.resolves(payload);
      mintFirebaseTokenStub.resolves("custom_token");
      logAuthEventStub.resolves();

      await authTriggers.tokenExchange(req, res);

      expect(validateJwtStub.calledWith("valid_token")).to.be.true;
      expect(mintFirebaseTokenStub.calledWith("user123", { verifaydaClaims: payload })).to.be.true;
      expect(logAuthEventStub.calledWith("token_exchange", { uid: "user123", payload })).to.be.true;
      expect(res.json.calledWith({ firebase_token: "custom_token" })).to.be.true;
    });

    it("should return 500 on error", async () => {
      const req = { body: { idToken: "bad_token" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      validateJwtStub.rejects(new Error("Invalid token"));

      await authTriggers.tokenExchange(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Invalid token" })).to.be.true;
    });
  });

  describe("onUserCreate", () => {
    it("should log auth event on user creation", async () => {
      const user = { uid: "user123", email: "user@example.com" };
      logAuthEventStub.resolves();

      await authTriggers.onUserCreate(user);

      expect(logAuthEventStub.calledWith("user_create", { uid: "user123", email: "user@example.com" })).to.be.true;
    });

    it("should handle errors in logging", async () => {
      const user = { uid: "user123", email: "user@example.com" };
      logAuthEventStub.rejects(new Error("Logging failed"));

      try {
        await authTriggers.onUserCreate(user);
      } catch (err) {
        // Should not throw
        expect.fail("onUserCreate threw an error");
      }
    });
  });
});
