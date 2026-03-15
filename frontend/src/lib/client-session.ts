export function ensureSession(): string {
  if (typeof document === 'undefined') return '';

  const existing = document.cookie
    .split('; ')
    .find(row => row.startsWith('session_id='))
    ?.split('=')[1];

  if (existing) return existing;

  const id = crypto.randomUUID();
  // 30-day expiry, SameSite=Lax
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `session_id=${id}; expires=${expires}; path=/; SameSite=Lax`;
  return id;
}
