'use client';

/**
 * AdPlaceholder Component
 *
 * Placeholder area for potential advertisements
 * Maintains consistent spacing and layout on home page
 */
export function AdPlaceholder() {
  return (
    <section className="mb-6">
      <div className="rounded-xl border-2 border-dashed border-casinoGold/20 bg-casinoBlack2/30 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-casinoGold/10 flex items-center justify-center">
            <span className="text-3xl">📢</span>
          </div>
          <p className="text-sm font-heading text-textSecondary uppercase tracking-wide">
            Advertisement Space
          </p>
          <p className="text-xs text-textSecondary/60 max-w-md">
            This area is reserved for promotional content
          </p>
        </div>
      </div>
    </section>
  );
}
