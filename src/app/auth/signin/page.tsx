'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { LockIcon, MailIcon, SettingsIcon } from '@/lib/icons';

/**
 * Sign In Page
 *
 * Email-based magic link authentication.
 * ONLY the admin email (set in ADMIN_EMAIL env var) can sign in.
 * All other emails will be rejected.
 */
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('resend', {
        email: email.toLowerCase().trim(),
        redirect: false,
        callbackUrl: '/admin',
      });

      if (result?.error) {
        setError('Sign in failed. You may not have access to this admin panel.');
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-casino">
      <Navigation
        title="Admin Sign In"
        subtitle="Secure admin access"
        icon={LockIcon}
      />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-casino-reverse shadow-card-dark rounded-xl p-8 border border-casinoGold/20">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-casinoGreen/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailIcon size="xl" className="stroke-casinoGreen" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-casinoGreen mb-4">
                Check your email
              </h2>
              <p className="text-textSecondary mb-6">
                We've sent a magic link to <span className="text-textPrimary font-semibold">{email}</span>.
                Click the link in the email to sign in.
              </p>
              <p className="text-sm text-textSecondary/70">
                The link will expire in 24 hours.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 text-casinoGold hover:text-casinoGold/80 font-semibold"
              >
                ← Back to home
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-casinoGold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SettingsIcon size="xl" className="stroke-casinoGold" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-textPrimary mb-2">
                  Admin Access
                </h2>
                <p className="text-textSecondary text-sm">
                  Enter your admin email to receive a magic link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary placeholder-textSecondary/50 focus:ring-2 focus:ring-casinoGold outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {error && (
                  <div className="bg-casinoRed/10 border border-casinoRed/30 rounded-lg p-3 text-casinoRed text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-textSecondary hover:text-textPrimary text-sm transition-colors"
                >
                  ← Back to home
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-casinoGold/10">
                <p className="text-xs text-textSecondary/70 text-center flex items-center justify-center gap-2">
                  <LockIcon size="xs" className="stroke-textSecondary" />
                  <span>This is a secure admin area. Only authorized emails can sign in.</span>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
