## Wesley Maia — Portfólio

Portfólio profissional, desenvolvido como uma aplicação completa, administrável e preparada para evolução contínua.

O projeto reúne apresentação profissional, experiências, serviços, projetos, certificações e contato, acessível e otimizada para mecanismos de busca.

## Visão geral

- Painel administrativo protegido
- Gerenciamento de perfil, experiências, projetos e certificações
- Formulário de contato com validação e proteção contra spam
- Aplicação instalável como **PWA**
- SEO técnico e metadados sociais
- Controle de consentimento para Analytics
- Estrutura preparada para integração da **Wesley AI**
- Layout responsivo e suporte a redução de movimentos

## Tecnologias

### Front-end

- Next.js 16
- React
- TypeScript
- Tailwind CSS 4
- Framer Motion
- next-intl
- React Hook Form
- Zod

### Back-end e dados

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security
- Server Components
- Server Actions

### Qualidade e infraestrutura

- Vitest
- React Testing Library
- Playwright
- ESLint
- Vercel Analytics
- Cloudflare Turnstile
- pnpm
- Vercel

## Funcionalidades

### Área pública

- Apresentação profissional
- Perfil e resumo
- Experiências
- Serviços
- Projetos
- Certificações
- Contato
- Download do currículo
- Alternância entre português e inglês
- Política de privacidade e preferências de cookies

### Painel administrativo

- Autenticação restrita
- Gerenciamento do perfil
- Cadastro e edição de experiências
- Cadastro e edição de projetos
- Cadastro e edição de certificações
- Upload de imagem profissional
- Upload de currículo
- Controle de publicação dos conteúdos
- Controle de conteúdos disponíveis para a futura assistente

## Segurança

A aplicação utiliza diferentes camadas de proteção:

- Row Level Security no banco de dados
- Controle de acesso administrativo por e-mail autorizado
- Validação de dados no cliente e no servidor
- Proteção contra spam com Cloudflare Turnstile
- Rate limiting no formulário de contato
- Arquivos privados com URLs assinadas
- Cabeçalhos de segurança
- Bloqueio de indexação da área administrativa
- Chaves sensíveis restritas ao servidor

## Armazenamento

O Supabase Storage é utilizado para:

- Imagens de perfil e identidade visual
- Capas de projetos
- Currículo em PDF
- Certificados privados

Vídeos são vinculados por URL externa, evitando armazenamento desnecessário na aplicação.

## Internacionalização

O projeto utiliza `next-intl` para oferecer conteúdo em:

- `pt-BR`
- `en`

A versão em português é a principal, com rotas e conteúdos adaptados para cada idioma.

## Estrutura principal

```text
src/
├── app/
│   ├── (site)/[locale]/
│   ├── (admin)/admin/
│   └── api/
├── components/
├── i18n/
├── lib/
└── messages/

supabase/
└── migrations/

e2e/