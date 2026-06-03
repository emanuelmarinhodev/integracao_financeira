import { useState } from 'react'
import { AlertCircle, Loader2, UserPlus } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { api } from '../services/api'

function RegisterPage({ onRegister, onGoToLogin }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      setErro('Preencha nome, e-mail e senha.')
      return
    }

    if (form.senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/cadastro', {
        nome: form.nome,
        email: form.email,
        senha: form.senha
      })
      onRegister(response.data.usuario)
    } catch (error) {
      setErro(error.response?.data?.error || 'Não foi possível criar o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Criar cadastro" subtitle="Cadastre-se para salvar suas simulações no histórico.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input name="nome" type="text" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seuemail@exemplo.com" />
        </label>
        <label>
          Senha
          <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
        </label>
        <label>
          Confirmar senha
          <input name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} placeholder="Repita sua senha" />
        </label>

        {erro && <div className="alert error compact"><AlertCircle size={18} /><span>{erro}</span></div>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : <UserPlus size={18} />}
          {loading ? 'Criando...' : 'Criar cadastro'}
        </button>
      </form>

      <p className="auth-switch">
        Já possui conta?
        <button type="button" onClick={onGoToLogin}>Entrar</button>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
