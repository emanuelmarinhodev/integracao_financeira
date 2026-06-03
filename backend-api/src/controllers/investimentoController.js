const investimentosService = require('../services/investimentoService')
const calculoService = require('../services/calculoService')
const simulacaoService = require('../services/simulacaoService')

const getIndicadores = (req, res) => {
  const dados = investimentosService.buscarIndicadores()

  if (dados.error) {
    return res.status(404).json({ message: dados.error })
  }

  res.json(dados)
}

const getResumoIndicadores = (req, res) => {
  try {
    res.json(calculoService.calcularIndicadoresDerivados())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const simular = async (req, res) => {
  try {
    const resultado = calculoService.simularInvestimento(req.body)
    const registro = await simulacaoService.salvar(resultado, { usuario_id: req.body.usuario_id })

    res.status(201).json({
      ...resultado,
      persistencia: {
        salvo: true,
        id: registro.id,
        created_at: registro.created_at
      }
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const listarSimulacoes = async (req, res) => {
  try {
    const simulacoes = await simulacaoService.listar()
    res.json(simulacoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getStatusSupabase = async (req, res) => {
  try {
    const status = await simulacaoService.testarConexao()
    res.status(status.conectado ? 200 : 500).json(status)
  } catch (error) {
    res.status(500).json({ conectado: false, error: error.message })
  }
}

const calcular = async (req, res) => {
  const { id } = req.params

  try {
    const resultado = await calculoService.calcularProjecao(id)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getIndicadores,
  getResumoIndicadores,
  simular,
  listarSimulacoes,
  getStatusSupabase,
  calcular
}
