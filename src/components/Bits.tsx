import { useState } from 'react';
import type { IconKey } from '../types';
import { Icon } from './Icon';
import { wikiUrl } from '../data/game';

export function Ring({ pct, size = 64 }: { pct: number; size?: number }) {
  const r = size / 2 - 5, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% concluído`}>
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" />
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-fg"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle">{pct}%</text>
    </svg>
  );
}

export function Bar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-valuemin={0}>
      <div style={{ width: pct + '%' }} />
    </div>
  );
}

interface RowProps {
  done: boolean;
  title: string;
  hint: string;
  icon: IconKey;
  photo?: string;
  xp?: number;
  wiki?: string;
  badges?: string[];
  spoiler?: boolean;
  verify?: boolean;
  onToggle: () => void;
}

export function Row({ done, title, hint, icon, photo, xp, wiki, badges, spoiler, verify, onToggle }: RowProps) {
  const [reveal, setReveal] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const hidden = spoiler && !reveal;
  return (
    <li className={`row ${done ? 'is-done' : ''}`}>
      <button type="button" className="check" aria-pressed={done} onClick={onToggle}
        aria-label={`${done ? 'Desmarcar' : 'Marcar'} ${title}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>
      </button>
      <div className="row-body">
        <div className="row-title">
          <span>{title}</span>
          {badges?.map((b) => <em key={b} className="badge">{b}</em>)}
          {verify && <em className="badge warn" title="Informação a conferir no wiki">conferir</em>}
        </div>
        {hidden ? (
          <button type="button" className="spoiler" onClick={() => setReveal(true)}>
            Spoiler leve: área ainda não destravada. Toque para ver a dica.
          </button>
        ) : (
          <p className="row-hint">{hint.replace(/\s*\(conferir[^)]*\)/g, '')}</p>
        )}
        <div className="row-meta">
          {xp !== undefined && <span className="xp">+{xp} XP</span>}
          {wiki && (
            <a href={wikiUrl(wiki)} target="_blank" rel="noopener noreferrer">ver no wiki ↗</a>
          )}
        </div>
      </div>
      <div className="row-icon">
        {photo && photoOk ? <img src={photo} alt="" onError={() => setPhotoOk(false)} /> : <Icon k={icon} />}
      </div>
    </li>
  );
}
