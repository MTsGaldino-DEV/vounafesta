import Link from 'next/link';
import { SiteHeader } from './components/site-header';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="login-layout">
        <section className="surface login-card">
          <h1>Página indisponível.</h1>
          <p className="muted">Confira se o endereço que você recebeu está completo.</p>
          <Link className="button button-primary" href="/">Voltar ao início</Link>
        </section>
      </main>
    </>
  );
}
