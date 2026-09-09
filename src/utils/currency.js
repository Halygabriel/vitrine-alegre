export const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value) {
  const numericValue = Number(value);
  return brlFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}
