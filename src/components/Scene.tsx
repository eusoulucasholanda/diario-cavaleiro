import { useMemo } from 'react';
import type { SceneKey } from '../types';

/*
  Banners originais em SVG, gerados com números "aleatórios" fixos (semente),
  em camadas com profundidades diferentes para o parallax.
  --px (-1..1) é atualizado pelo componente pai conforme o dedo/mouse e a rolagem.
*/

const W = 800, H = 260;

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function ridge(seed: number, y: number, amp: number, n = 22, smooth = true) {
  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([-60 + ((W + 120) * i) / n, y - r() * amp]);
  let d = `M-60 ${H + 10} L${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, yy] = pts[i];
    if (smooth) {
      const [px, py] = pts[i - 1];
      d += ` Q${px + (x - px) / 2} ${py} ${x} ${yy}`;
    } else d += ` L${x} ${yy}`;
  }
  return d + ` L${W + 60} ${H + 10} Z`;
}

function stalactites(seed: number, count: number, maxLen: number) {
  const r = rng(seed);
  let d = `M-60 -10 L${W + 60} -10 L${W + 60} 6`;
  for (let i = 0; i < count; i++) {
    const x = W + 60 - ((W + 120) * (i + 1)) / count;
    const w = 14 + r() * 26;
    d += ` L${x + w / 2} ${4 + r() * 8} L${x} ${18 + r() * maxLen} L${x - w / 2} ${4 + r() * 8}`;
  }
  return d + ` L-60 6 Z`;
}

const Layer = ({ k, cls, children, sway }: { k: number; cls: string; children: React.ReactNode; sway?: boolean }) => (
  <g className={`layer ${cls}`} style={{ ['--k' as string]: k }}>
    <g className={sway ? 'sway' : undefined}>{children}</g>
  </g>
);

function Sky({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--bg1)" />
          <stop offset="1" stopColor="var(--bg2)" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--acc)" stopOpacity=".55" />
          <stop offset=".4" stopColor="var(--acc2)" stopOpacity=".18" />
          <stop offset="1" stopColor="var(--acc2)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fog-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--bg2)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--bg1)" stopOpacity=".95" />
        </linearGradient>
      </defs>
      <rect x="-60" y="-10" width={W + 120} height={H + 20} fill={`url(#sky-${id})`} />
      <circle className="pulse" cx="560" cy="90" r="190" fill={`url(#glow-${id})`} />
    </>
  );
}

function Crossroads() {
  const r = rng(7);
  const pillars = Array.from({ length: 6 }, (_, i) => ({ x: 40 + i * 140 + r() * 40, h: 90 + r() * 70, w: 16 + r() * 10 }));
  return (
    <>
      <Layer k={4} cls="far"><path d={ridge(11, 150, 60)} /></Layer>
      <Layer k={8} cls="mid">
        {pillars.map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={H - p.h - 40} width={p.w} height={p.h + 40} />
            <rect x={p.x - 6} y={H - p.h - 48} width={p.w + 12} height={10} rx={2} />
          </g>
        ))}
        <path d={ridge(23, 205, 30)} />
      </Layer>
      <Layer k={14} cls="near"><path d={stalactites(5, 16, 60)} /></Layer>
      <Layer k={20} cls="front">
        <path d={ridge(31, 245, 18, 14)} />
        {/* banco e lanterna */}
        <g transform="translate(120 214)">
          <rect x="0" y="0" width="54" height="5" rx="2" /><rect x="4" y="5" width="4" height="14" /><rect x="46" y="5" width="4" height="14" />
          <rect x="2" y="-12" width="50" height="4" rx="2" />
        </g>
        <g transform="translate(640 150)">
          <rect x="-1.5" y="0" width="3" height="80" />
          <circle className="lamp" cx="0" cy="-6" r="7" />
        </g>
      </Layer>
      <rect x="-60" y={H - 90} width={W + 120} height="100" fill="url(#fog-crossroads)" />
    </>
  );
}

function Greenpath() {
  const r = rng(19);
  const vines = Array.from({ length: 14 }, (_, i) => {
    const x = -20 + i * 62 + r() * 30, len = 50 + r() * 120;
    return { x, len, d: `M${x} -5 C${x + 18} ${len * 0.3} ${x - 18} ${len * 0.7} ${x + 4} ${len}` };
  });
  const bushes = Array.from({ length: 18 }, () => ({ x: r() * W, y: 200 + r() * 40, rx: 30 + r() * 50, ry: 14 + r() * 20 }));
  const orbs = Array.from({ length: 9 }, () => ({ x: r() * W, y: 60 + r() * 140, rad: 2 + r() * 3 }));
  return (
    <>
      <Layer k={4} cls="far"><path d={ridge(41, 140, 70)} /></Layer>
      <Layer k={9} cls="mid"><path d={ridge(43, 190, 50, 30)} />
        {orbs.map((o, i) => <circle key={i} className="orb" cx={o.x} cy={o.y} r={o.rad} style={{ animationDelay: `${i * 0.7}s` }} />)}
      </Layer>
      <Layer k={15} cls="near" sway>
        {vines.map((v, i) => (
          <g key={i}>
            <path d={v.d} fill="none" strokeWidth={3} className="vine" />
            <ellipse cx={v.x + 4} cy={v.len} rx={7} ry={4} />
            <ellipse cx={v.x - 2} cy={v.len * 0.6} rx={6} ry={3} />
          </g>
        ))}
      </Layer>
      <Layer k={22} cls="front">
        {bushes.map((b, i) => <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} />)}
        <path d={ridge(47, 250, 10, 12)} />
      </Layer>
      <rect x="-60" y={H - 90} width={W + 120} height="100" fill="url(#fog-greenpath)" />
    </>
  );
}

