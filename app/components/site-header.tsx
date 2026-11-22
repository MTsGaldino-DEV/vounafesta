import { ArrowUpRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Vou na Festa, início">
          <span className="brand-icon"><PartyPopper size={19} aria-hidden="true" /></span>
          <span>vou na festa<span className="brand-dot">.</span></span>
        </Link>
        {children ?? (
          <Link className="header-link" href="/organizador/login">
            Área do organizador <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </header>
  );
}
