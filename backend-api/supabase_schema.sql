-- ============================================================
-- PROJETO: API de Simulação de Investimentos
-- BANCO: Supabase / PostgreSQL
-- Execute este script no SQL Editor do Supabase.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove versões antigas das tabelas do projeto.
-- Se você já tiver dados importantes, exporte antes.
DROP TABLE IF EXISTS public.simulacoes CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.cache_banco_central CASCADE;
DROP TABLE IF EXISTS public.indicadores_resumo CASCADE;
DROP TABLE IF EXISTS public.indicadores_economicos CASCADE;

-- ============================================================
-- 0. Usuários da tela de cadastro/login
-- Armazena as contas usadas para acessar o front-end.
-- ============================================================
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT,
  perfil_risco TEXT CHECK (perfil_risco IS NULL OR perfil_risco IN ('Conservador', 'Moderado', 'Agressivo')),
  valor_investimento NUMERIC(14, 2),
  prazo_meses INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON public.usuarios (email);

-- ============================================================
-- 1. Dados tratados da Selic e IPCA
-- ============================================================
CREATE TABLE public.indicadores_economicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_indicador TEXT NOT NULL CHECK (tipo_indicador IN ('SELIC', 'IPCA')),
  data_referencia DATE NOT NULL,
  valor NUMERIC(12, 4) NOT NULL,
  ano INTEGER NOT NULL CHECK (ano IN (2025, 2026)),
  fonte TEXT NOT NULL DEFAULT 'Banco Central do Brasil',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tipo_indicador, data_referencia)
);

-- ============================================================
-- 2. Resumo anual dos indicadores derivados
-- ============================================================
CREATE TABLE public.indicadores_resumo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ano INTEGER NOT NULL UNIQUE CHECK (ano IN (2025, 2026)),
  selic_media_anual NUMERIC(12, 4) NOT NULL,
  ipca_acumulado NUMERIC(12, 4) NOT NULL,
  taxa_real_juros NUMERIC(12, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Cache dos dados do Banco Central
-- ============================================================
CREATE TABLE public.cache_banco_central (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serie TEXT NOT NULL CHECK (serie IN ('SELIC', 'IPCA')),
  ano INTEGER NOT NULL CHECK (ano IN (2025, 2026)),
  dados JSONB NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (serie, ano)
);

-- ============================================================
-- 4. Histórico de simulações realizadas pelo front/API
-- Esta tabela bate exatamente com o insert feito pelo Node.js.
-- ============================================================
CREATE TABLE public.simulacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,

  valor_aporte NUMERIC(14, 2) NOT NULL CHECK (valor_aporte > 0),
  prazo_meses INTEGER NOT NULL CHECK (prazo_meses > 0),
  perfil_risco TEXT NOT NULL CHECK (perfil_risco IN ('Conservador', 'Moderado', 'Agressivo')),

  ano_referencia INTEGER,
  selic_anualizada NUMERIC(12, 4),
  premio_risco NUMERIC(12, 4),
  taxa_anual_aplicada NUMERIC(12, 4),
  ipca_acumulado_referencia NUMERIC(12, 4),
  aliquota_ir NUMERIC(6, 2),

  montante_bruto NUMERIC(14, 2) NOT NULL,
  montante_liquido NUMERIC(14, 2) NOT NULL,
  montante_real NUMERIC(14, 2) NOT NULL,
  ganho_nominal NUMERIC(14, 2) NOT NULL,
  lucro_bruto NUMERIC(14, 2) NOT NULL,
  lucro_real NUMERIC(14, 2) NOT NULL,
  imposto_renda NUMERIC(14, 2) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_simulacoes_created_at ON public.simulacoes (created_at DESC);
CREATE INDEX idx_simulacoes_usuario_id ON public.simulacoes (usuario_id);
CREATE INDEX idx_simulacoes_perfil_risco ON public.simulacoes (perfil_risco);

-- ============================================================
-- 5. Row Level Security + políticas abertas para teste acadêmico
-- ============================================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicadores_economicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicadores_resumo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_banco_central ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso publico usuarios"
ON public.usuarios
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Acesso publico indicadores economicos"
ON public.indicadores_economicos
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Acesso publico indicadores resumo"
ON public.indicadores_resumo
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Acesso publico cache banco central"
ON public.cache_banco_central
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Acesso publico simulacoes"
ON public.simulacoes
FOR ALL
USING (true)
WITH CHECK (true);

-- Dados iniciais apenas para teste/visualização no Supabase.
INSERT INTO public.indicadores_resumo (ano, selic_media_anual, ipca_acumulado, taxa_real_juros)
VALUES
  (2025, 14.8100, 5.2000, 9.1341),
  (2026, 13.7500, 4.8000, 8.5401)
ON CONFLICT (ano) DO NOTHING;
