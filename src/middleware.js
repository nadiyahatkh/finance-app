import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Redirect to /sign-in if no token is present
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const { pathname } = req.nextUrl;

    // Redirect logged-in users away from the /sign-in page
    // if (pathname === "/sign-in") {
    //   if ([1, 2, 3, 4].includes(token.role)) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url));
    //   } else if (token.role === 5) {
    //     return NextResponse.redirect(new URL('/user', req.url));
    //   }
    // }

    // Prevent roles 1, 2, 3, and 4 from accessing the "/user" page
    if ([1, 2, 3, 4].includes(token.role) && pathname === "/user") {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Restrict role 5 to only access the "/user" page
    if (token.role === 5 && pathname !== "/user") {
      return NextResponse.redirect(new URL('/user', req.url));
    }
    if (token.role === 5 && pathname === "/dashboard") {
        return NextResponse.redirect(new URL('/user', req.url));
      }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow access if the user has a token
    },
  }
);

export const config = {
  matcher: [
    "/user",
    "/dashboard",
    "/submission",
    // "/sign-in"
  ]
};
