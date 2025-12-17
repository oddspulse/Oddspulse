# Admin Authentication Setup

## Overview

The admin section of this Next.js application is protected with **email-based authentication** using **NextAuth** and an **admin email allow-list**. Only the designated admin email can access the admin panel.

## Security Features

✅ **Server-Side Protection**: Middleware blocks unauthorized access before pages load
✅ **Email Allow-List**: Only `ADMIN_EMAIL` can sign in
✅ **Magic Link Authentication**: Passwordless, secure email-based login
✅ **Hidden Admin Link**: Non-admin users never see the admin link in navigation
✅ **Session Management**: Secure JWT-based sessions

---

## Environment Variables

Add these variables to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Provider (Resend)
AUTH_RESEND_KEY=re_your_resend_api_key_here
EMAIL_FROM=noreply@yourdomain.com

# Admin Email - ONLY this email can access admin panel
ADMIN_EMAIL=your-admin-email@example.com
```

### How to Set Up

### 1. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in `.env.local`.

### 2. Set Up Resend (Email Provider)

1. Sign up at [https://resend.com](https://resend.com)
2. Create an API key in your Resend dashboard
3. Set `AUTH_RESEND_KEY=re_your_api_key_here`
4. Set `EMAIL_FROM=noreply@yourdomain.com` (must be a verified domain in Resend)

### 3. Set Your Admin Email

Set `ADMIN_EMAIL` to your email address:

```bash
ADMIN_EMAIL=admin@yourdomain.com
```

**IMPORTANT**: Only this exact email (case-insensitive) can sign in and access the admin panel.

### 4. Configure for Production

For production (Vercel, etc.), set `NEXTAUTH_URL` to your production domain:

```bash
NEXTAUTH_URL=https://yourdomain.com
```

---

## How It Works

### Sign In Flow

1. User visits `/auth/signin`
2. User enters their email
3. **Server checks**: Is this email === `ADMIN_EMAIL`?
   - ✅ **YES**: Magic link is sent to email
   - ❌ **NO**: Sign-in is denied
4. User clicks magic link in email
5. User is authenticated and redirected to `/admin`

### Server-Side Protection

The `/admin` route is protected by **middleware** (`src/middleware.ts`):

```typescript
// Runs on EVERY request to /admin/*
if (!session || !session.user?.isAdmin) {
  // Redirect to home - admin page NEVER loads
  return NextResponse.redirect('/');
}
```

This means:
- Non-admin users **cannot** access `/admin` even by typing the URL
- The admin page code never loads for unauthorized users
- Protection happens server-side, before any React components render

### UI Protection

The admin link in navigation is **conditionally rendered**:

```typescript
// Only show admin link if user is signed in AND is admin
if (session?.user?.isAdmin === true) {
  // Show admin link
}
```

Non-admin users never see the admin link.

---

## File Structure

### Core Auth Files

| File | Purpose |
|------|---------|
| `src/auth.ts` | NextAuth configuration, email provider setup, admin check |
| `src/middleware.ts` | Server-side route protection for `/admin/*` |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API route handler |
| `src/types/next-auth.d.ts` | TypeScript types for session with `isAdmin` flag |

### Auth UI Pages

| Page | Purpose |
|------|---------|
| `src/app/auth/signin/page.tsx` | Sign-in form (email input, magic link request) |
| `src/app/auth/error/page.tsx` | Auth error display |
| `src/app/auth/verify/page.tsx` | "Check your email" confirmation |

### Protected Pages

| Page | Protection |
|------|-----------|
| `src/app/admin/page.tsx` | Protected by middleware + session check |

### Components

| Component | Purpose |
|-----------|---------|
| `src/components/SessionProvider.tsx` | Wraps app with NextAuth session provider |
| `src/components/Navigation.tsx` | Conditionally shows/hides admin link |

---

## Usage

### Accessing Admin Panel

1. Navigate to `/admin` or click "Admin" in navigation (if signed in as admin)
2. If not signed in, you'll be redirected to home
3. Go to `/auth/signin` to sign in
4. Enter your admin email (must match `ADMIN_EMAIL`)
5. Check your email for the magic link
6. Click the link to sign in
7. You'll be redirected to `/admin`

### Signing Out

Click the "Sign Out" button in the admin panel (top right).

---

## Testing

### Test Admin Access

1. Set `ADMIN_EMAIL=your-test-email@example.com` in `.env.local`
2. Visit `/auth/signin`
3. Enter `your-test-email@example.com`
4. Check your email for magic link
5. Click link → should access `/admin`

### Test Non-Admin Access

1. Visit `/auth/signin`
2. Enter a different email (not `ADMIN_EMAIL`)
3. Should see "Sign in failed" error
4. No magic link will be sent

### Test Direct URL Access

1. Sign out (or use incognito)
2. Try to visit `/admin` directly
3. Should redirect to home page
4. Admin page never loads

---

## Security Best Practices

✅ **DO**:
- Keep `NEXTAUTH_SECRET` secret and secure
- Use a strong, randomly generated secret
- Set `ADMIN_EMAIL` to a secure email you control
- Use a verified domain in Resend
- Set appropriate `NEXTAUTH_URL` for production

❌ **DON'T**:
- Commit `.env.local` to Git
- Share your `NEXTAUTH_SECRET`
- Use weak or predictable secrets
- Set `ADMIN_EMAIL` to a public or shared email

---

## Troubleshooting

### "Sign in failed" Error

**Cause**: Email doesn't match `ADMIN_EMAIL`
**Solution**: Check that your email exactly matches `ADMIN_EMAIL` in `.env.local`

### Magic Link Not Received

**Causes**:
- Email is in spam folder
- `AUTH_RESEND_KEY` is invalid
- `EMAIL_FROM` domain not verified in Resend

**Solutions**:
- Check spam folder
- Verify Resend API key is correct
- Verify sending domain in Resend dashboard

### Redirected from /admin

**Cause**: Not signed in or not admin
**Solution**: Sign in at `/auth/signin` with admin email

### "Configuration Error"

**Cause**: Missing or invalid environment variables
**Solution**: Check all required env vars are set in `.env.local`

---

## Adding More Admins

Currently, the system supports **one admin email**. To add more admins:

### Option 1: Multiple Emails (Simple)

Update `src/auth.ts`:

```typescript
const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com',
];

// In signIn callback:
if (ADMIN_EMAILS.includes(email.toLowerCase())) {
  return true;
}
```

### Option 2: Database (Advanced)

Store admin emails in a database and query on sign-in. This requires:
- Database setup (Prisma, etc.)
- Admin management UI
- Database queries in auth callbacks

---

## Production Deployment

### Vercel

1. Add all environment variables in Vercel dashboard:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production domain)
   - `AUTH_RESEND_KEY`
   - `EMAIL_FROM`
   - `ADMIN_EMAIL`

2. Make sure to check all environments (Production, Preview, Development)

3. Redeploy after adding variables

### Other Platforms

Follow the same process - add all required environment variables to your deployment platform's configuration.

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review NextAuth docs: https://next-auth.js.org/
- Review Resend docs: https://resend.com/docs

---

**Security Note**: This authentication system is designed for a single-admin use case. For multi-user admin systems, consider adding:
- Database-backed user management
- Role-based access control (RBAC)
- Admin user management UI
- Audit logs
