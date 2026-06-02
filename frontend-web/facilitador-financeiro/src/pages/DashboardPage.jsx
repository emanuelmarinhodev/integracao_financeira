import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Database,
  LineChart,
  Loader2,
  PiggyBank,
  ShieldCheck,
  WalletCards
} from 'lucide-react'
import StatCard from '../components/StatCard'
import Sparkline from '../components/Sparkline'
import { api } from '../services/api'
import { formatCurrency, formatDate, formatPercent } from '../services/formatters'

const perfis = [
  {
    nome: 'Conservador',
    descricao: '100% da Selic, foco em segurança e previsibilidade.',
    premio: '0% a.a.'
  },
  {
    nome: 'Moderado',
    descricao: 'Selic + 2% ao ano, equilíbrio entre retorno e risco.',
    premio: '+2% a.a.'
  },
  {
    nome: 'Agressivo',
    descricao: 'Selic + 5% ao ano, buscando maior potencial de retorno.',
    premio: '+5% a.a.'
  }
]

const initialForm = {
  valor_aporte: '5000',
  prazo_meses: '12',
  perfil_risco: 'Conservador'
}

function normalizeIndicators(items) {
  return items
    .map((item) => ({
      ...item,
      dataObj: new Date(item.data),
      selic: Number(item.selic),
      ipca: Number(item.ipca)
    }))
    .filter((item) => {
      const year = item.dataObj.getFullYear()
      return year >= 2025 && year <= 2026 && Number.isFinite(item.selic) && Number.isFinite(item.ipca)
    })
}

