import { useEffect, useRef, useState } from 'react';
import { delImage, getImage, setImage } from '../lib/idb';
import { readPref, writePref } from '../lib/storage';

interface Props {
  slot: string;           // id único (ex.: "hero", "map:w1")
  src?: string;           // caminho do images.ts
  label: string;          // texto do placeholder
  hint?: string;          // nome do arquivo sugerido
  ratio?: string;         // aspect-ratio CSS
  caption?: boolean;      // mostra legenda + data editáveis
  className?: string;
  pos?: string;           // object-position do recorte
}

/*
  Ordem: print enviado pelo app (IndexedDB) > arquivo do images.ts > placeholder.
  Para trocar pelo app: tocar em "trocar print" ou focar o quadro e colar (Ctrl+V).
*/
export function ImageSlot({ slot, src, label, hint, ratio = '16 / 9', caption, className = '', pos }: Props) {
  const [local, setLocal] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [cap, setCap] = useState(() => readPref('cap:' + slot));
  const [date, setDate] = useState(() => readPref('date:' + slot));
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let url: string | null = null;
    getImage(slot).then((b) => { if (b) { url = URL.createObjectURL(b); setLocal(url); } });
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [slot]);

  useEffect(() => setFailed(false), [src]);

  const store = async (b: Blob) => {
    await setImage(slot, b);
    setLocal((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(b); });
    if (caption && !date) { const d = new Date().toLocaleDateString('pt-BR'); setDate(d); writePref('date:' + slot, d); }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const f = [...e.clipboardData.files].find((x) => x.type.startsWith('image/'));
    if (f) { e.preventDefault(); store(f); }
  };

  const remove = async () => {
    await delImage(slot);
    setLocal((old) => { if (old) URL.revokeObjectURL(old); return null; });
  };

  const shown = local ?? (src && !failed ? src : null);

  return (
    <figure className={`imgslot ${className}`}>
      <div className="imgslot-frame" style={{ aspectRatio: ratio }} tabIndex={0} onPaste={onPaste}
        aria-label={`${label}. Foque e cole um print para trocar.`}>
        {shown ? (
          <img src={shown} alt={label} loading="lazy" style={local ? undefined : { objectPosition: pos }}
            onError={() => !local && setFailed(true)} />
        ) : (
          <div className="imgslot-ph">
            <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M10 8c0 0 2 6 2 10-4 3-5 8-4 13 2 7 8 11 16 11s14-4 16-11c1-5 0-10-4-13 0-4 2-10 2-10l-6 6c-2-1.2-5-1.6-8-1.6s-6 .4-8 1.6Z" />
              <ellipse cx="18" cy="27" rx="3" ry="4.5" /><ellipse cx="30" cy="27" rx="3" ry="4.5" />
            </svg>
            <strong>{label}</strong>
            {hint && <span>public/{hint}</span>}
            <span>ou toque em "trocar print" / cole aqui</span>
          </div>
        )}
        <div className="imgslot-tools">
          <button type="button" onClick={() => input.current?.click()}>trocar print</button>
          {local && <button type="button" onClick={remove}>remover</button>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) store(f); e.target.value = ''; }} />
      </div>
      {caption && (
        <figcaption>
          <input value={cap} placeholder="Legenda do print" aria-label="Legenda"
            onChange={(e) => { setCap(e.target.value); writePref('cap:' + slot, e.target.value); }} />
          <input value={date} placeholder="data" aria-label="Data do print" className="date"
            onChange={(e) => { setDate(e.target.value); writePref('date:' + slot, e.target.value); }} />
        </figcaption>
      )}
    </figure>
  );
}
