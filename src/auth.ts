import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import type { NextAuthConfig } from 'next-auth';

// Admin email - ONLY this email can access admin features
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'youremail@example.com';

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  callbacks: {
    // Control who can sign in
    async signIn({ user }) {
      const email = user.email?.toLowerCase();

      // ONLY allow admin email to sign in
      if (email === ADMIN_EMAIL.toLowerCase()) {
        console.log(`[Auth] Admin sign-in allowed: ${email}`);
        return true;
      }

      console.log(`[Auth] Sign-in denied for non-admin: ${email}`);
      return false; // Deny all other emails
    },

    // Add isAdmin flag to session
    async session({ session, token }) {
      if (session.user) {
        const email = session.user.email?.toLowerCase();
        session.user.isAdmin = email === ADMIN_EMAIL.toLowerCase();
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const email = user.email?.toLowerCase();
        token.isAdmin = email === ADMIN_EMAIL.toLowerCase();
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  session: {
    strategy: 'jwt',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
