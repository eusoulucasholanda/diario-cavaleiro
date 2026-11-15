import { useEffect, useRef } from 'react';
import type { FxKey } from '../types';

interface P { x: number; y: number; vx: number; vy: number; r: number; a: number; t: number }

// Partículas em canvas fixo atrás do conteúdo. Respeita "reduzir movimento".
export function Particles({ fx, color }: { fx: FxKey | 'embers'; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = fx === 'rain' ? 110 : fx === 'spores' ? 45 : 40;
    const spawn = (initial: boolean): P => {
      const x = Math.random() * w;
      const y = initial ? Math.random() * h : fx === 'rain' ? -20 : fx === 'embers' ? h + 10 : Math.random() * h;
      if (fx === 'rain') return { x, y, vx: -1.2, vy: 9 + Math.random() * 6, r: 0.8 + Math.random(), a: 0.15 + Math.random() * 0.3, t: 0 };
      if (fx === 'spores') return { x, y, vx: (Math.random() - 0.5) * 0.3, vy: -0.15 - Math.random() * 0.35, r: 1 + Math.random() * 2.4, a: 0.2 + Math.random() * 0.5, t: Math.random() * 6 };
      if (fx === 'embers') return { x, y, vx: (Math.random() - 0.5) * 0.4, vy: -0.4 - Math.random() * 0.8, r: 0.8 + Math.random() * 1.8, a: 0.3 + Math.random() * 0.5, t: Math.random() * 6 };
      return { x, y, vx: 0.1 + Math.random() * 0.25, vy: 0.05 + Math.random() * 0.12, r: 0.6 + Math.random() * 1.4, a: 0.1 + Math.random() * 0.35, t: Math.random() * 6 };
    };
    const ps = Array.from({ length: count }, () => spawn(true));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.t += 0.016;
        p.x += p.vx + (fx === 'rain' ? 0 : Math.sin(p.t) * 0.15);
        p.y += p.vy;
        if (p.y > h + 30 || p.y < -30 || p.x > w + 30 || p.x < -30) Object.assign(p, spawn(false));
        ctx.globalAlpha = p.a * (fx === 'rain' ? 1 : 0.6 + Math.sin(p.t * 2) * 0.4);
        if (fx === 'rain') {
          ctx.strokeStyle = color; ctx.lineWidth = p.r;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 2, p.y + 12); ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.shadowColor = color; ctx.shadowBlur = fx === 'dust' ? 0 : 8;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [fx, color]);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
