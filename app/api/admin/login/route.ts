import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientKey } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';

// SECURITY-SENSITIVE: This is a demo-only mock login for the /admin route.
// It is NOT a real authentication system — no session tokens, no hashing,
// no persistence. It exists solely to gate the admin demo dashboard behind
// a password check without ever exposing ADMIN_DEMO_PASSWORD to the client.
export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req.headers);
  const rate = checkRateLimit(`admin-login:${clientKey}`, { max: 5, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const password = typeof (body as any)?.password === 'string' ? (body as any).password : '';
  const expected = process.env.ADMIN_DEMO_PASSWORD ?? 'heritage-demo-2026';

  if (password.length === 0 || password !== expected) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
