# Paggo OCR Frontend

Este é o frontend do **Paggo OCR**, uma aplicação que permite o upload, análise e gerenciamento de documentos utilizando OCR (Reconhecimento Óptico de Caracteres). A aplicação é construída com **Next.js**, **TypeScript** e integra autenticação via **NextAuth** com o Google.

## Índice

- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Deploy](#Deploy)

---

## Recursos

- **Autenticação**: Login e logout via Google OAuth usando NextAuth.
- **Upload de Documentos**: Upload de imagens (JPG/PNG ≤ 5MB) para análise OCR.
- **Gerenciamento de Documentos**: Listagem, pesquisa e download de documentos em PDF.
- **Chat de Explicação**: Interação com os documentos para obter explicações detalhadas.
- **Interface Responsiva**: Design responsivo e moderno com Tailwind CSS.
- **Feedback ao Usuário**: Notificações de sucesso e erro com `react-hot-toast`.

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Google OAuth Credentials** (Client ID e Client Secret)

---

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/FellipeMiguel/next-paggo.git
   cd next-paggo
   ```

2. Instale as dependências

   ```bash
   npm install
   ```

## Configuração

1. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis de ambiente:

   ```env
   GOOGLE_CLIENT_ID=seu-google-client-id
   GOOGLE_CLIENT_SECRET=seu-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=sua-chave-secreta
   NEXT_PUBLIC_API_URL=url-da-api
   ```

2. Certifique-se de que o backend do OCR esteja rodando e configurado para aceitar requisições do frontend.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador em http://localhost:3000.

---

## Estrutura do Projeto

```plaintext
.
├── [.env.local](http://_vscodecontentref_/1)               # Arquivo de variáveis de ambiente (não incluído no repositório)
├── src/
│   ├── app/
│   │   ├── api/             # Rotas da API (Next.js)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── dashboard/       # Página do dashboard
│   │   ├── layout.tsx       # Layout principal da aplicação
│   │   ├── page.tsx         # Página inicial
│   │   ├── globals.css      # Estilos globais
│   ├── config/              # Configurações do projeto
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Lógica de autenticação e utilitários
│   ├── types/               # Tipos TypeScript
├── public/                  # Arquivos estáticos
├── .gitignore               # Arquivos ignorados pelo Git
├── [package.json](http://_vscodecontentref_/2)             # Dependências e scripts do projeto
├── [tsconfig.json](http://_vscodecontentref_/3)            # Configuração do TypeScript
├── next.config.js           # Configuração do Next.js
└── [README.md](http://_vscodecontentref_/4)                # Documentação do projeto
```

---

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no servidor e geração de páginas estáticas.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **NextAuth**: Biblioteca para autenticação com suporte a OAuth 2.0 e OpenID Connect.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Axios**: Cliente HTTP para realizar requisições à API.
- **Framer Motion**: Biblioteca para animações e transições em React.
- **react-hot-toast**: Biblioteca para exibição de notificações de feedback ao usuário.
- **react-spinners**: Componentes de carregamento visual para melhorar a experiência do usuário.

## Deploy

Acesse o protótipo em [https://pagguinho.vercel.app/](https://pagguinho.vercel.app/)
