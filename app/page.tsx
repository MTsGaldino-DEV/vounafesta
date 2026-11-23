import { ArrowRight, CalendarHeart, Download, EyeOff, Link2, Palette, Smartphone, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { demoSlug } from '@/lib/invitation';
import cover from '@/public/tema/moana.webp';
import { SiteHeader } from './components/site-header';

const signupHref = '/organizador/login';

const steps = [
  { icon: CalendarHeart, title: 'Crie o evento', text: 'Nome, data, local, foto e cor. Em poucos minutos o convite está pronto.' },
  { icon: Link2, title: 'Envie o link', text: 'Um endereço só seu, para mandar no WhatsApp, e-mail ou onde quiser.' },
  { icon: UsersRound, title: 'Acompanhe as respostas', text: 'Veja no painel quem confirmou e quantos acompanhantes vêm com cada pessoa.' },
];

const perks = [
  { icon: Smartphone, title: 'Sem cadastro para o convidado', text: 'Quem recebe o convite confirma direto no celular, sem baixar app nem criar conta.' },
  { icon: Palette, title: 'Com a cara da sua festa', text: 'Suba a sua foto e escolha a cor dos destaques. Cada convite é diferente do outro.' },
  { icon: UsersRound, title: 'Acompanhantes com nome', text: 'Cada convidado informa quem vai junto, e você sabe exatamente quem esperar.' },
  { icon: EyeOff, title: 'Privacidade de verdade', text: 'Só quem organiza vê os nomes enviados. Um convidado nunca vê a lista dos outros.' },
  { icon: Download, title: 'Lista pronta para usar', text: 'Exporte as confirmações em CSV e abra direto no Excel para montar a portaria ou o buffet.' },
];

export default function HomePage() {
  return (
    <div className="landing-page">
      <SiteHeader>
        <nav className="landing-nav" aria-label="Principal">
          <a className="landing-link" href="#como-funciona">Como funciona</a>
          <a className="landing-link" href="#diferenciais">Diferenciais</a>
          <Link className="header-link" href="/organizador/login">Entrar</Link>
        </nav>
      </SiteHeader>
      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="invite-tag">Convites e confirmação de presença</p>
            <h1>Sua festa começa<br />com um <em>convite bonito.</em></h1>
            <p className="landing-lead">Crie o convite do seu evento, envie um link e saiba quem vai, com quantos acompanhantes. Sem planilha, sem mensagem perdida no grupo.</p>
            <div className="landing-actions">
              <Link className="button button-primary" href={signupHref}>Criar meu evento <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="button button-secondary" href={`/convite/${demoSlug}`}>Ver convite de exemplo</Link>
            </div>
          </div>
          <div className="landing-hero-art">
            <Image src={cover} alt="Exemplo de convite do Vou na Festa" preload sizes="(max-width: 860px) 100vw, 480px" />
          </div>
        </section>

        <section className="landing-section" id="como-funciona">
          <h2>Como funciona</h2>
          <ol className="landing-grid">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li className="surface landing-card" key={title}>
                <span className="event-icon"><Icon size={20} aria-hidden="true" /></span>
                <h3><span className="landing-step">{index + 1}.</span> {title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-section" id="diferenciais">
          <h2>Por que usar o Vou na Festa</h2>
          <ul className="landing-grid">
            {perks.map(({ icon: Icon, title, text }) => (
              <li className="surface landing-card" key={title}>
                <span className="event-icon"><Icon size={20} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-cta">
          <h2>Pronto para <em>convidar?</em></h2>
          <p>Crie seu primeiro evento e compartilhe o convite hoje mesmo.</p>
          <Link className="button button-primary" href={signupHref}>Criar meu evento <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Vou na Festa</p>
        <Link href="/organizador/login">Área do organizador</Link>
      </footer>
    </div>
  );
}
