import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Palette, ProfileId } from './types';
import { WORLDS } from './data/worlds';
import { FORGE_PAL } from './data/forge';
import { RANKS, XP } from './data/game';
import { IMAGES } from './images';
import { emptyProfile, load, readPref, save, writePref, type AppState, type ProfileState } from './lib/storage';
import { pull, push, signOut, supa, syncEnabled } from './lib/sync';
import { Scene } from './components/Scene';
import { Particles } from './components/Particles';
import { WorldView } from './components/WorldView';
import { Forge } from './components/Forge';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { ImageSlot } from './components/ImageSlot';
import { Bar } from './components/Bits';

const ALL_ITEMS = WORLDS.flatMap((w) => w.items.map((it, i) => ({ key: `${w.id}:${i}`, type: it[0], w: w.id })));
const PROFILES: ProfileId[] = ['guerreiro', 'mago'];

function stats(p: ProfileState) {
  const doneN = ALL_ITEMS.filter((x) => p.done[x.key]).length;
  const xp = ALL_ITEMS.reduce((s, x) => s + (p.done[x.key] ? XP[x.type] : 0), 0);
  const pct = ALL_ITEMS.length ? Math.round((doneN / ALL_ITEMS.length) * 100) : 0;
  let r = 0;
  RANKS.forEach(([, min], i) => { if (pct >= min) r = i; });
  return { doneN, xp, pct, rank: r };
}

interface Toast { id: number; text: string; big?: boolean }
type Cloud = 'off' | 'out' | 'syncing' | 'saved' | 'dirty' | 'error';

function applyPalette(p: Palette) {
  const s = document.documentElement.style;
  s.setProperty('--bg1', p.bg1); s.setProperty('--bg2', p.bg2);
  s.setProperty('--acc', p.acc); s.setProperty('--acc2', p.acc2); s.setProperty('--glow', p.glow);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.bg1);
}

