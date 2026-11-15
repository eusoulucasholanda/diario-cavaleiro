/*
  Sincronização com Supabase + login por e-mail e senha.
  Só liga se existirem VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.
  Cada conta só enxerga as próprias linhas (RLS por auth.uid()). Tabela: supabase/progress.sql.
*/
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ProfileId } from '../types';
import type { ProfileState } from './storage';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const TABLE = 'diario_progress';

export const supa: SupabaseClient | null = URL_ && KEY
  ? createClient(URL_, KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'diario-cavaleiro-auth' } })
  : null;

export const syncEnabled = !!supa;

export async function pull(profile: ProfileId): Promise<ProfileState | null> {
  const { data, error } = await supa!.from(TABLE).select('data').eq('profile', profile).maybeSingle();
  if (error) throw error;
  return (data?.data as ProfileState) ?? null;
}

export async function push(userId: string, profile: ProfileId, data: ProfileState): Promise<void> {
  const { error } = await supa!.from(TABLE).upsert(
    { user_id: userId, profile, data, updated_at: new Date(data.updated || Date.now()).toISOString() },
    { onConflict: 'user_id,profile' },
  );
  if (error) throw error;
}

function pt(msg: string) {
  if (/invalid login/i.test(msg)) return 'E-mail ou senha errados.';
  if (/not confirmed/i.test(msg)) return 'Confirme o e-mail primeiro (veja a caixa de entrada).';
  if (/already registered|already exists/i.test(msg)) return 'Esse e-mail já tem conta. Use "Entrar".';
  if (/at least 6/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (/fetch|network/i.test(msg)) return 'Sem conexão com a internet.';
  return msg;
}

export async function signIn(email: string, password: string) {
  const { error } = await supa!.auth.signInWithPassword({ email, password });
  if (error) throw new Error(pt(error.message));
}

/** devolve true se já entrou direto (sem precisar confirmar e-mail) */
export async function signUp(email: string, password: string) {
  const { data, error } = await supa!.auth.signUp({
    email, password, options: { emailRedirectTo: location.origin + location.pathname },
  });
  if (error) throw new Error(pt(error.message));
  return !!data.session;
}

export const signOut = () => supa!.auth.signOut();
