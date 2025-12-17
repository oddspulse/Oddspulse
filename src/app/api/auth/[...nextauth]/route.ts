/**
 * NextAuth API Route Handler
 *
 * This handles all authentication requests including:
 * - Email magic link generation and verification
 * - Session management
 * - Sign in/out
 *
 * SECURITY: Only emails matching ADMIN_EMAIL can authenticate (configured in auth.ts)
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
