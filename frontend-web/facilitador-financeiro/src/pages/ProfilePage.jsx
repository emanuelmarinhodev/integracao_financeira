import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, UserRoundCog } from 'lucide-react'
import ProfileForm from '../components/ProfileForm'
import ProfileSummaryCard from '../components/ProfileSummaryCard'
import UserSimulationHistory from '../components/UserSimulationHistory'
import { api } from '../services/api'

function montarForm(usuario) {
  return {
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    perfil_risco: usuario?.perfil_risco || 'Conservador',
    valor_investimento: usuario?.valor_investimento || '',
    prazo_meses: usuario?.prazo_meses || ''
  }
}

function ProfilePage({ usuario, onUserUpdate }) {
  const [form, setForm] = useState(() => montarForm(usuario))
  const [simulacoes, setSimulacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    async function carregarPerfil() {
      if (!usuario?.id) return

      try {
        setLoading(true)
        setErro('')
        const [perfilResponse, historicoResponse] = await Promise.all([
          api.get(`/auth/usuarios/${usuario.id}`),
          api.get(`/auth/usuarios/${usuario.id}/simulacoes`)
        ])

        onUserUpdate(perfilResponse.data)
        setForm(montarForm(perfilResponse.data))
        setSimulacoes(Array.isArray(historicoResponse.data) ? historicoResponse.data : [])
      } catch (error) {
        setErro(error.response?.data?.error || 'Não foi possível carregar os dados do perfil.')
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id])

  const resumo = useMemo(() => ({
    totalSimulacoes: simulacoes.length
  }), [simulacoes.length])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setSucesso('')

    const payload = {
      nome: form.nome,
      email: form.email,
      perfil_risco: form.perfil_risco,
      valor_investimento: form.valor_investimento === '' ? null : Number(form.valor_investimento),
      prazo_meses: form.prazo_meses === '' ? null : Number(form.prazo_meses)
    }

    try {
      setSaving(true)
      const response = await api.put(`/auth/usuarios/${usuario.id}`, payload)
      onUserUpdate(response.data.usuario)
      setSucesso('Perfil atualizado com sucesso.')
    } catch (error) {
      setErro(error.response?.data?.error || 'Não foi possível salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="loading-card">
        <Loader2 className="spin" size={32} />
        <p>Carregando perfil do usuário...</p>
      </section>
    )
  }

  return (
    <>
      <section className="profile-hero">
        <div>
          <div className="eyebrow"><UserRoundCog size={16} /> Área do usuário</div>
          <h1>Perfil, dados pessoais e histórico</h1>
          <p>
            Gerencie os dados usados no cadastro, defina preferências padrão para novas simulações e acompanhe
            as projeções feitas pelo seu usuário.
          </p>
        </div>
      </section>

      {erro && <div className="alert error"><AlertCircle size={20} /><span>{erro}</span></div>}
      {sucesso && <div className="alert success"><CheckCircle2 size={20} /><span>{sucesso}</span></div>}

      <section className="profile-layout">
        <ProfileSummaryCard usuario={usuario} totalSimulacoes={resumo.totalSimulacoes} />
        <ProfileForm form={form} saving={saving} onChange={handleChange} onSubmit={handleSubmit} />
      </section>

      <UserSimulationHistory simulacoes={simulacoes} />
    </>
  )
}

export default ProfilePage
