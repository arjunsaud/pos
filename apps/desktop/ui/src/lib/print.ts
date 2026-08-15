import {
  DEFAULT_INVOICE_HTML,
  DEFAULT_RECEIPT_HTML,
  PrintTemplateContext,
  PrintTemplateType,
  renderPrintTemplate,
} from '@posnepal/shared';
import { apiRequest, asRecord, str } from './api';

export interface DesktopPrintSale {
  invoiceNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  date?: string;
  cashier?: string;
}

export function printHtml(html: string, title: string): void {
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title></head><body>${html}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

export async function printSale(
  type: PrintTemplateType,
  sale: DesktopPrintSale,
  storeName: string,
): Promise<void> {
  let html = type === 'receipt' ? DEFAULT_RECEIPT_HTML : DEFAULT_INVOICE_HTML;
  try {
    const doc = asRecord(await apiRequest(`/v1/user/template/active`, { query: { type } }));
    html = str(doc, 'html') || html;
  } catch {
    /* use default */
  }
  const ctx: PrintTemplateContext = {
    storeName,
    storeAddress: '',
    storePan: '',
    storePhone: '',
    invoiceNumber: sale.invoiceNumber,
    date: sale.date || new Date().toLocaleString(),
    cashier: sale.cashier || '',
    customerName: sale.customerName || 'Walk-in Customer',
    customerPan: '',
    items: sale.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      lineTotal: (item.price * item.quantity).toFixed(2),
    })),
    subtotal: sale.subtotal.toFixed(2),
    vat: sale.vat.toFixed(2),
    discount: sale.discount.toFixed(2),
    total: sale.total.toFixed(2),
    paymentMethod: sale.paymentMethod,
    footer: 'Thank you for shopping with us!',
  };
  printHtml(renderPrintTemplate(html, ctx), `${type} ${sale.invoiceNumber}`);
}
