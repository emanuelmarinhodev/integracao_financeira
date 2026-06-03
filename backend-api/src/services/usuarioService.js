const crypto = require('crypto')
const supabase = require('./supabase')

const usuariosMemoria = []

const normalizarUsuario = (dados) => ({
  nome: String(dados.nome || '').trim(),
  email: dados.email ? String(dados.email).trim() : null,
  perfil_risco: String(dados.perfil_risco || dados.perfil || '').trim(),
  valor_investimento: Number(dados.valor_investimento ?? dados.valor_aporte ?? dados.aporte),
  prazo_meses: Number(dados.prazo_meses ?? dados.prazo ?? 12)
})

const validarUsuario = (usuario) => {
  const perfisValidos = ['Conservador', 'Moderado', 'Agressivo']

  if (!usuario.nome) throw new Error('Nome é obrigatório')
  if (!perfisValidos.includes(usuario.perfil_risco)) throw new Error('Perfil de risco inválido')
  if (!Number.isFinite(usuario.valor_investimento) || usuario.valor_investimento <= 0) {
    throw new Error('Valor de investimento deve ser maior que zero')
  }
  if (!Number.isFinite(usuario.prazo_meses) || usuario.prazo_meses <= 0) {
    throw new Error('Prazo deve ser maior que zero')
  }
}

const usuarioService = {
  async criar(dados) {
    const usuario = normalizarUsuario(dados)
    validarUsuario(usuario)

    if (supabase) {
      const { data, error } = await supabase.from('usuarios').insert([usuario]).select()
      if (error) throw error
      return data[0]
    }

    const novoUsuario = {
      id: crypto.randomUUID(),
      criado_em: new Date().toISOString(),
      ...usuario
    }
    usuariosMemoria.push(novoUsuario)
    return novoUsuario
  },

  async buscarTodos() {
    if (supabase) {
      const { data, error } = await supabase.from('usuarios').select('*')
      if (error) throw error
      return data
    }

    return usuariosMemoria
  },

  async atualizar(id, dados) {
    const usuario = normalizarUsuario(dados)
    validarUsuario(usuario)

    if (supabase) {
      const { data, error } = await supabase.from('usuarios').update(usuario).eq('id', id).select()
      if (error) throw error
      return data[0]
    }

    const index = usuariosMemoria.findIndex((item) => item.id === id)
    if (index === -1) return null
    usuariosMemoria[index] = { ...usuariosMemoria[index], ...usuario }
    return usuariosMemoria[index]
  },

  async remover(id) {
    if (supabase) {
      const { error } = await supabase.from('usuarios').delete().eq('id', id)
      if (error) throw error
      return { message: 'Usuário removido com sucesso' }
    }

    const index = usuariosMemoria.findIndex((item) => item.id === id)
    if (index !== -1) usuariosMemoria.splice(index, 1)
    return { message: 'Usuário removido com sucesso' }
  }
}

module.exports = usuarioService
