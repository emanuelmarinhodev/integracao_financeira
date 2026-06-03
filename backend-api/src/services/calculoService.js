const investimentoService = require('./investimentoService')
const usuarioService = require('./usuarioService')

const PERFIS = {
  Conservador: 0,
  Moderado: 2,
  Agressivo: 5
}

const toNumber = (valor) => {
  if (typeof valor === 'number') return valor
  return Number(String(valor).replace(',', '.'))
}

const somentePeriodoProjeto = (indicadores) => indicadores
  .map((item) => ({
    data: item.data,
    selic: toNumber(item.selic),
    ipca: toNumber(item.ipca)
  }))
  .filter((item) => {
    const ano = new Date(item.data).getFullYear()
    return ano >= 2025 && ano <= 2026 && Number.isFinite(item.selic) && Number.isFinite(item.ipca)
  })

const calcularIndicadoresDerivados = () => {
  const indicadores = investimentoService.buscarIndicadores()
  if (indicadores.error) throw new Error(indicadores.error)

  const dados = somentePeriodoProjeto(indicadores)
  if (!dados.length) throw new Error('Não há indicadores válidos para 2025 e 2026')

  const porAno = dados.reduce((acc, item) => {
    const ano = new Date(item.data).getFullYear()
    acc[ano] = acc[ano] || []
    acc[ano].push(item)
    return acc
  }, {})

  const resumo_anual = Object.entries(porAno).map(([ano, itens]) => {
    const mediaSelicDiaria = itens.reduce((sum, item) => sum + item.selic, 0) / itens.length
    const selicAnualizada = (Math.pow(1 + mediaSelicDiaria / 100, 252) - 1) * 100

    const ipcaPorMes = new Map()
    itens.forEach((item) => {
      const data = new Date(item.data)
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
      ipcaPorMes.set(chave, item.ipca)
    })

    const ipcaAcumulado = [...ipcaPorMes.values()].reduce((acc, ipca) => acc * (1 + ipca / 100), 1) - 1
    const taxaReal = ((1 + selicAnualizada / 100) / (1 + ipcaAcumulado) - 1) * 100

    return {
      ano: Number(ano),
      media_selic_diaria: Number(mediaSelicDiaria.toFixed(4)),
      selic_anualizada: Number(selicAnualizada.toFixed(2)),
      ipca_acumulado: Number((ipcaAcumulado * 100).toFixed(2)),
      taxa_real_juros: Number(taxaReal.toFixed(2))
    }
  })

  const ultimoResumo = resumo_anual[resumo_anual.length - 1]

  return {
    periodo: '2025-2026',
    total_registros: dados.length,
    resumo_anual,
    referencia_simulacao: ultimoResumo
  }
}

const aliquotaIR = (prazoMeses) => {
  const dias = prazoMeses * 30
  if (dias <= 180) return 22.5
  if (dias <= 360) return 20
  if (dias <= 720) return 17.5
  return 15
}

const validarEntradaSimulacao = ({ valor_aporte, prazo_meses, perfil_risco }) => {
  if (!Number.isFinite(valor_aporte) || valor_aporte <= 0) {
    throw new Error('O valor do aporte deve ser maior que zero')
  }
  if (!Number.isFinite(prazo_meses) || prazo_meses <= 0) {
    throw new Error('O prazo deve ser maior que zero')
  }
  if (!Object.prototype.hasOwnProperty.call(PERFIS, perfil_risco)) {
    throw new Error('Perfil de risco inválido. Use Conservador, Moderado ou Agressivo')
  }
}

const simularInvestimento = (dadosEntrada) => {
  const entrada = {
    valor_aporte: Number(dadosEntrada.valor_aporte ?? dadosEntrada.valor_investimento ?? dadosEntrada.aporte),
    prazo_meses: Number(dadosEntrada.prazo_meses ?? dadosEntrada.prazo ?? 12),
    perfil_risco: dadosEntrada.perfil_risco ?? dadosEntrada.perfil ?? 'Conservador'
  }

  validarEntradaSimulacao(entrada)

  const indicadores = calcularIndicadoresDerivados()
  const referencia = indicadores.referencia_simulacao
  const premioRisco = PERFIS[entrada.perfil_risco]
  const taxaAnualAplicada = referencia.selic_anualizada + premioRisco
  const prazoAnos = entrada.prazo_meses / 12
  const montanteBruto = entrada.valor_aporte * Math.pow(1 + taxaAnualAplicada / 100, prazoAnos)
  const ganhoBruto = montanteBruto - entrada.valor_aporte
  const aliquota = aliquotaIR(entrada.prazo_meses)
  const impostoRenda = ganhoBruto * (aliquota / 100)
  const montanteLiquido = montanteBruto - impostoRenda
  const inflacaoPeriodo = Math.pow(1 + referencia.ipca_acumulado / 100, prazoAnos) - 1
  const montanteReal = montanteLiquido / (1 + inflacaoPeriodo)
  const ganhoReal = montanteReal - entrada.valor_aporte

  return {
    entrada,
    parametros: {
      ano_referencia: referencia.ano,
      selic_anualizada: referencia.selic_anualizada,
      premio_risco: premioRisco,
      taxa_anual_aplicada: Number(taxaAnualAplicada.toFixed(2)),
      ipca_acumulado_referencia: referencia.ipca_acumulado,
      aliquota_ir: aliquota
    },
    resultado: {
      montante_bruto: Number(montanteBruto.toFixed(2)),
      montante_liquido: Number(montanteLiquido.toFixed(2)),
      montante_real: Number(montanteReal.toFixed(2)),
      ganho_nominal: Number(ganhoBruto.toFixed(2)),
      lucro_bruto: Number(ganhoBruto.toFixed(2)),
      lucro_real: Number(ganhoReal.toFixed(2)),
      imposto_renda: Number(impostoRenda.toFixed(2))
    },
    recomendacao: entrada.perfil_risco === 'Conservador'
      ? 'Perfil conservador: simulação baseada em 100% da Selic.'
      : `Perfil ${entrada.perfil_risco.toLowerCase()}: simulação com prêmio de risco de ${premioRisco}% ao ano.`
  }
}

const calcularProjecao = async (usuarioId) => {
  const usuarios = await usuarioService.buscarTodos()
  const usuario = usuarios.find((item) => String(item.id) === String(usuarioId))

  if (!usuario) throw new Error('Usuário não encontrado')

  return {
    usuario: usuario.nome,
    ...simularInvestimento({
      valor_aporte: usuario.valor_investimento,
      prazo_meses: usuario.prazo_meses || 12,
      perfil_risco: usuario.perfil_risco
    })
  }
}

module.exports = {
  calcularProjecao,
  calcularIndicadoresDerivados,
  simularInvestimento
}
