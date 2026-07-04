import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HeritageHop — Discover India Through Culture',
  description: 'Discover India through stories, hidden gems, and authentic local culture — a GenAI-powered travel discovery platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span aria-hidden="true" className="text-2xl">🪔</span>
          <span>
            Heritage<span className="text-saffron-600">Hop</span>
          </span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <a href="/planner" className="rounded-lg px-3 py-2 hover:bg-slate-100">Plan a Trip</a>
          <a href="/admin" className="rounded-lg px-3 py-2 hover:bg-slate-100">Admin</a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6">
        <p>HeritageHop — a GenAI-powered cultural travel discovery demo for India. Built for hackathon demonstration purposes.</p>
        <p className="mt-1">AI-generated content may be incomplete or imprecise — always verify details like hours, safety, and events locally.</p>
      </div>
    </footer>
  );
}
