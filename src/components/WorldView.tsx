import type { World } from '../types';
import { DEFAULT_ICON, GROUPS, XP } from '../data/game';
import { IMAGES } from '../images';
import { Bar, Ring, Row } from './Bits';
import { ImageSlot } from './ImageSlot';

interface Props {
  world: World;
  index: number;
  done: Record<string, 1>;
  locked: boolean;
  onToggle: (key: string) => void;
}

export function wikiName(title: string, wiki?: string) {
  if (wiki !== undefined) return wiki || undefined;
  return title.split(' (')[0].split(':')[0];
}

export function WorldView({ world, index, done, locked, onToggle }: Props) {
  const total = world.items.length;
  const count = world.items.filter((_, i) => done[`${world.id}:${i}`]).length;
  const pct = total ? Math.round((count / total) * 100) : 0;

  return (
    <section className="world" aria-labelledby={`t-${world.id}`}>
      <header className="world-head">
        <Ring pct={pct} />
        <div>
          <p className="eyebrow">{world.n}{locked && ' · ainda não destravado'}</p>
          <h2 id={`t-${world.id}`}>{world.t}</h2>
          <p className="sub">{world.sub}</p>
        </div>
      </header>

      <div className="card">
        <ImageSlot slot={`map:${world.id}`} src={IMAGES.maps[world.id]} label={`Meu mapa · ${world.t}`}
          hint={IMAGES.maps[world.id] ?? `img/mapa-${world.id}.png`} caption ratio="4 / 3" />
      </div>

      {world.vids.length > 0 && (
        <div className="card videos">
          <h3>Vídeo guia</h3>
          <ul>
            {world.vids.map((v) => (
              <li key={v.u}>
                <a href={v.u} target="_blank" rel="noopener noreferrer">
                  <span className="play" aria-hidden="true">▶</span>
                  <span><strong>{v.t}</strong><small>{v.c}</small></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {GROUPS.map((g) => {
        const entries = world.items.map((it, i) => ({ it, i })).filter(({ it }) => it[0] === g.type);
        if (!entries.length) return null;
        const gDone = entries.filter(({ i }) => done[`${world.id}:${i}`]).length;
        return (
          <div className="card group" key={g.type}>
            <div className="group-head">
              <h3>{g.label}</h3>
              <span>{gDone}/{entries.length}</span>
            </div>
            <Bar value={gDone} max={entries.length} />
            <ul className="rows">
              {entries.map(({ it, i }) => {
                const key = `${world.id}:${i}`;
                const [type, title, hint, wiki, icon] = it;
                return (
                  <Row key={key} done={!!done[key]} title={title} hint={hint}
                    icon={icon ?? DEFAULT_ICON[type]} xp={XP[type]} wiki={wikiName(title, wiki)}
                    photo={IMAGES.items[title]} spoiler={locked && !done[key]}
                    verify={hint.includes('(conferir')} onToggle={() => onToggle(key)} />
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="world-foot">Mundo {index + 1} · {count} de {total} itens</p>
    </section>
  );
}
