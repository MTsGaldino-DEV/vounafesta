import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { RecoverForm } from '../forms';

export const metadata = { title: 'Recuperar senha', robots: { index: false, follow: false } };

export default async function RecoverPage({ searchParams }: PageProps<'/organizador/recuperar'>) {
  const expired = (await searchParams).erro === '1';
  return (
    <>
      <SiteHeader><Link className="header-link" href="/organizador/login"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao login</Link></SiteHeader>
      <main className="login-layout">
        <section className="surface login-card">
          <span className="login-icon"><Mail size={22} aria-hidden="true" /></span>
          <h1>Recuperar<br /><em>senha.</em></h1>
          <p className="muted">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
          {expired && <p className="form-error" role="alert">Esse link expirou ou já foi usado. Peça um novo abaixo.</p>}
          <RecoverForm />
        </section>
      </main>
    </>
  );
}
