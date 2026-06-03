const authService = require('../services/authService')
const simulacaoService = require('../services/simulacaoService')

const cadastrar = async (req, res) => {
  try {
    const usuario = await authService.cadastrar(req.body)
    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso.',
      usuario
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const usuario = await authService.login(req.body)
    res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

const buscarPerfil = async (req, res) => {
  try {
    const usuario = await authService.buscarPorId(req.params.id)
    res.json(usuario)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const atualizarPerfil = async (req, res) => {
  try {
    const usuario = await authService.atualizarPerfil(req.params.id, req.body)
    res.json({
      mensagem: 'Perfil atualizado com sucesso.',
      usuario
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const listarHistorico = async (req, res) => {
  try {
    const simulacoes = await simulacaoService.listarPorUsuario(req.params.id)
    res.json(simulacoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  cadastrar,
  login,
  buscarPerfil,
  atualizarPerfil,
  listarHistorico
}
