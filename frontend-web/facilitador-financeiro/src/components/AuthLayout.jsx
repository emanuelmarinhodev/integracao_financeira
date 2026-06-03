import { Database, ShieldCheck, TrendingUp } from 'lucide-react'

function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <article className="auth-info-card">
        <div className="eyebrow"><Database size={16} /> Integração de Sistemas</div>
        <h1>Simulador financeiro com dados do Banco Central</h1>
        <p>
          Acesse a plataforma para consultar indicadores econômicos, simular investimentos e salvar o histórico no Supabase.
        </p>
        <div className="auth-benefits">
          <div><TrendingUp size={20} /><span>Selic, IPCA e taxa real</span></div>
          <div><ShieldCheck size={20} /><span>Perfis Conservador, Moderado e Agressivo</span></div>
        </div>
      </article>

      <article className="auth-form-card">
        <div className="auth-heading">
          <span>Área do usuário</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {children}
      </article>
    </section>
  )
}

export default AuthLayout
