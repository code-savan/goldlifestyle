import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("admin_session");

  // Allow access to auth pages
  if (pathname.startsWith("/store/auth")) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // Protect /store routes
  if (pathname.startsWith("/store")) {
    if (!session) {
      return NextResponse.redirect(new URL("/store/auth/signin", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/store/:path*"],
};
