-- NÃO APLICADO. Rodar só depois de Lucas aprovar.
-- Progresso do Diário do Cavaleiro: uma linha por (conta, perfil de save).

create table if not exists public.diario_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profile text not null check (profile in ('guerreiro', 'mago')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, profile)
);

alter table public.diario_progress enable row level security;

-- Cada conta logada só lê e grava as próprias linhas. Sem login (anon), nada.
create policy "diario_select_own" on public.diario_progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "diario_insert_own" on public.diario_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "diario_update_own" on public.diario_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "diario_delete_own" on public.diario_progress
  for delete to authenticated using ((select auth.uid()) = user_id);
