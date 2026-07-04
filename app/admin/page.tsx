'use client';

import { useState, type FormEvent } from 'react';

const DASHBOARD_CARDS = [
  { icon: '🏛️', title: 'Manage Featured Destinations', description: 'Curate which cities and attractions appear in the demo.', comingSoon: true },
  { icon: '💎', title: 'Review AI-Generated Hidden Gems', description: 'Approve or flag hidden gem suggestions before they go live.', comingSoon: true },
  { icon: '🤝', title: 'Add Local Experiences', description: 'Onboard new artisan workshops, guides, and cultural experiences.', comingSoon: true },
  { icon: '📊', title: 'Monitor API Usage', description: 'Track AI provider usage, fallback rates, and request volume.', comingSoon: true },
  { icon: '🚩', title: 'Review User Reports', description: 'Handle flagged content or inaccurate cultural information.', comingSoon: true },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Login failed.');
        setSubmitting(false);
        return;
      }
      setAuthenticated(true);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 sm:px-6">
        <div className="card w-full">
          <h1 className="text-center font-display text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Demo-only protected area. This is not a production authentication system.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">
                Demo password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
                aria-describedby={error ? 'admin-login-error' : undefined}
                aria-invalid={Boolean(error)}
              />
            </div>
            {error && (
              <p id="admin-login-error" role="alert" className="text-sm text-rose-700">
                {error}
              </p>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Checking…' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Demo workflow — full admin tooling is planned for a future release.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_CARDS.map((card) => (
          <div key={card.title} className="card">
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl" aria-hidden="true">{card.icon}</span>
              {card.comingSoon && <span className="badge bg-slate-100 text-slate-600">Coming Soon</span>}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
