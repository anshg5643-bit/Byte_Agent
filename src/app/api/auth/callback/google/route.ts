import { NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleUserProfile } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state") || "/";

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error || "no_code_provided")}`, request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const profile = await getGoogleUserProfile(tokens.access_token);

    // Build success redirect URL with user profile data
    const successUrl = new URL(state, request.url);
    successUrl.searchParams.set("oauth_success", "true");
    successUrl.searchParams.set("email", profile.email);
    successUrl.searchParams.set("name", profile.name);
    if (profile.picture) {
      successUrl.searchParams.set("picture", profile.picture);
    }

    const response = NextResponse.redirect(successUrl);

    // Set secure HTTP-only session cookie with access token
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in || 3600,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth Callback Error:", err);
    return NextResponse.redirect(
      new URL("/auth?error=token_exchange_failed", request.url)
    );
  }
}
