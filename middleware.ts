import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Sadece bu rotalar için auth gerekecek
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - api (API routes)
     * - static (static files)
     * - public folder
     * - favicon.ico (favicon file)
     */
    '/((?!_next|api|static|public|favicon.ico).*)',
    '/dashboard/:path*',
    '/my-farm/:path*',
    '/upload/:path*',
    '/queue/:path*',
    '/projects/:path*',
    '/job/:path*',
    '/settings/:path*',
    '/user/:path*',
  ]
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public sayfaları kontrol et
    if (
      pathname === "/" || 
      pathname === "/login" || 
      pathname === "/register" || 
      pathname === "/faq" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      pathname.startsWith("/public") ||
      pathname === "/favicon.ico"
    ) {
      return NextResponse.next();
    }

    // Auth kontrolü
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
); 