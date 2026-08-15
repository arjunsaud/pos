import { ProductCreateDto } from '../dtos/product.create.dto';

export const PRODUCT_IMPORT_MAX_ROWS = 2000;

const COLUMN_ALIASES: Record<string, string[]> = {
  name: ['name', 'product', 'productname', 'product_name', 'item', 'itemname'],
  sku: ['sku', 'code', 'itemcode', 'item_code', 'productcode'],
  barcode: ['barcode', 'bar_code', 'ean', 'upc'],
  price: ['price', 'sellingprice', 'selling_price', 'mrp', 'rate'],
  costPrice: ['costprice', 'cost', 'cost_price', 'purchaseprice', 'purchase_price'],
  category: ['category', 'categoryname', 'cat'],
  stock: ['stock', 'quantity', 'qty', 'qtyonhand', 'qty_on_hand'],
  minStock: ['minstock', 'min_stock', 'reorder', 'reorderlevel', 'reorder_level'],
  unit: ['unit', 'uom'],
  vendorName: ['vendorname', 'vendor', 'supplier', 'suppliername'],
  isActive: ['isactive', 'active', 'status'],
};

export interface ProductImportError {
  row: number;
  sku?: string;
  reason: string;
}

export interface ProductImportResult {
  created: number;
  skipped: number;
  errors: ProductImportError[];
}

function normalizeKey(key: string): string {
  return key
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function cell(
  row: Record<string, unknown>,
  field: keyof typeof COLUMN_ALIASES,
): string {
  const aliases = COLUMN_ALIASES[field];
  for (const [rawKey, value] of Object.entries(row)) {
    if (aliases.includes(normalizeKey(rawKey)) && value !== undefined && value !== null) {
      return String(value).trim();
    }
  }
  return '';
}

function toNumber(value: string, fallback = 0): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: string, fallback = true): boolean {
  if (!value) {
    return fallback;
  }
  const normalized = value.toLowerCase();
  if (['no', 'false', '0', 'inactive', 'disabled'].includes(normalized)) {
    return false;
  }
  if (['yes', 'true', '1', 'active', 'enabled'].includes(normalized)) {
    return true;
  }
  return fallback;
}

export function isEmptyImportRow(row: Record<string, unknown>): boolean {
  return Object.values(row).every(
    (value) =>
      value === undefined || value === null || String(value).trim() === '',
  );
}

export function mapImportRow(
  row: Record<string, unknown>,
  tenantId: string,
): { dto?: ProductCreateDto; error?: string } {
  const name = cell(row, 'name');
  const sku = cell(row, 'sku');

  if (!name) {
    return { error: 'Name is required' };
  }
  if (!sku) {
    return { error: 'SKU is required' };
  }

  const price = toNumber(cell(row, 'price'));
  if (price < 0) {
    return { error: 'Price must be 0 or greater' };
  }

  const barcode = cell(row, 'barcode') || sku;
  const dto: ProductCreateDto = {
    tenantId,
    name,
    sku,
    barcode,
    price,
    costPrice: toNumber(cell(row, 'costPrice')),
    category: cell(row, 'category') || 'General',
    stock: toNumber(cell(row, 'stock')),
    minStock: toNumber(cell(row, 'minStock')),
    unit: cell(row, 'unit') || 'pcs',
    vendorName: cell(row, 'vendorName') || undefined,
    isActive: toBoolean(cell(row, 'isActive')),
  };

  return { dto };
}

export function isSpreadsheetFile(filename?: string): boolean {
  const ext = (filename || '').toLowerCase().split('.').pop();
  return ext === 'xls' || ext === 'xlsx' || ext === 'csv';
}
