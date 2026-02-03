# Cassio Barbearia - Agendamento Online

Sistema de agendamento online desenvolvido com Vite + React + TypeScript + Tailwind CSS + Supabase.

## 🚀 Como Rodar Localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um projeto no [Supabase](https://supabase.com).
4. Crie a tabela de agendamentos SQL (veja abaixo).
5. Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua-url-do-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```
6. Rode o servidor de dev:
   ```bash
   npm run dev
   ```

## 🗄️ Esquema do Banco de Dados (Supabase)

Rode este script no SQL Editor do Supabase para criar a tabela necessária:

```sql
-- Crie a tabela de agendamentos
create table appointments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  service_id text not null,
  date timestamp with time zone not null
);

-- Habilita segurança RLS
alter table appointments enable row level security;

-- Permite leitura pública (necessário para verificar horários ocupados)
create policy "Public Read" on appointments for select using (true);

-- Permite inserção pública (para criar agendamentos)
create policy "Public Insert" on appointments for insert with check (true);
```

## 🌐 Deploy na Vercel

1. Suba este código para o GitHub.
2. Importe o projeto na Vercel.
3. Nas configurações do projeto na Vercel, adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 🛠️ Tecnologias

- **Frontend**: React, Vite, TypeScript
- **Estilização**: Tailwind CSS, Lucide Icons
- **Backend / DB**: Supabase
- **Utils**: date-fns
