// ─────────────────────────────────────────────────────────────
//  Configuração do Supabase (veja o LEIA-ME.md, passo a passo).
//  Enquanto estiver vazio, o site usa o arquivo data/content.json.
//  A "anon key" é pública por natureza: a segurança vem das
//  regras (RLS) criadas pelo arquivo supabase/schema.sql.
// ─────────────────────────────────────────────────────────────
export const SUPABASE_URL = '';        // ex.: 'https://abcdefgh.supabase.co'
export const SUPABASE_ANON_KEY = '';   // Project Settings → API → anon public
export const STORAGE_BUCKET = 'arquivos';
export const CONTENT_ROW_ID = 'principal';
