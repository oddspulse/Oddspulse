'use client';

export function PromoBanner() {
  return (
    <section className="mb-6">
      <div className="rounded-xl2 p-5 shadow-card-dark bg-gradient-purple relative overflow-hidden flex items-center card-3d">
        <div className="flex-1 space-y-2 z-10">
          <h2 className="text-xl font-bold drop-shadow-lg font-heading">
            Take part in our drawing
          </h2>
          <p className="text-sm text-white/90 drop-shadow">
            Win up to $50,000
          </p>

          <button className="mt-3 px-6 py-2.5 rounded-full bg-gradient-orange text-casinoBlack font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 text-sm">
            Play Now
          </button>

          <p className="text-xs mt-2 opacity-90 font-medium">
            13:24:11 • Don't miss out
          </p>
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
