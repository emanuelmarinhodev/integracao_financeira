import { Loader2, Save } from 'lucide-react'

const perfis = ['Conservador', 'Moderado', 'Agressivo']

function ProfileForm({ form, saving, onChange, onSubmit }) {
  return (
    <article className="panel profile-form-card">
      <div className="section-title">
        <div>
          <span>Dados pessoais</span>
          <h2>Alterar informações</h2>
        </div>
      </div>

      <form className="profile-form" onSubmit={onSubmit}>
        <label>
          Nome completo
          <input name="nome" value={form.nome} onChange={onChange} placeholder="Seu nome" />
        </label>

        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="seuemail@email.com" />
        </label>

        <label>
          Perfil de risco padrão
          <select name="perfil_risco" value={form.perfil_risco} onChange={onChange}>
            {perfis.map((perfil) => <option key={perfil} value={perfil}>{perfil}</option>)}
          </select>
        </label>

        <label>
          Aporte padrão
          <input name="valor_investimento" type="number" min="1" step="0.01" value={form.valor_investimento} onChange={onChange} placeholder="Ex: 5000" />
        </label>

        <label>
          Prazo padrão em meses
          <input name="prazo_meses" type="number" min="1" step="1" value={form.prazo_meses} onChange={onChange} placeholder="Ex: 12" />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </article>
  )
}

export default ProfileForm
