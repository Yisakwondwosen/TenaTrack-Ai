/**
 * Authentication service for VeriFayda OIDC integration
 * Handles OIDC flow, token management, and user info fetching
 */

import axios from 'axios';

const TOKEN_ENDPOINT = process.env.OIDC_TOKEN_ENDPOINT || '';
const USERINFO_ENDPOINT = process.env.OIDC_USERINFO_ENDPOINT || '';
const CLIENT_ID = process.env.OIDC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.OIDC_REDIRECT_URI || '';

/**
 * Exchange authorization code for tokens
 * @param {string} code - Authorization code from OIDC provider
 * @param {string} codeVerifier - PKCE code verifier
 * @returns {Promise<object>} - Token response including id_token and access_token
 */
export async function exchangeCodeForToken(code, codeVerifier) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('client_id', CLIENT_ID);
  params.append('code_verifier', codeVerifier);

  const response = await axios.post(TOKEN_ENDPOINT, params, {
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

/**
 * Fetch user info from OIDC provider
 * @param {string} accessToken - Access token
 * @returns {Promise<object>} - User info response
 */
export async function fetchUserInfo(accessToken) {
  const response = await axios.get(USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
