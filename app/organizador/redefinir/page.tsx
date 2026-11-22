import { KeyRound } from 'lucide-react';
import { SiteHeader } from '@/app/components/site-header';
import { requireOrganizer } from '@/lib/organizer';
import { ResetPasswordForm } from '../forms';

export const metadata = { title: 'Nova senha', robots: { index: false, follow: false } };

export default async function ResetPasswordPage() {
  await requireOrganizer();
  return (
    <>
      <SiteHeader><span /></SiteHeader>
      <main className="login-layout">
        <section className="surface login-card">
          <span className="login-icon"><KeyRound size={22} aria-hidden="true" /></span>
          <h1>Nova<br /><em>senha.</em></h1>
          <p className="muted">Escolha uma senha com pelo menos 8 caracteres.</p>
          <ResetPasswordForm />
        </section>
      </main>
    </>
  );
}
