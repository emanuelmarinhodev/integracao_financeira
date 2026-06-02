const crypto = require('crypto')
const supabase = require('./supabase')

const usuariosMemoria = []

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function gerarHashSenha(senha, salt = crypto.randomBytes(16).toString('hex')) {
  const senhaHash = crypto
    .pbkdf2Sync(String(senha), salt, 100000, 64, 'sha512')
    .toString('hex')

  return `${salt}:${senhaHash}`
}

function validarSenha(senha, senhaSalva) {
  if (!senha || !senhaSalva || !senhaSalva.includes(':')) return false
  const [salt, hashOriginal] = senhaSalva.split(':')
  const hashTentativa = gerarHashSenha(senha, salt).split(':')[1]

  return crypto.timingSafeEqual(Buffer.from(hashOriginal), Buffer.from(hashTentativa))
}

function limparUsuario(usuario) {
  if (!usuario) return null
  const { senha_hash, ...usuarioSemSenha } = usuario
  return usuarioSemSenha
}

function validarCadastro({ nome, email, senha }) {
  if (!String(nome || '').trim()) throw new Error('Nome é obrigatório.')
  if (!normalizarEmail(email)) throw new Error('E-mail é obrigatório.')
  if (!String(senha || '').trim()) throw new Error('Senha é obrigatória.')
  if (String(senha).length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.')
}

function montarDadosPerfil(dados) {
  const payload = {}

  if (Object.prototype.hasOwnProperty.call(dados, 'nome')) {
    if (!String(dados.nome || '').trim()) throw new Error('Nome é obrigatório.')
    payload.nome = String(dados.nome).trim()
  }

  if (Object.prototype.hasOwnProperty.call(dados, 'email')) {
    const email = normalizarEmail(dados.email)
    if (!email) throw new Error('E-mail é obrigatório.')
    payload.email = email
  }

  if (Object.prototype.hasOwnProperty.call(dados, 'perfil_risco')) {
    const perfis = ['Conservador', 'Moderado', 'Agressivo']
    if (dados.perfil_risco && !perfis.includes(dados.perfil_risco)) {
      throw new Error('Perfil de risco inválido.')
    }
    payload.perfil_risco = dados.perfil_risco || null
  }

  if (Object.prototype.hasOwnProperty.call(dados, 'valor_investimento')) {
    const valor = dados.valor_investimento === '' || dados.valor_investimento === null
      ? null
      : Number(dados.valor_investimento)
    if (valor !== null && (!Number.isFinite(valor) || valor <= 0)) {
      throw new Error('O valor de investimento padrão deve ser maior que zero.')
    }
    payload.valor_investimento = valor
  }

  if (Object.prototype.hasOwnProperty.call(dados, 'prazo_meses')) {
    const prazo = dados.prazo_meses === '' || dados.prazo_meses === null
      ? null
      : Number(dados.prazo_meses)
    if (prazo !== null && (!Number.isInteger(prazo) || prazo <= 0)) {
      throw new Error('O prazo padrão deve ser um número inteiro maior que zero.')
    }
    payload.prazo_meses = prazo
  }

  return payload
}

async function cadastrar(dados) {
  validarCadastro(dados)

  const usuario = {
    nome: String(dados.nome).trim(),
    email: normalizarEmail(dados.email),
    senha_hash: gerarHashSenha(dados.senha),
    perfil_risco: dados.perfil_risco || 'Conservador',
    valor_investimento: dados.valor_investimento ? Number(dados.valor_investimento) : null,
    prazo_meses: dados.prazo_meses ? Number(dados.prazo_meses) : null
  }

  if (supabase) {
    const { data: existente, error: erroBusca } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', usuario.email)
      .maybeSingle()

    if (erroBusca) throw new Error(`Erro ao consultar usuário: ${erroBusca.message}`)
    if (existente) throw new Error('Já existe um cadastro com este e-mail.')

    const { data, error } = await supabase
      .from('usuarios')
      .insert(usuario)
      .select('id, nome, email, perfil_risco, valor_investimento, prazo_meses, created_at, updated_at')
      .single()

    if (error) throw new Error(`Erro ao cadastrar usuário no Supabase: ${error.message}`)
    return limparUsuario(data)
  }

  const existente = usuariosMemoria.find((item) => item.email === usuario.email)
  if (existente) throw new Error('Já existe um cadastro com este e-mail.')

  const novoUsuario = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...usuario
  }

  usuariosMemoria.push(novoUsuario)
  return limparUsuario(novoUsuario)
}

async function login(dados) {
  const email = normalizarEmail(dados.email)
  const senha = String(dados.senha || '')

  if (!email || !senha) throw new Error('Informe e-mail e senha.')

  if (supabase) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw new Error(`Erro ao consultar usuário: ${error.message}`)
    if (!data || !validarSenha(senha, data.senha_hash)) throw new Error('E-mail ou senha inválidos.')

    return limparUsuario(data)
  }

  const usuario = usuariosMemoria.find((item) => item.email === email)
  if (!usuario || !validarSenha(senha, usuario.senha_hash)) throw new Error('E-mail ou senha inválidos.')

  return limparUsuario(usuario)
}

async function buscarPorId(id) {
  if (!id) throw new Error('ID do usuário é obrigatório.')

  if (supabase) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, perfil_risco, valor_investimento, prazo_meses, created_at, updated_at')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(`Erro ao buscar usuário: ${error.message}`)
    if (!data) throw new Error('Usuário não encontrado.')
    return data
  }

  const usuario = usuariosMemoria.find((item) => String(item.id) === String(id))
  if (!usuario) throw new Error('Usuário não encontrado.')
  return limparUsuario(usuario)
}

async function atualizarPerfil(id, dados) {
  if (!id) throw new Error('ID do usuário é obrigatório.')
  const payload = montarDadosPerfil(dados)
  if (!Object.keys(payload).length) throw new Error('Nenhum dado enviado para atualização.')

  payload.updated_at = new Date().toISOString()

  if (supabase) {
    if (payload.email) {
      const { data: existente, error: erroBusca } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', payload.email)
        .neq('id', id)
        .maybeSingle()

      if (erroBusca) throw new Error(`Erro ao validar e-mail: ${erroBusca.message}`)
      if (existente) throw new Error('Este e-mail já está sendo usado por outro usuário.')
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id)
      .select('id, nome, email, perfil_risco, valor_investimento, prazo_meses, created_at, updated_at')
      .single()

    if (error) throw new Error(`Erro ao atualizar usuário no Supabase: ${error.message}`)
    return data
  }

  const index = usuariosMemoria.findIndex((item) => String(item.id) === String(id))
  if (index === -1) throw new Error('Usuário não encontrado.')

  if (payload.email && usuariosMemoria.some((item) => item.email === payload.email && String(item.id) !== String(id))) {
    throw new Error('Este e-mail já está sendo usado por outro usuário.')
  }

  usuariosMemoria[index] = {
    ...usuariosMemoria[index],
    ...payload
  }

  return limparUsuario(usuariosMemoria[index])
}

module.exports = {
  cadastrar,
  login,
  buscarPorId,
  atualizarPerfil
}
