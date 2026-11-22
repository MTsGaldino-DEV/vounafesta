import { ArrowLeft, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { organizerClient } from '@/lib/supabase';
import { LoginForm } from '../forms';

export const metadata = { title: 'Área do organizador', robots: { index: false, follow: false } };

export default async function LoginPage() {
  const supabase = await organizerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/organizador');
  }

  return (
    <>
      <SiteHeader><Link className="header-link" href="/"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao início</Link></SiteHeader>
      <main className="login-layout">
        <section className="surface login-card">
          <span className="login-icon"><LockKeyhole size={22} aria-hidden="true" /></span>
          <h1>Área do<br /><em>organizador.</em></h1>
          <p className="muted">Entre para criar eventos e acompanhar as confirmações.</p>
          <LoginForm configured={Boolean(supabase)} />
        </section>
      </main>
    </>
  );
}
