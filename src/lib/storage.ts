import type { ProfileId } from '../types';
import { SEED } from '../data/game';

export interface ProfileState {
  done: Record<string, 1>;
  fk: Record<string, 1>;
  /** até qual mundo (1..N) está destravado; os seguintes ficam com spoiler leve */
  unlocked: number;
  updated: number;
}

export interface AppState {
  v: 1;
  current: ProfileId;
  profiles: Record<ProfileId, ProfileState>;
}

const KEY = 'diario-cavaleiro:v1';

const toMap = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, 1 as const]));

export const emptyProfile = (unlocked = 1): ProfileState => ({ done: {}, fk: {}, unlocked, updated: Date.now() });

function fresh(): AppState {
  return {
    v: 1,
    current: 'guerreiro',
    profiles: {
      // updated: 0 = "nunca mexido": no 1º login, o que estiver na nuvem vence
      guerreiro: { done: toMap(SEED.done), fk: toMap(SEED.fk), unlocked: 4, updated: 0 },
      mago: { ...emptyProfile(1), updated: 0 },
    },
  };
}

export function isValidState(x: unknown): x is AppState {
  const s = x as AppState;
  return !!s && s.v === 1 && !!s.profiles?.guerreiro && !!s.profiles?.mago;
}

export function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) return parsed;
    }
  } catch { /* storage bloqueado: segue com estado novo */ }
  return fresh();
}

export function save(s: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* sem espaço ou bloqueado */ }
}

export function exportFile(s: AppState) {
  const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `diario-cavaleiro-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function readPref(k: string, def = ''): string {
  try { return localStorage.getItem('dc:' + k) ?? def; } catch { return def; }
}
export function writePref(k: string, v: string) {
  try { localStorage.setItem('dc:' + k, v); } catch { /* ignora */ }
}
