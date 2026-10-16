import { NextResponse } from "next/server";
import { getGoogleOAuthUrl, GOOGLE_OAUTH_CONFIG } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/";

  // Check if Google Client ID is configured
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    return NextResponse.redirect(
      new URL("/auth?error=google_client_id_missing", request.url)
    );
  }

  const authUrl = getGoogleOAuthUrl(returnTo);
  return NextResponse.redirect(authUrl);
}
