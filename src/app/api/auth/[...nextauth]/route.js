import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const res = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { "ngrok-skip-browser-warning": true, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (!res.ok) {
            const error = await res.json();
            console.error('Login failed:', error);
            throw new Error('Login failed: ' + error.message);
          }

          const user = await res.json();

          if (user && user.data.email) {
            return {
              ...user,
              role: user.data.role,
            };
          } else {
            throw new Error('No user data found');
          }
        } catch (error) {
          console.error('Error in authorize function:', error);
          throw new Error('Authorization error: ' + error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials") {
        token.id = user.data.id;
        token.email = user.data.email;
        token.foto = user.data.foto;
        token.name = user.data.name;
        token.role = user.data.role_id; // Set the role from the user object
        token.token = user.token;
        console.log('JWT callback:', token);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.foto = token.foto;
      session.user.name = token.name;
      session.user.role = token.role; // Ensure role is set here
      session.user.token = token.token;
      console.log('Session callback:', session);
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };