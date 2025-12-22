'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { MailIcon } from '@/lib/icons';

/**
 * Email Verification Page
 *
 * Shown after user requests a magic link.
 * Instructs them to check their email.
 */
export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-casino">
      <Navigation
        title="Check Your Email"
        subtitle="Magic link sent"
        icon={MailIcon}
      />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-casino-reverse shadow-card-dark rounded-xl p-8 border border-casinoGold/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-casinoGreen/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">✉️</span>
            </div>

            <h2 className="text-2xl font-heading font-bold text-casinoGreen mb-4">
              Check Your Inbox
            </h2>

            <p className="text-textSecondary mb-6">
              We've sent you a magic link to sign in. Click the link in the email to access the admin panel.
            </p>

            <div className="bg-casinoGold/10 border border-casinoGold/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-textPrimary">
                <strong className="text-casinoGold">📬 Didn't receive the email?</strong>
              </p>
              <ul className="text-xs text-textSecondary mt-2 space-y-1 text-left">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/signin"
                className="bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Try Another Email
              </Link>

              <Link
                href="/"
                className="text-textSecondary hover:text-textPrimary text-sm transition-colors"
              >
                Back to home
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-casinoGold/10">
              <p className="text-xs text-textSecondary/70">
                The magic link will expire in 24 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
