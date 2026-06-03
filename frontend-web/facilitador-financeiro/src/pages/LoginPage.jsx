import { useState } from 'react'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { api } from '../services/api'

function LoginPage({ onLogin, onGoToCadastro }) {
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (!form.email.trim() || !form.senha.trim()) {
      setErro('Informe e-mail e senha para entrar.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', form)
      onLogin(response.data.usuario)
    } catch (error) {
      setErro(error.response?.data?.error || 'Não foi possível fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Entrar na plataforma" subtitle="Use seu e-mail e senha para acessar o simulador.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seuemail@exemplo.com" />
        </label>
        <label>
          Senha
          <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Digite sua senha" />
        </label>

        {erro && <div className="alert error compact"><AlertCircle size={18} /><span>{erro}</span></div>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth-switch">
        Ainda não tem conta?
        <button type="button" onClick={onGoToCadastro}>Criar cadastro</button>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
