import { History } from 'lucide-react'
import { formatCurrency, formatDate } from '../services/formatters'

function UserSimulationHistory({ simulacoes = [] }) {
  const totalLucroReal = simulacoes.reduce((sum, item) => sum + Number(item.lucro_real || 0), 0)
  const maiorMontante = simulacoes.reduce((max, item) => Math.max(max, Number(item.montante_real || 0)), 0)

  return (
    <section className="panel table-panel user-history-card">
      <div className="section-title">
        <div>
          <span>Histórico pessoal</span>
          <h2>Suas simulações</h2>
        </div>
        <History size={22} />
      </div>

      <div className="history-metrics">
        <div>
          <span>Total de simulações</span>
          <strong>{simulacoes.length}</strong>
        </div>
        <div>
          <span>Lucro real somado</span>
          <strong>{formatCurrency(totalLucroReal)}</strong>
        </div>
        <div>
          <span>Maior montante real</span>
          <strong>{maiorMontante ? formatCurrency(maiorMontante) : 'R$ 0,00'}</strong>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Aporte</th>
              <th>Prazo</th>
              <th>Perfil</th>
              <th>Montante líquido</th>
              <th>Montante real</th>
              <th>Lucro real</th>
            </tr>
          </thead>
          <tbody>
            {simulacoes.length > 0 ? simulacoes.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.created_at)}</td>
                <td>{formatCurrency(item.valor_aporte)}</td>
                <td>{item.prazo_meses} meses</td>
                <td>{item.perfil_risco}</td>
                <td>{formatCurrency(item.montante_liquido)}</td>
                <td>{formatCurrency(item.montante_real)}</td>
                <td>{formatCurrency(item.lucro_real)}</td>
              </tr>
            )) : (
              <tr><td colSpan="7">Nenhuma simulação vinculada ao seu usuário ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UserSimulationHistory
