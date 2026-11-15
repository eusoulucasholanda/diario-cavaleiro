/*
  Sincronização opcional com Supabase (REST, sem SDK).
  Só liga se existirem VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.
  Tabela: ver supabase/progress.sql (NÃO aplicada automaticamente).
*/
import type { ProfileId } from '../types';
import type { ProfileState } from './storage';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const syncEnabled = !!(URL_ && KEY);

const headers = () => ({
  apikey: KEY!,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
});

export async function pull(profile: ProfileId): Promise<ProfileState | null> {
  if (!syncEnabled) return null;
  const r = await fetch(`${URL_}/rest/v1/progress?profile=eq.${profile}&select=data`, { headers: headers() });
  if (!r.ok) throw new Error(`pull ${r.status}`);
  const rows = (await r.json()) as { data: ProfileState }[];
  return rows[0]?.data ?? null;
}

export async function push(profile: ProfileId, data: ProfileState): Promise<void> {
  if (!syncEnabled) return;
  const r = await fetch(`${URL_}/rest/v1/progress?on_conflict=profile`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ profile, data, updated_at: new Date(data.updated).toISOString() }),
  });
  if (!r.ok) throw new Error(`push ${r.status}`);
}
