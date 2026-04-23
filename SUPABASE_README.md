# 🚀 Configuração do Supabase

Este guia explica como configurar e conectar o seu projeto ao **Supabase**.

## 🔑 Credenciais do Projeto

As chaves de acesso já foram configuradas no seu arquivo `.env`. As credenciais são:

- **URL do Projeto:** `https://gakammtsacohetzevdjt.supabase.co`
- **Chave Pública (Anon Key):** `sb_publishable_ZZiicl41ZULr6-D4zCRubA_PyNYVbFc`
- **String de Conexão com o Banco de Dados:** `postgresql://postgres:[YOUR-PASSWORD]@db.gakammtsacohetzevdjt.supabase.co:5432/postgres` *(substitua `[YOUR-PASSWORD]` pela senha do seu banco de dados)*

*(Se você estiver usando Next.js, as variáveis no `.env` já estão com o prefixo `NEXT_PUBLIC_` para serem acessíveis no frontend)*

---

## 🛠️ Como vincular seu projeto local ao Supabase

Siga os passos abaixo para conectar o ambiente local do seu projeto ao Supabase via CLI.

### 1. Instalar a CLI do Supabase (se ainda não tiver)

Se você utiliza **npm**:
```bash
npm install -g supabase
```

Ou se preferir usar **Homebrew** (macOS/Linux):
```bash
brew install supabase/tap/supabase
```

### 2. Fazer Login no Supabase

Autentique-se na sua conta do Supabase usando o comando abaixo. Isso abrirá o navegador para gerar um token de acesso:
```bash
supabase login
```

### 3. Inicializar o Supabase no Projeto

No diretório raiz do seu projeto, inicialize a configuração local do Supabase. Isso criará uma pasta `supabase/` na raiz:
```bash
supabase init
```

### 4. Vincular o Projeto Remoto

Agora, vincule o seu ambiente local ao projeto remoto no Supabase utilizando o ID do projeto fornecido:
```bash
supabase link --project-ref gakammtsacohetzevdjt
```

*(Durante este comando, pode ser solicitado que você insira a senha do banco de dados)*

---

## 🎉 Pronto!

Seu projeto agora está conectado ao Supabase. Você pode utilizar comandos como `supabase db pull` para sincronizar o schema atual do banco remoto ou usar o cliente Supabase no seu código conectando com as credenciais salvas no seu `.env`.
