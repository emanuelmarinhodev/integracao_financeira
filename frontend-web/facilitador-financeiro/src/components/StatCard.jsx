function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <article className="stat-card">
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{subtitle}</span>
      </div>
    </article>
  )
}

export default StatCard
