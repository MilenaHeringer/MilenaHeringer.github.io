-- ─────────────────────────────────────────────────────────────
--  Site Milena Heringer · estrutura do Supabase
--  Cole este arquivo inteiro em: Supabase → SQL Editor → New query → Run
--  ANTES de rodar, troque SEU-EMAIL@exemplo.com (linha 12) pelo
--  e-mail que você vai usar para entrar no painel administrativo.
-- ─────────────────────────────────────────────────────────────

-- Quem é a administradora (só este e-mail pode alterar o site)
create or replace function public.is_admin()
returns boolean language sql stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'SEU-EMAIL@exemplo.com'
$$;

-- 1) Tabela com todo o conteúdo do site (um único registro JSON)
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "conteudo publico" on public.site_content;
create policy "conteudo publico" on public.site_content
  for select using (true);

drop policy if exists "somente admin altera" on public.site_content;
create policy "somente admin altera" on public.site_content
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 2) Armazenamento de arquivos (PDFs e imagens) com leitura pública, até 50 MB por arquivo
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('arquivos', 'arquivos', true, 52428800,
        array['application/pdf','image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 52428800,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "admin envia arquivos" on storage.objects;
create policy "admin envia arquivos" on storage.objects
  for insert to authenticated with check (bucket_id = 'arquivos' and public.is_admin());

drop policy if exists "admin altera arquivos" on storage.objects;
create policy "admin altera arquivos" on storage.objects
  for update to authenticated using (bucket_id = 'arquivos' and public.is_admin());

drop policy if exists "admin exclui arquivos" on storage.objects;
create policy "admin exclui arquivos" on storage.objects
  for delete to authenticated using (bucket_id = 'arquivos' and public.is_admin());
