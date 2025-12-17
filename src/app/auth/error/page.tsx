'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Auth Error Page
 *
 * Displays authentication errors in a user-friendly way.
 */
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An authentication error occurred.';
  let errorIcon = '⚠️';

  switch (error) {
    case 'AccessDenied':
      errorMessage = 'Access denied. Your email is not authorized to access the admin panel.';
      errorIcon = '🚫';
      break;
    case 'Verification':
      errorMessage = 'The verification link is invalid or has expired. Please try signing in again.';
      errorIcon = '⏰';
      break;
    case 'Configuration':
      errorMessage = 'There is a problem with the server configuration. Please contact support.';
      errorIcon = '⚙️';
      break;
    default:
      errorMessage = error || 'An unknown error occurred during authentication.';
      break;
  }

  return (
    <div className="min-h-screen bg-gradient-casino">
      <Navigation
        title="Authentication Error"
        subtitle="Something went wrong"
        emoji="⚠️"
      />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-casino-reverse shadow-card-dark rounded-xl p-8 border border-casinoRed/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-casinoRed/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{errorIcon}</span>
            </div>

            <h2 className="text-2xl font-heading font-bold text-casinoRed mb-4">
              Authentication Failed
            </h2>

            <p className="text-textSecondary mb-6">
              {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/signin"
                className="bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Try Again
              </Link>

              <Link
                href="/"
                className="text-textSecondary hover:text-textPrimary text-sm transition-colors"
              >
                Back to home
              </Link>
            </div>

            {error === 'AccessDenied' && (
              <div className="mt-8 pt-6 border-t border-casinoRed/10">
                <p className="text-xs text-textSecondary/70">
                  Only the administrator email can access this area.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-casino flex items-center justify-center">
        <div className="text-textPrimary">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
