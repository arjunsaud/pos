'use client';

import { useCallback, useState } from 'react';
import {
  DEFAULT_INVOICE_HTML,
  DEFAULT_RECEIPT_HTML,
  PrintTemplateContext,
  PrintTemplateType,
  renderPrintTemplate,
} from '@posnepal/shared';
import { apiPaths, apiRequest } from '@/lib/api';
import { npr } from '@/lib/helpers';

export interface PrintableSale {
  invoiceNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  customerPan?: string;
  date?: string;
  cashier?: string;
}

export interface StorePrintInfo {
  name: string;
  address?: string;
  pan?: string;
  phone?: string;
  footer?: string;
}

const cache = new Map<PrintTemplateType, { html: string; paperSize?: string }>();

export async function loadPrintTemplate(type: PrintTemplateType) {
  if (cache.has(type)) return cache.get(type)!;
  try {
    const doc = await apiRequest<{ html?: string; paperSize?: string }>(
      `${apiPaths.user.template}/active`,
      { query: { type } },
    );
    const html = doc?.html || (type === 'receipt' ? DEFAULT_RECEIPT_HTML : DEFAULT_INVOICE_HTML);
    const value = { html, paperSize: doc?.paperSize };
    cache.set(type, value);
    return value;
  } catch {
    const html = type === 'receipt' ? DEFAULT_RECEIPT_HTML : DEFAULT_INVOICE_HTML;
    const value = { html, paperSize: type === 'receipt' ? '80mm' : 'a4' };
    cache.set(type, value);
    return value;
  }
}

export function saleToPrintContext(
  sale: PrintableSale,
  store: StorePrintInfo,
): PrintTemplateContext {
  return {
    storeName: store.name || 'Store',
    storeAddress: store.address || '',
    storePan: store.pan || '',
    storePhone: store.phone || '',
    invoiceNumber: sale.invoiceNumber,
    date: sale.date || new Date().toLocaleString(),
    cashier: sale.cashier || '',
    customerName: sale.customerName || 'Walk-in Customer',
    customerPan: sale.customerPan || '',
    items: sale.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: npr(item.price),
      lineTotal: npr(item.price * item.quantity),
    })),
    subtotal: npr(sale.subtotal),
    vat: npr(sale.vat),
    discount: npr(sale.discount),
    total: npr(sale.total),
    paymentMethod: sale.paymentMethod,
    footer: store.footer || 'Thank you for shopping with us!',
  };
}

export function printHtmlDocument(html: string, title: string) {
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{margin:0;background:#fff;}@media print{body{margin:0;}}</style>
  </head><body>${html}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

export async function printSaleDocument(
  type: PrintTemplateType,
  sale: PrintableSale,
  store: StorePrintInfo,
) {
  const tpl = await loadPrintTemplate(type);
  const html = renderPrintTemplate(tpl.html, saleToPrintContext(sale, store));
  printHtmlDocument(html, `${type} ${sale.invoiceNumber}`);
}

export function usePrintDocument() {
  const [busy, setBusy] = useState(false);
  const print = useCallback(
    async (
      type: PrintTemplateType,
      sale: PrintableSale,
      store: StorePrintInfo,
    ) => {
      setBusy(true);
      try {
        await printSaleDocument(type, sale, store);
      } finally {
        setBusy(false);
      }
    },
    [],
  );
  return { print, busy };
}
