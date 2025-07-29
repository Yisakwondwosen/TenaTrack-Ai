/* eslint-env mocha */
const {initializeTestEnvironment, assertFails, assertSucceeds} = require("@firebase/rules-unit-testing");
const fs = require("fs");
const path = require("path");

describe("Firestore Security Rules", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "tenatrack-test",
      firestore: {
        rules: fs.readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8"),
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  describe("users collection", () => {
    it("should allow owner to write their own document", async () => {
      const ownerId = "user_abc";
      const ownerAuth = {uid: ownerId};
      const db = testEnv.authenticatedContext(ownerId, ownerAuth).firestore();

      const userDoc = db.collection("users").doc(ownerId);
      await assertSucceeds(userDoc.set({faydaId:"hashed_id", preferredLanguage:"en"}));
    });

    it("should deny other users from writing to someone else's document", async () => {
      const ownerId = "user_abc";
      const otherId = "user_xyz";
      const otherAuth = {uid: otherId};
      const db = testEnv.authenticatedContext(otherId, otherAuth).firestore();

      const userDoc = db.collection("users").doc(ownerId);
      await assertFails(userDoc.set({faydaId:"hashed_id", preferredLanguage:"en"}));
    });
  });

  describe("triageSessions collection", () => {
    it("should allow patient to read their own triage session", async () => {
      const patientId = "patient_123";
      const patientAuth = {uid: patientId};
      const db = testEnv.authenticatedContext(patientId, patientAuth).firestore();

      const triageDoc = db.collection("triageSessions").doc(patientId);
      await assertSucceeds(triageDoc.get());
    });

    it("should deny other patients from reading someone else's triage session", async () => {
      const patientId = "patient_123";
      const otherId = "patient_456";
      const otherAuth = {uid: otherId};
      const db = testEnv.authenticatedContext(otherId, otherAuth).firestore();

      const triageDoc = db.collection("triageSessions").doc(patientId);
      await assertFails(triageDoc.get());
    });

    it("should deny write access to triageSessions", async () => {
      const patientId = "patient_123";
      const patientAuth = {uid: patientId};
      const db = testEnv.authenticatedContext(patientId, patientAuth).firestore();

      const triageDoc = db.collection("triageSessions").doc(patientId);
      await assertFails(triageDoc.set({symptoms:{}, diagnosis:"flu", urgency:"low"}));
    });
  });
});
