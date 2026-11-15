import type { ProfileId } from '../types';
import { ABIL, BUILDS, CHARMS, MAX_NOTCHES, NAIL_UPGRADES, NOTCHES, START_NOTCHES } from '../data/forge';
import { WORLDS } from '../data/worlds';
import { IMAGES } from '../images';
import { Bar, Row } from './Bits';
import { ImageSlot } from './ImageSlot';
import { Icon } from './Icon';

interface Props {
  profile: ProfileId;
  done: Record<string, 1>;
  fk: Record<string, 1>;
  unlocked: number;
  onToggleFk: (key: string) => void;
}

export function Forge({ profile, done, fk, unlocked, onToggleFk }: Props) {
  const build = BUILDS[profile];
  const other = BUILDS[profile === 'guerreiro' ? 'mago' : 'guerreiro'];
  const notchDone = NOTCHES.filter((_, i) => fk[`n${i}`]).length;
  const charmDone = CHARMS.filter((_, i) => fk[`c${i}`]).length;
  const isLocked = (w: string) => {
    if (w === 'later') return true;
    const idx = WORLDS.findIndex((x) => x.id === w);
    return idx >= unlocked;
  };
  const coreSlots = build.core.reduce((s, n) => {
    const c = CHARMS.find((x) => x[0] === n);
    return s + (c ? parseInt(c[1]) || 0 : 0);
  }, 0);

  // Charms: núcleo da build atual primeiro.
  const charms = CHARMS.map((c, i) => ({ c, i })).sort((a, b) =>
    Number(build.core.includes(b.c[0])) - Number(build.core.includes(a.c[0])));

  return (
    <section className="world forge" aria-labelledby="t-forge">
      <header className="world-head">
        <div className="forge-emblem"><Icon k="anvil" size={34} /></div>
        <div>
          <p className="eyebrow">Build · {build.name}</p>
          <h2 id="t-forge">A Forja</h2>
          <p className="sub">Amuletos, encaixes, prego e a ordem do que comprar.</p>
        </div>
      </header>

      <div className="card core">
        <h3>Núcleo da build</h3>
        <div className="core-chips">
          {build.core.map((n) => {
            const i = CHARMS.findIndex((c) => c[0] === n);
            const have = i >= 0 && fk[`c${i}`];
            return <span key={n} className={`chip ${have ? 'on' : ''}`}>{have ? '✓ ' : ''}{n}</span>;
          })}
        </div>
        <p>{build.coreText}</p>
        <p className="muted">Custo do núcleo: <strong>{coreSlots} slots</strong> · você tem <strong>{START_NOTCHES + notchDone}</strong> encaixes.</p>
      </div>

      <div className="card">
        <h3>Prioridades de compra</h3>
        <ol className="prio">
          {build.prio.map(([t, d], i) => (
            <li key={t}><span className="prio-n">{i + 1}</span><div><strong>{t}</strong><p>{d}</p></div></li>
          ))}
        </ol>
      </div>

      <div className="card">
        <div className="group-head">
          <h3>Encaixes</h3>
          <span className="big">{START_NOTCHES + notchDone} de {MAX_NOTCHES}</span>
        </div>
        <div className="notch-dots" aria-hidden="true">
          {Array.from({ length: MAX_NOTCHES }, (_, i) => <i key={i} className={i < START_NOTCHES + notchDone ? 'on' : ''} />)}
        </div>
        <ul className="rows">
          {NOTCHES.map(([t, d, w], i) => (
            <Row key={i} done={!!fk[`n${i}`]} title={t} hint={d} icon="hex" spoiler={isLocked(w) && !fk[`n${i}`]}
              badges={w === 'later' ? ['mais tarde'] : undefined} verify={d.includes('(conferir')} onToggle={() => onToggleFk(`n${i}`)} />
          ))}
        </ul>
      </div>

      <ImageSlot slot="middle" src={IMAGES.middle.src} pos={IMAGES.middle.pos} label="Cavaleiro · meio da página"
        hint={IMAGES.middle.src} ratio="21 / 9" className="wide" />

      <div className="card">
        <div className="group-head"><h3>Amuletos</h3><span>{charmDone}/{CHARMS.length}</span></div>
        <Bar value={charmDone} max={CHARMS.length} />
        <ul className="rows">
          {charms.map(({ c: [name, cost, hint, w, verify], i }) => {
            const badges = [cost || 'custo ?'];
            if (build.core.includes(name)) badges.unshift('★ núcleo');
            else if (other.core.includes(name)) badges.push(profile === 'guerreiro' ? 'mago' : 'guerreiro');
            return (
              <Row key={i} done={!!fk[`c${i}`]} title={name} hint={hint} icon="hex" wiki={name}
                photo={IMAGES.items[name]} badges={badges} verify={verify}
                spoiler={isLocked(w) && !fk[`c${i}`]} onToggle={() => onToggleFk(`c${i}`)} />
            );
          })}
        </ul>
      </div>

      <div className="card">
        <h3>Habilidades</h3>
        <p className="muted">Marcadas automaticamente quando você conclui o item no mundo.</p>
        <ul className="abil">
          {ABIL.map(([n, key]) => (
            <li key={n} className={done[key] ? 'on' : ''}>
              <Icon k={n.includes('Spirit') || n.includes('Dive') ? 'flame' : 'claw'} />
              <span>{n}</span>
              <small>{done[key] ? 'desbloqueada' : 'falta'}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Upgrades do prego (Nailsmith)</h3>
        <table className="nail">
          <tbody>
            {NAIL_UPGRADES.map(([n, c], i) => (
              <tr key={n}><td>{i + 1}</td><td>{n}</td><td>{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card two">
        <ImageSlot slot="forge:charms" src={IMAGES.forge.charms} label="Tela de amuletos" hint={IMAGES.forge.charms} caption ratio="16 / 10" />
        <ImageSlot slot="forge:inventory" src={IMAGES.forge.inventory} label="Inventário" hint={IMAGES.forge.inventory} caption ratio="16 / 10" />
      </div>
    </section>
  );
}