export default function App() {
  const [state, setState] = useState<AppState>(load);
  const [tab, setTab] = useState(() => readPref('tab', 'w4'));
  const [sheet, setSheet] = useState<'none' | 'settings' | 'login'>('none');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [cloud, setCloud] = useState<Cloud>(syncEnabled ? 'out' : 'off');
  const bannerRef = useRef<HTMLDivElement>(null);

  const p = state.current;
  const prof = state.profiles[p];
  const st = useMemo(() => stats(prof), [prof]);
  const world = WORLDS.find((w) => w.id === tab);
  const activeTab = world ? tab : 'forge';
  const pal = world?.pal ?? FORGE_PAL;
  const hero = IMAGES.hero[activeTab] ?? IMAGES.heroDefault;
  const userId = session?.user.id;

  useEffect(() => { applyPalette(pal); }, [pal]);
  useEffect(() => {
    writePref('tab', activeTab);
    const btn = document.querySelector<HTMLElement>('.tabs button.on');
    const nav = btn?.parentElement;
    if (btn && nav) nav.scrollTo({ left: btn.offsetLeft - nav.offsetLeft - 16, behavior: 'smooth' });
  }, [activeTab]);

  const toast = useCallback((text: string, big = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, big }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), big ? 3200 : 1900);
  }, []);

  // ---------- nuvem ----------
  const pulled = useRef(false);
  const pushedAt = useRef<Record<ProfileId, number>>({ guerreiro: -1, mago: -1 });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!supa) return;
    supa.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supa.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const pushAll = useCallback(async (force = false) => {
    if (!userId || !pulled.current) return;
    setCloud('syncing');
    try {
      for (const id of PROFILES) {
        const pr = stateRef.current.profiles[id];
        if (force || pr.updated !== pushedAt.current[id]) { await push(userId, id, pr); pushedAt.current[id] = pr.updated; }
      }
      setCloud('saved');
    } catch { setCloud('error'); }
  }, [userId]);

  // puxa a nuvem e funde: vence o perfil mexido por último
  const pullMerge = useCallback(async (isAlive: () => boolean = () => true) => {
    if (!userId) return;
    setCloud('syncing');
    try {
      const remote: Partial<Record<ProfileId, ProfileState>> = {};
      for (const id of PROFILES) { const r = await pull(id); if (r) remote[id] = r; }
      if (!isAlive()) return;
      setState((s) => {
        const profiles = { ...s.profiles };
        for (const id of PROFILES) {
          const r = remote[id];
          if (r && r.updated >= profiles[id].updated) { profiles[id] = r; pushedAt.current[id] = r.updated; }
        }
        return { ...s, profiles };
      });
      pulled.current = true;
      setCloud('saved');
      setTimeout(() => pushAll(), 50); // envia o que só existia neste aparelho
    } catch { if (isAlive()) setCloud('error'); }
  }, [userId, pushAll]);

  // ao entrar (ou abrir já logado)
  useEffect(() => {
    pulled.current = false;
    pushedAt.current = { guerreiro: -1, mago: -1 };
    if (!userId) { setCloud(syncEnabled ? 'out' : 'off'); return; }
    let alive = true;
    pullMerge(() => alive);
    return () => { alive = false; };
  }, [userId, pullMerge]);

  // ao voltar pro app (trocar de aba, desbloquear o celular): busca o que mudou no outro aparelho
  useEffect(() => {
    if (!userId) return;
    let last = Date.now();
    const onBack = () => {
      if (document.visibilityState !== 'visible' || Date.now() - last < 3000) return;
      last = Date.now();
      pullMerge();
    };
    document.addEventListener('visibilitychange', onBack);
    window.addEventListener('focus', onBack);
    return () => { document.removeEventListener('visibilitychange', onBack); window.removeEventListener('focus', onBack); };
  }, [userId, pullMerge]);

  // salva local sempre; nuvem 1,2 s depois da última mudança
  useEffect(() => {
    save(state);
    if (!userId || !pulled.current) return;
    const dirty = PROFILES.some((id) => state.profiles[id].updated !== pushedAt.current[id]);
    if (!dirty) return;
    setCloud('dirty');
    const t = setTimeout(() => pushAll(), 1200);
    return () => clearTimeout(t);
  }, [state, userId, pushAll]);

  const onCloud = async () => {
    if (cloud === 'off') return;
    if (!userId) { setSheet('login'); return; }
    await pushAll(true);
    toast('Salvo na nuvem ☁');
  };

  const cloudLabel: Record<Cloud, string> = {
    off: '', out: '☁ Entrar', syncing: '☁ Salvando…', saved: '☁ Salvo ✓', dirty: '☁ Salvar', error: '☁ Sem rede',
  };

  // ---------- progresso ----------
  const updateProfile = (fn: (pr: ProfileState) => ProfileState) =>
    setState((s) => ({ ...s, profiles: { ...s.profiles, [s.current]: { ...fn(s.profiles[s.current]), updated: Date.now() } } }));

  const toggleItem = (key: string) => {
    const was = !!prof.done[key];
    const done = { ...prof.done };
    if (was) delete done[key]; else done[key] = 1;
    updateProfile((pr) => ({ ...pr, done }));
    if (!was) {
      const item = ALL_ITEMS.find((x) => x.key === key)!;
      toast(`+${XP[item.type]} XP`);
      const w = WORLDS.find((x) => x.id === item.w)!;
      if (w.items.every((_, i) => done[`${w.id}:${i}`])) toast(`${w.n} completo!`, true);
      const after = stats({ ...prof, done });
      if (after.rank > st.rank) toast(`Novo rank: ${RANKS[after.rank][0]}`, true);
    }
  };

  const toggleFk = (key: string) => {
    const was = !!prof.fk[key];
    updateProfile((pr) => {
      const fk = { ...pr.fk };
      if (was) delete fk[key]; else fk[key] = 1;
      return { ...pr, fk };
    });
    if (!was) toast(key.startsWith('n') ? 'Novo encaixe!' : 'Amuleto guardado');
  };

  // ---------- parallax ----------
  const onBannerMove = (e: React.PointerEvent) => {
    const el = bannerRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  };
  useEffect(() => {
    const onScroll = () => bannerRef.current?.style.setProperty('--py', Math.min(window.scrollY / 300, 1).toFixed(3));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unlockedIdx = prof.unlocked;

  return (
    <>
      <Particles fx={world?.fx ?? 'embers'} color={pal.acc} />
      <div className="app">
        <header className="top">
          <div className="profiles" role="tablist" aria-label="Perfil de save">
            {PROFILES.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={p === id}
                className={p === id ? 'on' : ''} onClick={() => setState((s) => ({ ...s, current: id }))}>
                {id === 'guerreiro' ? '⚔ Guerreiro' : '✦ Mago'}
              </button>
            ))}
          </div>
          <div className="top-right">
            {cloud !== 'off' && (
              <button type="button" className={`cloud cloud-${cloud}`} onClick={onCloud}
                aria-label={userId ? 'Salvar na nuvem agora' : 'Entrar para salvar na nuvem'}>
                {cloudLabel[cloud]}
              </button>
            )}
            <button type="button" className="icon-btn" onClick={() => setSheet('settings')} aria-label="Configurações">⚙</button>
          </div>
        </header>

        <div className="hero">
          <ImageSlot key={activeTab} slot={`hero:${activeTab}`} src={hero.src} pos={hero.pos}
            label="O Cavaleiro" hint={hero.src} ratio="16 / 10" className="hero-img" />
          <div className="hero-text">
            <p className="eyebrow">Hollow Knight · save {p === 'guerreiro' ? 'Guerreiro' : 'Mago'}</p>
            <h1>Diário do Cavaleiro</h1>
            <div className="rank">
              <div><span className="rank-name">{RANKS[st.rank][0]}</span><span className="muted"> · rank {st.rank + 1} de {RANKS.length}</span></div>
              <div className="rank-num"><strong>{st.pct}%</strong><span>{st.xp} XP</span></div>
            </div>
            <Bar value={st.doneN} max={ALL_ITEMS.length} />
            {st.rank < RANKS.length - 1 && (
              <p className="muted small">Próximo: {RANKS[st.rank + 1][0]} com {RANKS[st.rank + 1][1]}%</p>
            )}
          </div>
        </div>

        <nav className="tabs" aria-label="Mundos">
          {WORLDS.map((w, i) => {
            const c = w.items.filter((_, j) => prof.done[`${w.id}:${j}`]).length;
            return (
              <button key={w.id} type="button" className={activeTab === w.id ? 'on' : ''} onClick={() => setTab(w.id)}>
                <span>{w.n}</span><small>{Math.round((c / w.items.length) * 100)}%{i >= unlockedIdx ? ' · 🔒' : ''}</small>
              </button>
            );
          })}
          <button type="button" className={activeTab === 'forge' ? 'on' : ''} onClick={() => setTab('forge')}>
            <span>Forja</span><small>build</small>
          </button>
        </nav>

        <div className="banner" ref={bannerRef} onPointerMove={onBannerMove} onPointerLeave={() => bannerRef.current?.style.setProperty('--px', '0')}>
          <Scene key={activeTab} scene={world?.scene ?? 'forge'} />
        </div>

        <main>
          {world ? (
            <WorldView key={world.id + p} world={world} index={WORLDS.indexOf(world)} done={prof.done}
              locked={WORLDS.indexOf(world) >= unlockedIdx} onToggle={toggleItem} />
          ) : (
            <Forge profile={p} done={prof.done} fk={prof.fk} unlocked={unlockedIdx} onToggleFk={toggleFk} />
          )}
        </main>

        <footer className="end">
          <ImageSlot slot="end" src={IMAGES.end.src} pos={IMAGES.end.pos} label="Cavaleiro · fim da página" hint={IMAGES.end.src} ratio="16 / 10" />
          <p className="muted small">Diário do Cavaleiro · uso pessoal</p>
        </footer>
      </div>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast ${t.big ? 'big' : ''}`}>{t.text}</div>)}
      </div>

      {sheet === 'login' && (
        <Login onClose={() => setSheet('none')} onDone={(m) => { toast(m, true); setSheet('none'); }} />
      )}
      {sheet === 'settings' && (
        <Settings state={state} cloud={cloud} email={session?.user.email}
          onClose={() => setSheet('none')}
          onLogin={() => setSheet('login')}
          onLogout={async () => { await signOut(); toast('Saiu da conta. O progresso continua neste aparelho.'); }}
          onSyncNow={() => pushAll(true)}
          onImport={(s) => setState({ ...s, profiles: { guerreiro: { ...s.profiles.guerreiro, updated: Date.now() }, mago: { ...s.profiles.mago, updated: Date.now() } } })}
          onReset={(id) => setState((s) => ({ ...s, profiles: { ...s.profiles, [id]: emptyProfile(s.profiles[id].unlocked) } }))}
          onUnlocked={(n) => updateProfile((pr) => ({ ...pr, unlocked: n }))} />
      )}
    </>
  );
}
