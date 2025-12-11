'use client';

export function PromoBanner() {
  return (
    <section className="mb-6">
      <div className="rounded-xl2 p-5 shadow-card bg-gradient-to-br from-casinoPurple via-casinoOrangeLight to-casinoOrange flex items-center relative overflow-hidden">
        <div className="flex-1 space-y-2 z-10">
          <h2 className="text-xl font-bold drop-shadow-lg font-heading">
            Top Casino Bonuses
          </h2>
          <p className="text-sm text-white/90 drop-shadow">
            Compare offers and claim your welcome bonus.
          </p>

          <button className="mt-3 px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-300 text-sm">
            Explore Bonuses
          </button>
        </div>

        <div className="ml-4 w-24 h-24 rounded-full bg-white/10 shadow-soft backdrop-blur-sm flex items-center justify-center">
          <span className="text-4xl">🎁</span>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-casinoOrange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-casinoPurple/20 rounded-full blur-2xl" />
      </div>
    </section>
  );
}
