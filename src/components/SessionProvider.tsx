'use client';

/**
 * Session Provider Component
 *
 * Wraps the app with NextAuth SessionProvider to enable client-side session access.
 * This is required for useSession() hook to work in client components.
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
