export type StockLevel = 'out' | 'low' | 'ok';

export function getStockLevel(stock: number, lowThreshold = 10): StockLevel {
  if (stock <= 0) return 'out';
  if (stock <= lowThreshold) return 'low';
  return 'ok';
}

export function getStockLabel(stock: number, lowThreshold = 10): string {
  const level = getStockLevel(stock, lowThreshold);
  if (level === 'out') return 'Out of stock';
  if (level === 'low') return 'Low stock';
  return 'In stock';
}
