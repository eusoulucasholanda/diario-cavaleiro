import { useState } from 'react';
import { signIn, signUp } from '../lib/sync';

export function Login({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async (kind: 'in' | 'up') => {
    if (!email || pass.length < 6) { setErr('Preencha o e-mail e uma senha de 6+ caracteres.'); return; }
    setBusy(true); setErr('');
    try {
      if (kind === 'in') { await signIn(email.trim(), pass); onDone('Entrou! Sincronizando…'); }
      else {
        const direct = await signUp(email.trim(), pass);
        onDone(direct ? 'Conta criada e conectada!' : 'Conta criada. Abra o e-mail de confirmação e depois toque em Entrar.');
      }
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet" role="dialog" aria-modal="true" aria-label="Entrar" onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); run('in'); }}>
        <div className="sheet-head">
          <h2>Salvar na nuvem</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <p className="muted">Entre com a mesma conta no celular e no computador. O progresso dos dois perfis fica igual nos dois.</p>
        <label className="field">E-mail
          <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">Senha
          <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        {err && <p className="note err">{err}</p>}
        <div className="btns">
          <button type="submit" className="primary" disabled={busy}>{busy ? 'Aguarde…' : 'Entrar'}</button>
          <button type="button" disabled={busy} onClick={() => run('up')}>Criar conta</button>
        </div>
      </form>
    </div>
  );
}
