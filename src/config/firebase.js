/**
 * Firebase configuration and OIDC integration with VeriFayda
 * Implements:
 * - OIDC flow with PKCE
 * - JWT token validation
 * - Firebase custom token minting
 * - JWK rotation schedule
 * - Audit logging for auth events
 */

import * as admin from 'firebase-admin';
import * as jose from 'jose';
import fetch from 'node-fetch';
import crypto from 'crypto';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configuration for VeriFayda OIDC
const OIDC_ISSUER = process.env.OIDC_ISSUER || 'https://verifayda.example.com';
const CLIENT_ID = process.env.OIDC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.OIDC_REDIRECT_URI || '';
const TOKEN_ENDPOINT = process.env.OIDC_TOKEN_ENDPOINT || '';
const JWKS_URI = process.env.OIDC_JWKS_URI || '';
const AUDIENCE = CLIENT_ID;

// JWKs cache and rotation
let jwksCache = null;
let jwksCacheExpiresAt = 0;
const JWKS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchJwks() {
  if (jwksCache && Date.now() < jwksCacheExpiresAt) {
    return jwksCache;
  }
  const res = await fetch(JWKS_URI);
  if (!res.ok) {
    throw new Error(`Failed to fetch JWKS: ${res.statusText}`);
  }
  const jwks = await res.json();
  jwksCache = jwks;
  jwksCacheExpiresAt = Date.now() + JWKS_CACHE_TTL;
  return jwks;
}

// Validate JWT token using JWKS
export async function validateJwt(token) {
  const jwks = await fetchJwks();
  const keyStore = jose.createRemoteJWKSet(new URL(JWKS_URI));
  try {
    const { payload } = await jose.jwtVerify(token, keyStore, {
      issuer: OIDC_ISSUER,
      audience: AUDIENCE,
    });
    return payload;
  } catch (err) {
    throw new Error(`JWT validation failed: ${err.message}`);
  }
}

// Mint Firebase custom token from OIDC payload
export async function mintFirebaseToken(uid, claims = {}) {
  return admin.auth().createCustomToken(uid, claims);
}

// PKCE code verifier and challenge generation
export function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

export function generateCodeChallenge(codeVerifier) {
  return base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
}

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Audit logging for auth events
export async function logAuthEvent(eventType, details) {
  const db = admin.firestore();
  const logRef = db.collection('authAuditLogs').doc();
  await logRef.set({
    eventType,
    details,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}
