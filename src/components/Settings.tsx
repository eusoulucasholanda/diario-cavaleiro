import { useRef, useState } from 'react';
import type { ProfileId } from '../types';
import { WORLDS } from '../data/worlds';
import { exportFile, isValidState, type AppState } from '../lib/storage';
import { syncEnabled } from '../lib/sync';
import { clearImages } from '../lib/idb';

interface Props {
  state: AppState;
  syncMsg: string;
  onClose: () => void;
  onImport: (s: AppState) => void;
  onReset: (p: ProfileId) => void;
  onUnlocked: (n: number) => void;
  onSyncNow: () => void;
}

export function Settings({ state, syncMsg, onClose, onImport, onReset, onUnlocked, onSyncNow }: Props) {
  const file = useRef<HTMLInputElement>(null);
  const [armed, setArmed] = useState(false);
  const [msg, setMsg] = useState('');
  const p = state.current;
  const prof = state.profiles[p];

  const doImport = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (!isValidState(data)) throw new Error();
      onImport(data);
      setMsg('Progresso importado.');
    } catch {
      setMsg('Arquivo inválido. Use um JSON exportado por este app.');
    }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Configurações" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Configurações</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <h3>Backup do progresso</h3>
        <p className="muted">Salva os dois perfis num arquivo .json. Leve para outro aparelho e importe lá.</p>
        <div className="btns">
          <button type="button" onClick={() => exportFile(state)}>Exportar JSON</button>
          <button type="button" onClick={() => file.current?.click()}>Importar JSON</button>
          <input ref={file} type="file" accept="application/json,.json" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ''; }} />
        </div>
        {msg && <p className="note">{msg}</p>}

        <h3>Spoiler leve</h3>
        <p className="muted">Mundos depois deste ficam com as dicas escondidas até você tocar.</p>
        <select value={prof.unlocked} onChange={(e) => onUnlocked(Number(e.target.value))} aria-label="Mundos destravados">
          {WORLDS.map((w, i) => <option key={w.id} value={i + 1}>Até {w.n} · {w.t}</option>)}
        </select>

        <h3>Sincronização</h3>
        {syncEnabled ? (
          <>
            <p className="muted">Supabase ligado. {syncMsg}</p>
            <div className="btns"><button type="button" onClick={onSyncNow}>Sincronizar agora</button></div>
          </>
        ) : (
          <p className="muted">Desligada. O progresso fica só neste aparelho (use exportar/importar). Para ligar, veja o README.</p>
        )}

        <h3>Prints enviados pelo app</h3>
        <div className="btns">
          <button type="button" onClick={async () => { await clearImages(); location.reload(); }}>Apagar prints salvos</button>
        </div>

        <h3>Zerar perfil {p === 'guerreiro' ? 'Guerreiro' : 'Mago'}</h3>
        <div className="btns">
          <button type="button" className={`danger ${armed ? 'armed' : ''}`}
            onClick={() => { if (armed) { onReset(p); setArmed(false); setMsg('Perfil zerado.'); } else { setArmed(true); setTimeout(() => setArmed(false), 4000); } }}>
            {armed ? 'Toque de novo para confirmar' : 'Zerar perfil'}
          </button>
        </div>
      </div>
    </div>
  );
}
