# Vou na Festa

O organizador entra com e-mail e senha, cria um evento e compartilha o link do convite. Os convidados confirmam presença com seu nome e os nomes dos acompanhantes. O painel do evento reúne as respostas e fica disponível apenas para quem o criou.

## Rodar localmente

Use Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

Abra `http://localhost:3000`. A página inicial tem um convite de exemplo que pode ser preenchido sem configurar o banco. As respostas do exemplo não são salvas.

## Conectar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/dashboard). No **SQL Editor**, execute, nesta ordem, a [migração inicial](supabase/migrations/20261122000000_initial.sql) e a de [edição e exclusão de eventos](supabase/migrations/20261122000001_manage_events.sql).
2. Em **Authentication → Users**, crie um usuário com e-mail e senha e confirme o e-mail da conta. Na configuração de Auth, desative novos cadastros públicos se quiser manter as contas administradas pelo painel. [Configuração do Supabase Auth](https://supabase.com/docs/guides/auth/general-configuration).
3. Para rodar localmente, copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a URL e a chave **publishable** do projeto. Reinicie o servidor local após salvar. [Documentação sobre chaves do Supabase](https://supabase.com/docs/guides/getting-started/api-keys).
4. Para a recuperação de senha, em **Authentication → URL Configuration** cadastre em **Redirect URLs** `http://localhost:3000/organizador/auth/confirmar` e a mesma rota no domínio publicado (ex. `https://seu-app.vercel.app/organizador/auth/confirmar`).
5. Entre em `/organizador/login`, crie um evento e use **Copiar link** para enviar o convite. No painel do evento é possível editar, excluir e exportar as confirmações em CSV (separador `;`, abre direto no Excel).

## Publicar na Vercel

Importe o repositório como um projeto Next.js e adicione as duas variáveis do Supabase em **Settings → Environment Variables**. Faça o deploy e teste uma confirmação no link publicado. Se alterar as variáveis depois, faça um novo deploy. [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) · [Variáveis de ambiente](https://vercel.com/docs/environment-variables).

## Verificar

```sh
npm test
npm run build
```

O teste usa Postgres local em memória para verificar as permissões da migração, a separação dos eventos por proprietário e a proteção contra reenvios da mesma confirmação.
