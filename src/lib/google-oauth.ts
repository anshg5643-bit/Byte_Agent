/**
 * Google OAuth 2.0 Integration Utility for ByteAgent Portal
 * 
 * Supports both:
 * 1. Server-side OAuth 2.0 Authorization Code flow (standard redirect)
 * 2. Client-side Google Identity Services (GIS) / Credential decoding
 */

export interface GoogleTokens {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string; // Hosted domain (e.g., college.edu or workspace domain)
}

export interface GoogleJwtPayload {
  iss: string;
  sub: string;
  azp?: string;
  aud: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  hd?: string;
}

// OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback/google`
      : "http://localhost:3000/api/auth/callback/google"),
  authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
  scopes: [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
};

/**
 * Generate Google OAuth 2.0 authorization URL
 * @param state Optional CSRF token or return path
 */
export function getGoogleOAuthUrl(state: string = "/"): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: "code",
    scope: GOOGLE_OAUTH_CONFIG.scopes.join(" "),
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `${GOOGLE_OAUTH_CONFIG.authEndpoint}?${params.toString()}`;
}

/**
 * Exchange authorization code for access and ID tokens
 * @param code Authorization code returned by Google callback
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  if (!GOOGLE_OAUTH_CONFIG.clientId || !GOOGLE_OAUTH_CONFIG.clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables. Please check your .env.local file."
    );
  }

  const response = await fetch(GOOGLE_OAUTH_CONFIG.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to exchange code with Google: ${response.status} ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetch authenticated Google user profile using an access token
 * @param accessToken Google OAuth access token
 */
export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch(GOOGLE_OAUTH_CONFIG.userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Decodes a Google JWT credential (ID Token) from Google Identity Services (One Tap)
 * without needing an external library.
 * @param credential JWT token string
 */
export function decodeGoogleJwt(credential: string): GoogleJwtPayload | null {
  try {
    const parts = credential.split(".");
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as GoogleJwtPayload;
  } catch (err) {
    console.error("Failed to decode Google JWT credential:", err);
    return null;
  }
}
