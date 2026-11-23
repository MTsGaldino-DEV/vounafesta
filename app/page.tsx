import {
  ArrowRight, CalendarHeart, Download, EyeOff, Link2, PenLine, Palette, Smartphone, Sparkles, UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { demoSlug } from '@/lib/invitation';
import cover from '@/public/tema/moana.webp';
import { SiteHeader } from './components/site-header';

const signupHref = '/organizador/login';

const occasions = ['Aniversário', 'Festa infantil', 'Chá de bebê', 'Chá revelação', 'Casamento', 'Festa de 15 anos', 'Formatura', 'Evento corporativo'];

const perks = [
  { icon: Smartphone, title: 'Sem app e sem cadastro', text: 'O convidado abre o link no celular, confirma em segundos e pronto. Nada para baixar, nenhuma conta para criar.' },
  { icon: Palette, title: 'Com a cara da sua festa', text: 'Suba a sua foto e escolha a cor dos destaques. Cada convite fica diferente do outro.' },
  { icon: UsersRound, title: 'Acompanhantes com nome', text: 'Cada convidado informa quem vai junto, e você sabe exatamente quem esperar.' },
  { icon: EyeOff, title: 'Privacidade de verdade', text: 'Só quem organiza vê os nomes enviados. Um convidado nunca vê a lista dos outros.' },
  { icon: Download, title: 'Lista pronta para usar', text: 'Exporte as confirmações em CSV e abra direto no Excel para montar a portaria ou o buffet.' },
  { icon: PenLine, title: 'Você no controle', text: 'Mudou o horário ou o local? Edite o evento quando quiser e apague respostas de teste com um clique.' },
];

const steps = [
  { title: 'Crie o evento', text: 'Informe nome, data, local, foto e cor. Em poucos minutos o convite está pronto.' },
  { title: 'Envie o link', text: 'Cada evento tem um endereço só seu. Copie e mande no WhatsApp, por e-mail ou onde quiser.' },
  { title: 'Os convidados confirmam', text: 'Eles informam o próprio nome e o de quem vai junto, direto pelo celular.' },
  { title: 'Acompanhe e exporte', text: 'Veja no painel quem confirmou e baixe a lista em CSV para usar na portaria ou com o buffet.' },
];

const faq = [
  { q: 'O convidado precisa baixar um aplicativo ou criar conta?', a: 'Não. O convite é um link que abre no navegador do celular. O convidado toca em confirmar presença, informa os acompanhantes e pronto.' },
  { q: 'Quem vê os nomes de quem confirmou?', a: 'Só quem organiza o evento. Os convidados não veem as respostas uns dos outros.' },
  { q: 'Posso personalizar o convite?', a: 'Sim. Você escolhe a foto da capa e a cor dos destaques. Sem foto, o convite usa uma arte padrão.' },
  { q: 'Dá para levar a lista de confirmados para o Excel?', a: 'Dá. O painel exporta as confirmações em CSV, que abre direto no Excel e em outras planilhas.' },
  { q: 'Serve para quais tipos de evento?', a: 'Para qualquer festa ou encontro em que você precise saber quem vai: aniversários, chás, casamentos, formaturas e eventos corporativos.' },
];

export default function HomePage() {
  return (
    <div className="landing-page">
      <SiteHeader>
        <nav className="landing-nav" aria-label="Principal">
          <a className="landing-link" href="#diferenciais">Diferenciais</a>
          <a className="landing-link" href="#como-funciona">Como funciona</a>
          <a className="landing-link" href="#perguntas">Perguntas</a>
          <Link className="button button-primary landing-login" href="/organizador/login">Entrar <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
      </SiteHeader>
      <main>
        <section className="landing-hero">
          <p className="landing-pill"><Sparkles size={15} aria-hidden="true" /> Confirmação de presença pelo link, sem app</p>
          <h1>Crie o convite da sua festa <span className="text-gradient">em poucos minutos</span></h1>
          <p className="landing-lead">Envie um link, receba as confirmações e saiba quem vai, com quantos acompanhantes. Sem planilha e sem mensagem perdida no grupo.</p>
          <div className="landing-actions">
            <Link className="button button-primary" href={signupHref}>Criar meu evento <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="button button-secondary" href={`/convite/${demoSlug}`}>Ver convite de exemplo</Link>
            <a className="button button-secondary" href="#como-funciona">Como funciona</a>
          </div>
        </section>

        <section className="landing-band">
          <div className="landing-inner">
            <h2>Para qualquer tipo de evento</h2>
            <p className="landing-sub">Você dá o nome ao evento e o convite se adapta. É só personalizar.</p>
            <ul className="landing-chips">
              {occasions.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </div>
        </section>

        <section className="landing-section" id="diferenciais">
          <h2>Muito além de uma lista de nomes</h2>
          <p className="landing-sub">Tudo o que você precisa para receber as respostas e organizar a festa.</p>
          <ul className="landing-grid">
            {perks.map(({ icon: Icon, title, text }) => (
              <li className="surface landing-card" key={title}>
                <span className="landing-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-section landing-preview">
          <div className="landing-preview-art">
            <Image src={cover} alt="Exemplo de convite do Vou na Festa" sizes="(max-width: 860px) 100vw, 420px" />
          </div>
          <div>
            <h2>Veja como o seu convidado vai receber</h2>
            <p className="landing-sub">Um convite bonito, com a foto da festa e um botão grande de confirmar presença. Teste o convite de exemplo e preencha como se fosse um convidado.</p>
            <Link className="button button-primary" href={`/convite/${demoSlug}`}>Abrir convite de exemplo <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="landing-band" id="como-funciona">
          <div className="landing-inner landing-narrow">
            <h2>Como funciona</h2>
            <p className="landing-sub">Do cadastro ao dia da festa em 4 passos.</p>
            <ol className="landing-steps">
              {steps.map(({ title, text }, index) => (
                <li key={title}>
                  <span className="landing-number" aria-hidden="true">{index + 1}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section landing-narrow" id="perguntas">
          <h2>Perguntas frequentes</h2>
          <div className="landing-faq">
            {faq.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <CalendarHeart size={34} aria-hidden="true" />
          <h2>Pronto para organizar sua festa?</h2>
          <p>Crie seu primeiro evento e compartilhe o convite hoje mesmo.</p>
          <Link className="button landing-cta-button" href={signupHref}>Criar meu evento <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="brand"><span className="brand-icon"><Link2 size={19} aria-hidden="true" /></span><span>vou na festa<span className="brand-dot">.</span></span></span>
          <nav aria-label="Rodapé">
            <a href="#diferenciais">Diferenciais</a>
            <a href="#como-funciona">Como funciona</a>
            <Link href={`/convite/${demoSlug}`}>Convite de exemplo</Link>
            <Link href="/organizador/login">Entrar</Link>
          </nav>
        </div>
        <p>© {new Date().getFullYear()} Vou na Festa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
