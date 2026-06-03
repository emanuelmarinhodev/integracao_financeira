# Como rodar o projeto

## 1. Rodar o back-end

```bash
cd backend-api
npm install
npm start
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Endpoints principais:

```txt
GET  /api/indicadores
GET  /api/indicadores/resumo
POST /api/simulacao
```

Exemplo de simulação:

```bash
curl -X POST http://localhost:3000/api/simulacao \
  -H 'Content-Type: application/json' \
  -d '{"valor_aporte":5000,"prazo_meses":12,"perfil_risco":"Moderado"}'
```

## 2. Rodar o front-end

Em outro terminal:

```bash
cd frontend-web/facilitador-financeiro
npm install
npm run dev
```

Acesse o endereço mostrado pelo Vite, normalmente:

```txt
http://localhost:5173
```

## 3. Configurar URL da API no front-end

Por padrão, o front usa:

```txt
http://localhost:3000/api
```

Se precisar alterar, crie um arquivo `.env` dentro de `frontend-web/facilitador-financeiro`:

```env
VITE_API_URL=http://localhost:3000/api
```
