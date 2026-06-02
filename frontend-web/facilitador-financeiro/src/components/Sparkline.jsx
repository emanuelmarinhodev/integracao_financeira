import { formatPercent } from '../services/formatters'

function Sparkline({ data, field, label }) {
  const values = data.map((item) => Number(item[field])).filter(Number.isFinite).slice(-36)

  if (values.length < 2) {
    return <div className="chart-empty">Dados insuficientes para o gráfico de {label}.</div>
  }

  const width = 680
  const height = 180
  const padding = 16
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1)
    const y = height - padding - ((value - min) * (height - padding * 2)) / range
    return `${x},${y}`
  })

  return (
    <div className="chart-box" aria-label={`Gráfico de ${label}`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id={`fill-${field}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline className="sparkline-area" points={`${padding},${height - padding} ${points.join(' ')} ${width - padding},${height - padding}`} fill={`url(#fill-${field})`} />
        <polyline className="sparkline-line" points={points.join(' ')} fill="none" />
      </svg>
      <div className="chart-scale">
        <span>{formatPercent(max)}</span>
        <span>{formatPercent(min)}</span>
      </div>
    </div>
  )
}

export default Sparkline