function DashboardPage({ usuario }) {
  const [indicadores, setIndicadores] = useState([])
  const [resumo, setResumo] = useState(null)
  const [simulacoes, setSimulacoes] = useState([])
  const [form, setForm] = useState(() => ({
    ...initialForm,
    valor_aporte: usuario?.valor_investimento || initialForm.valor_aporte,
    prazo_meses: usuario?.prazo_meses || initialForm.prazo_meses,
    perfil_risco: usuario?.perfil_risco || initialForm.perfil_risco
  }))
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simulando, setSimulando] = useState(false)
  const [erro, setErro] = useState('')
  const [erroSimulacao, setErroSimulacao] = useState('')

  async function carregarSimulacoes() {
    try {
      const response = usuario?.id
        ? await api.get(`/auth/usuarios/${usuario.id}/simulacoes`)
        : await api.get('/simulacoes')
      setSimulacoes(Array.isArray(response.data) ? response.data : [])
    } catch {
      setSimulacoes([])
    }
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        setErro('')
        const [indicadoresResponse, resumoResponse] = await Promise.all([
          api.get('/indicadores'),
          api.get('/indicadores/resumo')
        ])
        setIndicadores(normalizeIndicators(indicadoresResponse.data))
        setResumo(resumoResponse.data)
        await carregarSimulacoes()
      } catch (error) {
        setErro(error.response?.data?.message || error.response?.data?.error || 'Não foi possível carregar os dados da API.')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ultimoIndicador = indicadores[indicadores.length - 1]
  const ultimosIndicadores = useMemo(() => indicadores.slice(-8).reverse(), [indicadores])
  const ultimasSimulacoes = useMemo(() => simulacoes.slice(0, 6), [simulacoes])
  const referencia = resumo?.referencia_simulacao

  function handleInputChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErroSimulacao('')
    setResultado(null)

    const payload = {
      valor_aporte: Number(form.valor_aporte),
      prazo_meses: Number(form.prazo_meses),
      perfil_risco: form.perfil_risco,
      usuario_id: usuario?.id
    }

    if (!Number.isFinite(payload.valor_aporte) || payload.valor_aporte <= 0) {
      setErroSimulacao('Informe um valor de aporte maior que zero.')
      return
    }

    if (!Number.isFinite(payload.prazo_meses) || payload.prazo_meses <= 0) {
      setErroSimulacao('Informe um prazo maior que zero.')
      return
    }

    try {
      setSimulando(true)
      const response = await api.post('/simulacao', payload)
      setResultado(response.data)
      await carregarSimulacoes()
    } catch (error) {
      setErroSimulacao(error.response?.data?.error || 'Não foi possível realizar a simulação.')
    } finally {
      setSimulando(false)
    }
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow"><Database size={16} /> Banco Central + Node.js + React</div>
          <h1>Olá, {usuario?.nome || 'investidor'}! Simule investimentos com dados oficiais.</h1>
          <p>
            Consulte indicadores de 2025 e 2026, aplique regras por perfil de risco e compare lucro bruto,
            lucro real e imposto de renda com persistência no Supabase.
          </p>
          <div className="hero-actions">
            <a href="#simulador" className="primary-link">Simular investimento</a>
            <a href="#indicadores" className="secondary-link">Ver indicadores</a>
          </div>
        </div>

        <div className="hero-card">
          <PiggyBank size={38} />
          <span>Taxa de referência</span>
          <strong>{referencia ? formatPercent(referencia.selic_anualizada) : '--'}</strong>
          <small>Selic anualizada de {referencia?.ano || '2026'} usada na simulação</small>
        </div>
      </section>

      {erro && (
        <div className="alert error">
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {loading ? (
        <section className="loading-card">
          <Loader2 className="spin" size={32} />
          <p>Carregando indicadores econômicos...</p>
        </section>
      ) : (
        <>
          <section className="stats-grid" id="indicadores">
            <StatCard
              icon={BarChart3}
              title="Última Selic diária"
              value={formatPercent(ultimoIndicador?.selic)}
              subtitle={ultimoIndicador ? formatDate(ultimoIndicador.data) : 'Sem dados'}
            />
            <StatCard
              icon={LineChart}
              title="IPCA acumulado"
              value={formatPercent(referencia?.ipca_acumulado)}
              subtitle={`Referência ${referencia?.ano || '--'}`}
            />
            <StatCard
              icon={ShieldCheck}
              title="Taxa real de juros"
              value={formatPercent(referencia?.taxa_real_juros)}
              subtitle="Selic descontada da inflação"
            />
            <StatCard
              icon={CheckCircle2}
              title="Registros tratados"
              value={String(resumo?.total_registros || indicadores.length)}
              subtitle="Período filtrado: 2025 e 2026"
            />
          </section>

          <section className="content-grid">
            <article className="panel wide-panel">
              <div className="section-title">
                <div>
                  <span>Histórico recente</span>
                  <h2>Comportamento da Selic</h2>
                </div>
                <ArrowUpRight size={22} />
              </div>
              <Sparkline data={indicadores} field="selic" label="Selic" />
            </article>

            <article className="panel">
              <div className="section-title">
                <div>
                  <span>Resumo anual</span>
                  <h2>Indicadores derivados</h2>
                </div>
              </div>
              <div className="summary-list">
                {resumo?.resumo_anual?.map((item) => (
                  <div className="summary-item" key={item.ano}>
                    <strong>{item.ano}</strong>
                    <span>Selic anualizada: {formatPercent(item.selic_anualizada)}</span>
                    <span>IPCA acumulado: {formatPercent(item.ipca_acumulado)}</span>
                    <span>Taxa real: {formatPercent(item.taxa_real_juros)}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="simulator-grid" id="simulador">
            <article className="panel simulator-panel">
              <div className="section-title">
                <div>
                  <span>Simulação</span>
                  <h2>Calcule sua projeção</h2>
                </div>
                <Calculator size={22} />
              </div>

              <form onSubmit={handleSubmit} className="simulator-form">
                <label>
                  Valor do aporte
                  <input name="valor_aporte" type="number" min="1" step="0.01" value={form.valor_aporte} onChange={handleInputChange} placeholder="Ex: 5000" />
                </label>

                <label>
                  Prazo em meses
                  <input name="prazo_meses" type="number" min="1" step="1" value={form.prazo_meses} onChange={handleInputChange} placeholder="Ex: 12" />
                </label>

                <label>
                  Perfil de risco
                  <select name="perfil_risco" value={form.perfil_risco} onChange={handleInputChange}>
                    {perfis.map((perfil) => <option key={perfil.nome} value={perfil.nome}>{perfil.nome}</option>)}
                  </select>
                </label>

                {erroSimulacao && <div className="alert error compact"><AlertCircle size={18} /><span>{erroSimulacao}</span></div>}

                <button type="submit" disabled={simulando}>
                  {simulando ? <Loader2 className="spin" size={18} /> : <Calculator size={18} />}
                  {simulando ? 'Simulando...' : 'Simular agora'}
                </button>
              </form>
            </article>

            <article className="panel result-panel">
              <div className="section-title">
                <div>
                  <span>Resultado</span>
                  <h2>Lucro bruto x lucro real</h2>
                </div>
                <WalletCards size={22} />
              </div>

              {resultado ? (
                <div className="result-content">
                  <div className="result-highlight">
                    <span>Montante real estimado</span>
                    <strong>{formatCurrency(resultado.resultado.montante_real)}</strong>
                    <small>{resultado.recomendacao}</small>
                  </div>

                  <div className="result-grid">
                    <div><span>Montante bruto</span><strong>{formatCurrency(resultado.resultado.montante_bruto)}</strong></div>
                    <div><span>Montante líquido</span><strong>{formatCurrency(resultado.resultado.montante_liquido)}</strong></div>
                    <div><span>Ganho nominal</span><strong>{formatCurrency(resultado.resultado.ganho_nominal)}</strong></div>
                    <div><span>Lucro real</span><strong>{formatCurrency(resultado.resultado.lucro_real)}</strong></div>
                    <div><span>Imposto de renda</span><strong>{formatCurrency(resultado.resultado.imposto_renda)}</strong></div>
                    <div><span>Taxa aplicada</span><strong>{formatPercent(resultado.parametros.taxa_anual_aplicada)}</strong></div>
                  </div>
                </div>
              ) : (
                <div className="empty-result">
                  <Calculator size={34} />
                  <p>Preencha o formulário para ver a simulação estruturada em JSON pela API.</p>
                </div>
              )}
            </article>
          </section>

          <section className="profile-grid">
            {perfis.map((perfil) => (
              <article className={`profile-card ${form.perfil_risco === perfil.nome ? 'active' : ''}`} key={perfil.nome}>
                <strong>{perfil.nome}</strong>
                <span>{perfil.premio}</span>
                <p>{perfil.descricao}</p>
              </article>
            ))}
          </section>

          <section className="panel table-panel">
            <div className="section-title">
              <div>
                <span>Histórico salvo</span>
                <h2>Últimas simulações</h2>
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
                    <th>Montante real</th>
                    <th>Lucro real</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasSimulacoes.length > 0 ? ultimasSimulacoes.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.created_at)}</td>
                      <td>{formatCurrency(item.valor_aporte)}</td>
                      <td>{item.prazo_meses} meses</td>
                      <td>{item.perfil_risco}</td>
                      <td>{formatCurrency(item.montante_real)}</td>
                      <td>{formatCurrency(item.lucro_real)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6">Nenhuma simulação salva ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel table-panel">
            <div className="section-title">
              <div>
                <span>Últimos registros</span>
                <h2>Dados tratados da integração</h2>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Selic diária</th>
                    <th>IPCA</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosIndicadores.map((item) => (
                    <tr key={item.data}>
                      <td>{item.dataObj.toLocaleDateString('pt-BR')}</td>
                      <td>{formatPercent(item.selic)}</td>
                      <td>{formatPercent(item.ipca)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default DashboardPage