function Mushroom({ x, y, s, cap }: { x: number; y: number; s: number; cap?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0 C-4 -30 -8 -50 -3 -70 L3 -70 C8 -50 4 -30 6 0 Z" />
      <path d="M-42 -66 C-38 -100 38 -100 42 -66 C28 -72 -28 -72 -42 -66 Z" />
      {cap && <circle className="spot" cx="-12" cy="-82" r="4" />}
      {cap && <circle className="spot" cx="14" cy="-78" r="3" />}
    </g>
  );
}

function Fungal() {
  const r = rng(53);
  const far = Array.from({ length: 7 }, (_, i) => ({ x: 40 + i * 120 + r() * 40, s: 0.7 + r() * 0.6 }));
  const mid = Array.from({ length: 5 }, (_, i) => ({ x: 70 + i * 170 + r() * 40, s: 1 + r() * 0.5 }));
  return (
    <>
      <Layer k={4} cls="far">
        <path d={ridge(57, 170, 40)} />
        {far.map((m, i) => <Mushroom key={i} x={m.x} y={175} s={m.s * 0.8} />)}
      </Layer>
      <Layer k={10} cls="mid" sway>
        {mid.map((m, i) => <Mushroom key={i} x={m.x} y={225} s={m.s} cap />)}
        <path d={ridge(59, 225, 20)} />
      </Layer>
      <Layer k={16} cls="near"><path d={stalactites(61, 10, 40)} /></Layer>
      <Layer k={22} cls="front">
        <Mushroom x={720} y={268} s={1.9} cap />
        <Mushroom x={40} y={268} s={1.4} cap />
        <path d={ridge(67, 252, 12, 12)} />
      </Layer>
      <rect x="-60" y={H - 90} width={W + 120} height="100" fill="url(#fog-fungal)" />
    </>
  );
}

function Tower({ x, w, h, seed }: { x: number; w: number; h: number; seed: number }) {
  const r = rng(seed);
  const wins = [];
  for (let yy = H - h + 26; yy < H - 30; yy += 18)
    for (let xx = x + 5; xx < x + w - 6; xx += 10) if (r() > 0.6) wins.push([xx, yy]);
  return (
    <g>
      <rect x={x} y={H - h} width={w} height={h} />
      <path d={`M${x - 3} ${H - h} L${x + w / 2} ${H - h - 30 - r() * 30} L${x + w + 3} ${H - h} Z`} />
      {wins.map(([a, b], i) => <rect key={i} className="win" x={a} y={b} width={3} height={6} rx={1} style={{ animationDelay: `${(i % 7) * 0.9}s` }} />)}
    </g>
  );
}

function City() {
  const r = rng(71);
  const far = Array.from({ length: 12 }, (_, i) => ({ x: -30 + i * 72 + r() * 20, w: 26 + r() * 28, h: 80 + r() * 110 }));
  const mid = Array.from({ length: 7 }, (_, i) => ({ x: -10 + i * 125 + r() * 30, w: 40 + r() * 30, h: 60 + r() * 80 }));
  return (
    <>
      <Layer k={3} cls="far">{far.map((t, i) => <Tower key={i} {...t} seed={100 + i} />)}</Layer>
      <Layer k={9} cls="mid">{mid.map((t, i) => <Tower key={i} {...t} seed={200 + i} />)}</Layer>
      <Layer k={16} cls="near">
        <path d={`M-60 ${H} L-60 150 Q40 110 140 150 L140 ${H} Z`} />
        <path d={`M${W + 60} ${H} L${W + 60} 140 Q${W - 40} 100 ${W - 150} 140 L${W - 150} ${H} Z`} />
      </Layer>
      <Layer k={22} cls="front">
        <rect x="-60" y="240" width={W + 120} height="30" />
        {[180, 420, 610].map((x) => (
          <g key={x} transform={`translate(${x} 160)`}>
            <rect x="-1.5" y="0" width="3" height="82" />
            <path d="M-8 0 H8 L5 -12 H-5 Z" />
            <circle className="lamp" cx="0" cy="-6" r="5" />
          </g>
        ))}
      </Layer>
      <rect x="-60" y={H - 90} width={W + 120} height="100" fill="url(#fog-city)" />
    </>
  );
}

const SCENES: Record<SceneKey, () => JSX.Element> = { crossroads: Crossroads, greenpath: Greenpath, fungal: Fungal, city: City };

export function Scene({ scene }: { scene: SceneKey | 'forge' }) {
  const key: SceneKey = scene === 'forge' ? 'crossroads' : scene;
  const Body = useMemo(() => SCENES[key], [key]);
  return (
    <svg className={`scene scene-${scene}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Sky id={key} />
      <Body />
    </svg>
  );
}
