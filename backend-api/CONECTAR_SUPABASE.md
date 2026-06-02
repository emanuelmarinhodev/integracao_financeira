# Como conectar o projeto ao Supabase

## 1. Criar o projeto no Supabase

1. Entre no Supabase.
2. Crie um novo projeto.
3. Abra **Project Settings > API Keys**.
4. Copie:
   - `Project URL`
   - `anon key` ou `service_role key`

Para teste acadêmico local, a `anon key` funciona se as políticas SQL deste projeto forem executadas.

## 2. Criar as tabelas

No Supabase, abra **SQL Editor > New Query**.
Cole o conteúdo do arquivo:

```txt
backend-api/supabase_schema.sql
```

Depois clique em **Run**.

## 3. Configurar o `.env`

Na pasta `backend-api`, crie um arquivo chamado `.env` baseado no `.env.example`:

```env
PORT=3000
SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
SUPABASE_KEY=SUA_CHAVE_DO_SUPABASE
```

## 4. Rodar o back-end

```bash
cd backend-api
npm install
npm start
```

## 5. Testar conexão

Cadastro de usuário:

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","perfil_risco":"Moderado","valor_investimento":5000,"prazo_meses":12}'
```

Listar usuários:

```bash
curl http://localhost:3000/api/usuarios
```

Criar simulação salva no Supabase:

```bash
curl -X POST http://localhost:3000/api/simulacao \
  -H "Content-Type: application/json" \
  -d '{"valor_aporte":5000,"prazo_meses":12,"perfil_risco":"Moderado"}'
```

Listar simulações salvas:

```bash
curl http://localhost:3000/api/simulacoes
```

## Observação importante

Os indicadores econômicos continuam vindo do JSON tratado pela camada Python. O Supabase está sendo usado para persistir usuários e histórico de simulações.
