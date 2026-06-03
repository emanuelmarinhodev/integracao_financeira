# Testes realizados

## Front-end

Diretório: `frontend-web/facilitador-financeiro`

```bash
npm install --no-audit --no-fund
npm run build
npm run lint
```

Resultado:

- Build de produção gerado com sucesso pelo Vite.
- Lint executado sem erros após inclusão do `eslint.config.js`.

## Back-end

Diretório: `backend-api`

```bash
npm install --no-audit --no-fund
npm start
curl http://localhost:3000/
curl http://localhost:3000/api/indicadores/resumo
curl -X POST http://localhost:3000/api/simulacao \
  -H 'Content-Type: application/json' \
  -d '{"valor_aporte":5000,"prazo_meses":12,"perfil_risco":"Moderado"}'
```

Resultado:

- API iniciou com sucesso na porta 3000.
- Endpoint `/api/indicadores/resumo` retornou indicadores derivados de 2025 e 2026.
- Endpoint `/api/simulacao` retornou JSON estruturado com montante bruto, montante líquido, montante real, ganho nominal, lucro bruto, lucro real e imposto de renda.
- Validação testada: aporte negativo retorna erro HTTP 400.

## Observação importante

O projeto original dependia de `SUPABASE_URL` e `SUPABASE_KEY` para iniciar a API. Foi criado um fallback em memória para o back-end funcionar em ambiente local mesmo sem Supabase configurado. Se as variáveis existirem, o Supabase continua sendo utilizado normalmente.
