'use client';

import { ArrowUpRight, Check, Copy, Link2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function ShareInvitation({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState('');

  async function copy() {
    const url = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setManualLink('');
      setCopied(true);
    } catch {
      setManualLink(url);
      setCopied(false);
    }
  }

  return (
    <section className="surface share-card">
      <div className="share-copy"><span className="event-icon"><Link2 size={21} aria-hidden="true" /></span><div><h2>Link do convite</h2><p>Compartilhe com seus convidados para receber as confirmações.</p></div></div>
      <div className="share-actions">
        <Link className="button button-secondary" href={href}>Abrir convite <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <button className="button button-primary" type="button" onClick={copy}>{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied ? 'Link copiado' : 'Copiar link'}</button>
      </div>
      <span className="visually-hidden" role="status">{copied ? 'Link do convite copiado.' : ''}</span>
      {manualLink && <label className="field share-manual">Copie o link do convite
        <input value={manualLink} type="url" readOnly ref={(input) => { if (input) { input.focus(); input.select(); } }} />
      </label>}
    </section>
  );
}
