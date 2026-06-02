export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export const numberFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return `${numberFormatter.format(Number(value))}%`
}

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return currencyFormatter.format(Number(value))
}

export function formatDate(value) {
  if (!value) return '--'
  return new Date(value).toLocaleDateString('pt-BR')
}
