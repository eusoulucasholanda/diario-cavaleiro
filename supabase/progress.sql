-- NÃO APLICADO. Rodar só depois de Lucas aprovar (ver README, seção Supabase).
-- Uma linha por perfil de save, progresso em JSON.

create table if not exists public.progress (
  profile text primary key check (profile in ('guerreiro', 'mago')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- O app usa só a chave anon (sem login). Estas políticas deixam a chave anon
-- ler e gravar SOMENTE as duas linhas de perfil, e não deixam apagar.
-- Atenção: quem tiver a URL + chave anon do projeto também consegue editar essas linhas.
-- Como é só progresso de jogo, o risco é baixo. Para trancar de vez, o passo seguinte
-- é login com Supabase Auth e uma coluna user_id = auth.uid().

create policy "progress_select" on public.progress
  for select to anon using (profile in ('guerreiro', 'mago'));

create policy "progress_insert" on public.progress
  for insert to anon with check (profile in ('guerreiro', 'mago'));

create policy "progress_update" on public.progress
  for update to anon using (profile in ('guerreiro', 'mago')) with check (profile in ('guerreiro', 'mago'));
