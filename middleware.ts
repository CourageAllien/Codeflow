import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware that allows all routes for sandbox mode
// When Clerk is configured, replace with proper Clerk middleware
export function middleware(request: NextRequest) {
  // Allow all routes for now (sandbox mode)
  // In production with Clerk, add authentication here
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/sandbox",
    "/commands-guide",
    "/demo",
  ],
};

