import Link from 'next/link';

const FEATURES = [
  { icon: '🧭', title: 'AI Destination Discovery', description: 'Personalized recommendations based on your interests, pace, and budget.' },
  { icon: '💎', title: 'Hidden Gems', description: 'Locally loved spots beyond the typical tourist trail.' },
  { icon: '📖', title: 'Heritage Storytelling', description: 'Immersive, respectful narratives that bring history to life.' },
  { icon: '🎉', title: 'Local Events', description: 'Sample and grounded cultural events happening around your trip.' },
  { icon: '🤝', title: 'Authentic Experiences', description: 'Connect with artisan workshops, cooking classes, and heritage walks.' },
  { icon: '♿', title: 'Accessibility-Aware Travel', description: 'Itineraries that respect mobility, pace, and comfort needs.' },
];

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-heritage-50 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="badge mx-auto bg-white text-saffron-700 shadow-sm">🇮🇳 GenAI travel discovery for India</p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Heritage<span className="text-saffron-600">Hop</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
            Discover India through stories, hidden gems, and authentic local culture.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/planner" className="btn-primary text-base">
              Plan My Cultural Trip
            </Link>
            <Link href="/planner?demo=jaipur" className="btn-secondary text-base">
              Explore Demo: Jaipur
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 id="features-heading" className="text-center font-display text-3xl font-bold text-slate-900">
          Everything you need to travel meaningfully
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <span className="text-3xl" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
