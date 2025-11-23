import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Public routes that don't require auth
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/api/auth"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but trying to access auth pages, redirect to overview
  if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/personal/overview", request.url));
  }

  // Check onboarding status for authenticated users
  if (token) {
    const onboardingCompleted = token.onboardingCompleted as boolean | undefined;

    // Routes that don't require onboarding
    const onboardingExempt = [
      "/onboarding",
      "/api/onboarding",
      "/api/auth",
      "/auth/login",
      "/auth/register",
    ];

    const isExempt = onboardingExempt.some((route) => pathname.startsWith(route));

    // If onboarding not completed and trying to access non-exempt route
    if (!onboardingCompleted && !isExempt && !isPublicRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // If onboarding completed but trying to access onboarding page
    if (onboardingCompleted && pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/personal/overview", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /static (static files)
     * 3. /favicon.ico, /sitemap.xml (static files)
     * 4. /.well-known (security files)
     */
    "/((?!_next|static|favicon.ico|sitemap.xml|.well-known).*)",
  ],
};

