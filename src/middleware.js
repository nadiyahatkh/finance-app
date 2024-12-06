import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const { pathname } = req.nextUrl;

    if (pathname === "/") {
      if ([1, 2, 3, 4].includes(token.role)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else if (token.role === 5) {
        return NextResponse.redirect(new URL('/user', req.url));
      }
    }


    if ([1, 2, 3, 4].includes(token.role) && pathname === "/user") {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (token.role === 5 && pathname !== "/user") {
      return NextResponse.redirect(new URL('/user', req.url));
    }
    if (token.role === 5 && pathname === "/dashboard") {
        return NextResponse.redirect(new URL('/user', req.url));
      }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/user",
    "/dashboard",
    "/submission",
    // "/sign-in"
  ]
};
