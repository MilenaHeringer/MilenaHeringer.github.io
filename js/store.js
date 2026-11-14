import { SUPABASE_URL, SUPABASE_ANON_KEY, CONTENT_ROW_ID } from './config.js';

export const hasBackend = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let clientPromise = null;
export function getClient() {
  if (!hasBackend()) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm')
      .then(m => m.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  }
  return clientPromise;
}

export async function loadDefaults() {
  const r = await fetch('data/content.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error('Não foi possível carregar o conteúdo do site.');
  return r.json();
}

/** Content shown on the site: Supabase row when configured, else the bundled JSON. */
export async function loadContent() {
  const defaults = await loadDefaults();
  if (!hasBackend()) return { data: defaults, source: 'local' };
  try {
    const sb = await getClient();
    const { data, error } = await sb.from('site_content').select('data').eq('id', CONTENT_ROW_ID).maybeSingle();
    if (error) throw error;
    if (data && data.data) return { data: { ...defaults, ...data.data }, source: 'supabase' };
  } catch (e) {
    console.warn('Supabase indisponível, usando conteúdo local.', e);
  }
  return { data: defaults, source: 'local' };
}

// ---------- small safe-rendering helpers ----------
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
/** Allow only http(s), mailto, tel and relative paths. */
export function safeUrl(u) {
  const s = String(u ?? '').trim();
  if (!s) return '';
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return '';      // javascript:, data:, etc.
  return s.replace(/^\/+/, '');
}
export function youtubeId(url) {
  const s = String(url || '');
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(s) ? s : '');
}
export const slug = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
