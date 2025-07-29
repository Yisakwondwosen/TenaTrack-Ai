/**
 * Firebase Cloud Functions for authentication triggers
 * - Token exchange endpoint for OIDC flow
 * - Auth session monitoring and logging
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {validateJwt, mintFirebaseToken, logAuthEvent} = require("../../src/config/firebase");

admin.initializeApp();

exports.tokenExchange = functions.https.onRequest(async (req, res) => {
  try {
    const {idToken} = req.body;
    if (!idToken) {
      return res.status(400).json({error: "Missing idToken"});
    }

    // Validate the JWT token from VeriFayda
    const payload = await validateJwt(idToken);

    // Mint Firebase custom token
    const uid = payload.sub;
    const customToken = await mintFirebaseToken(uid, {verifaydaClaims: payload});

    // Log auth event
    await logAuthEvent("token_exchange", {uid, payload});

    return res.json({firebase_token: customToken});
  } catch (error) {
    console.error("Token exchange error:", error);
    return res.status(500).json({error: error.message});
  }
});

// Auth session monitoring - example trigger on user creation
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    await logAuthEvent("user_create", {uid: user.uid, email: user.email});
  } catch (error) {
    console.error("Auth event logging error:", error);
  }
});
