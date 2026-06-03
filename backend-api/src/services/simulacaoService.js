const crypto = require('crypto')
const supabase = require('./supabase')

const simulacoesMemoria = []

const montarRegistro = (simulacao, contexto = {}) => ({
  usuario_id: contexto.usuario_id || null,
  valor_aporte: simulacao.entrada.valor_aporte,
  prazo_meses: simulacao.entrada.prazo_meses,
  perfil_risco: simulacao.entrada.perfil_risco,
  ano_referencia: simulacao.parametros.ano_referencia,
  selic_anualizada: simulacao.parametros.selic_anualizada,
  premio_risco: simulacao.parametros.premio_risco,
  taxa_anual_aplicada: simulacao.parametros.taxa_anual_aplicada,
  ipca_acumulado_referencia: simulacao.parametros.ipca_acumulado_referencia,
  aliquota_ir: simulacao.parametros.aliquota_ir,
  montante_bruto: simulacao.resultado.montante_bruto,
  montante_liquido: simulacao.resultado.montante_liquido,
  montante_real: simulacao.resultado.montante_real,
  ganho_nominal: simulacao.resultado.ganho_nominal,
  lucro_bruto: simulacao.resultado.lucro_bruto,
  lucro_real: simulacao.resultado.lucro_real,
  imposto_renda: simulacao.resultado.imposto_renda
})

const salvar = async (simulacao, contexto = {}) => {
  const registro = montarRegistro(simulacao, contexto)

  if (supabase) {
    const { data, error } = await supabase
      .from('simulacoes')
      .insert(registro)
      .select('*')
      .single()

    if (error) {
      const detalhes = error.details ? ` Detalhes: ${error.details}` : ''
      const dica = error.hint ? ` Dica: ${error.hint}` : ''
      throw new Error(`Erro ao salvar no Supabase: ${error.message}.${detalhes}${dica}`)
    }

    return data
  }

  const registroLocal = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...registro
  }
  simulacoesMemoria.push(registroLocal)
  return registroLocal
}

const listar = async () => {
  if (supabase) {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao listar simulações no Supabase: ${error.message}`)
    }

    return data
  }

  return [...simulacoesMemoria].reverse()
}


const listarPorUsuario = async (usuarioId) => {
  if (!usuarioId) throw new Error('ID do usuário é obrigatório para carregar o histórico.')

  if (supabase) {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao listar histórico do usuário no Supabase: ${error.message}`)
    }

    return data
  }

  return simulacoesMemoria
    .filter((item) => String(item.usuario_id) === String(usuarioId))
    .reverse()
}

const testarConexao = async () => {
  if (!supabase) {
    return {
      conectado: false,
      modo: 'memoria',
      mensagem: 'SUPABASE_URL e/ou SUPABASE_KEY não foram configuradas. A API está usando memória local.'
    }
  }

  const { error, count } = await supabase
    .from('simulacoes')
    .select('id', { count: 'exact', head: true })

  if (error) {
    return {
      conectado: false,
      modo: 'supabase_com_erro',
      mensagem: error.message,
      detalhes: error.details || null,
      dica: error.hint || null
    }
  }

  return {
    conectado: true,
    modo: 'supabase',
    tabela: 'simulacoes',
    total_simulacoes: count ?? 0,
    mensagem: 'Conexão com Supabase funcionando.'
  }
}

module.exports = {
  salvar,
  listar,
  listarPorUsuario,
  testarConexao
}
