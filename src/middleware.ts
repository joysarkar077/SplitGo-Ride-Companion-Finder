import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Custom middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    if (url.pathname.startsWith("/u/")) {
      return NextResponse.redirect(new URL(request.nextUrl, request.url));
    }
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow the request to continue if no redirect is necessary
  return NextResponse.next();
}

// Configuring path matchers
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};

// Default export from next-auth middleware
export { default } from "next-auth/middleware";
