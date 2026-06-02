import { CalendarDays, Mail, ShieldCheck, UserCircle, WalletCards } from 'lucide-react'
import { formatCurrency, formatDate } from '../services/formatters'

function ProfileSummaryCard({ usuario, totalSimulacoes = 0 }) {
  return (
    <article className="panel profile-summary-card">
      <div className="profile-avatar">
        <UserCircle size={46} />
      </div>

      <div>
        <span className="profile-label">Usuário cadastrado</span>
        <h2>{usuario?.nome || 'Investidor'}</h2>
        <p>{usuario?.email}</p>
      </div>

      <div className="profile-summary-list">
        <div>
          <Mail size={18} />
          <span>E-mail</span>
          <strong>{usuario?.email || 'Não informado'}</strong>
        </div>
        <div>
          <ShieldCheck size={18} />
          <span>Perfil padrão</span>
          <strong>{usuario?.perfil_risco || 'Conservador'}</strong>
        </div>
        <div>
          <WalletCards size={18} />
          <span>Aporte padrão</span>
          <strong>{usuario?.valor_investimento ? formatCurrency(usuario.valor_investimento) : 'Não definido'}</strong>
        </div>
        <div>
          <CalendarDays size={18} />
          <span>Simulações</span>
          <strong>{totalSimulacoes}</strong>
        </div>
      </div>

      <small className="profile-created">Cadastro criado em {usuario?.created_at ? formatDate(usuario.created_at) : '--'}</small>
    </article>
  )
}

export default ProfileSummaryCard
