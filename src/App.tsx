import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Palette, ProfileId } from './types';
import { WORLDS } from './data/worlds';
import { FORGE_PAL } from './data/forge';
import { RANKS, XP } from './data/game';
import { IMAGES } from './images';
import { emptyProfile, load, readPref, save, writePref, type AppState, type ProfileState } from './lib/storage';
import { pull, push, syncEnabled } from './lib/sync';
import { Scene } from './components/Scene';
import { Particles } from './components/Particles';
import { WorldView } from './components/WorldView';
import { Forge } from './components/Forge';
import { Settings } from './components/Settings';
import { ImageSlot } from './components/ImageSlot';
import { Bar } from './components/Bits';

const ALL_ITEMS = WORLDS.flatMap((w) => w.items.map((it, i) => ({ key: `${w.id}:${i}`, type: it[0], w: w.id })));

function stats(p: ProfileState) {
  const doneN = ALL_ITEMS.filter((x) => p.done[x.key]).length;
  const xp = ALL_ITEMS.reduce((s, x) => s + (p.done[x.key] ? XP[x.type] : 0), 0);
  const maxXp = ALL_ITEMS.reduce((s, x) => s + XP[x.type], 0);
  const pct = ALL_ITEMS.length ? Math.round((doneN / ALL_ITEMS.length) * 100) : 0;
  let r = 0;
  RANKS.forEach(([, min], i) => { if (pct >= min) r = i; });
  return { doneN, xp, maxXp, pct, rank: r };
}

interface Toast { id: number; text: string; big?: boolean }

function applyPalette(p: Palette) {
  const s = document.documentElement.style;
  s.setProperty('--bg1', p.bg1); s.setProperty('--bg2', p.bg2);
  s.setProperty('--acc', p.acc); s.setProperty('--acc2', p.acc2); s.setProperty('--glow', p.glow);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.bg1);
}

export default function App() {
  const [state, setState] = useState<AppState>(load);
  const [tab, setTab] = useState(() => readPref('tab', 'w4'));
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [syncMsg, setSyncMsg] = useState('');
  const bannerRef = useRef<HTMLDivElement>(null);

  const p = state.current;
  const prof = state.profiles[p];
  const st = useMemo(() => stats(prof), [prof]);
  const world = WORLDS.find((w) => w.id === tab);
  const activeTab = world ? tab : 'forge';
  const pal = world?.pal ?? FORGE_PAL;

  useEffect(() => { applyPalette(pal); }, [pal]);
  useEffect(() => {
    writePref('tab', activeTab);
    const btn = document.querySelector<HTMLElement>('.tabs button.on');
    const nav = btn?.parentElement;
    if (btn && nav) nav.scrollTo({ left: btn.offsetLeft - nav.offsetLeft - 16, behavior: 'smooth' });
  }, [activeTab]);

  // salvar local sempre; nuvem com atraso
  // só envia depois de puxar a nuvem uma vez, pra não sobrescrever progresso mais novo
  const pulled = useRef(false);
  const pushedAt = useRef<Record<ProfileId, number>>({ guerreiro: 0, mago: 0 });

  useEffect(() => {
    save(state);
    if (!syncEnabled || !pulled.current) return;
    const t = setTimeout(async () => {
      try {
        for (const id of ['guerreiro', 'mago'] as ProfileId[]) {
          const pr = state.profiles[id];
          if (pr.updated !== pushedAt.current[id]) { await push(id, pr); pushedAt.current[id] = pr.updated; }
        }
        setSyncMsg(`Salvo na nuvem às ${new Date().toLocaleTimeString('pt-BR').slice(0, 5)}.`);
      } catch { setSyncMsg('Sem conexão: salvo só neste aparelho por enquanto.'); }
    }, 1200);
    return () => clearTimeout(t);
  }, [state]);

  const syncNow = useCallback(async () => {
    if (!syncEnabled) return;
    try {
      const remote: Partial<Record<ProfileId, ProfileState>> = {};
      for (const id of ['guerreiro', 'mago'] as ProfileId[]) {
        const r = await pull(id);
        if (r) { remote[id] = r; }
      }
      pulled.current = true;
      setState((s) => {
        const profiles = { ...s.profiles };
        for (const id of ['guerreiro', 'mago'] as ProfileId[]) {
          const r = remote[id];
          if (r && r.updated >= profiles[id].updated) { profiles[id] = r; pushedAt.current[id] = r.updated; }
        }
        return { ...s, profiles };
      });
      setSyncMsg('Sincronizado com a nuvem.');
    } catch { setSyncMsg('Não consegui falar com o Supabase.'); }
  }, []);

  // puxa da nuvem uma vez ao abrir (vence o mais recente)
  useEffect(() => { syncNow(); /* eslint-disable-next-line */ }, []);

  const toast = (text: string, big = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, big }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), big ? 3200 : 1800);
  };

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
            {(['guerreiro', 'mago'] as ProfileId[]).map((id) => (
              <button key={id} type="button" role="tab" aria-selected={p === id}
                className={p === id ? 'on' : ''} onClick={() => setState((s) => ({ ...s, current: id }))}>
                {id === 'guerreiro' ? '⚔ Guerreiro' : '✦ Mago'}
              </button>
            ))}
          </div>
          <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label="Configurações">⚙</button>
        </header>

        <div className="hero">
          <ImageSlot slot="hero" src={IMAGES.hero} label="O Cavaleiro" hint={IMAGES.hero} ratio="16 / 10" className="hero-img" />
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
          <ImageSlot slot="end" src={IMAGES.end} label="Cavaleiro · fim da página" hint={IMAGES.end} ratio="21 / 9" />
          <p className="muted small">Diário do Cavaleiro · uso pessoal · fã-projeto sem arte oficial</p>
        </footer>
      </div>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast ${t.big ? 'big' : ''}`}>{t.text}</div>)}
      </div>

      {open && (
        <Settings state={state} syncMsg={syncMsg} onClose={() => setOpen(false)} onSyncNow={syncNow}
          onImport={(s) => setState(s)}
          onReset={(id) => setState((s) => ({ ...s, profiles: { ...s.profiles, [id]: emptyProfile(s.profiles[id].unlocked) } }))}
          onUnlocked={(n) => updateProfile((pr) => ({ ...pr, unlocked: n }))} />
      )}
    </>
  );
}
