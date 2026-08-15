export type PrintTemplateType = 'invoice' | 'receipt';

export const PRINT_TEMPLATE_TYPES: PrintTemplateType[] = ['invoice', 'receipt'];

export const PRINT_TEMPLATE_VARIABLES = [
  'storeName',
  'storeAddress',
  'storePan',
  'storePhone',
  'invoiceNumber',
  'date',
  'cashier',
  'customerName',
  'customerPan',
  'items',
  'name',
  'quantity',
  'price',
  'lineTotal',
  'subtotal',
  'vat',
  'discount',
  'total',
  'paymentMethod',
  'footer',
] as const;

export interface PrintLineItem {
  name: string;
  quantity: string | number;
  price: string | number;
  lineTotal: string | number;
}

export interface PrintTemplateContext {
  storeName: string;
  storeAddress: string;
  storePan: string;
  storePhone: string;
  invoiceNumber: string;
  date: string;
  cashier: string;
  customerName: string;
  customerPan?: string;
  items: PrintLineItem[];
  subtotal: string;
  vat: string;
  discount: string;
  total: string;
  paymentMethod: string;
  footer: string;
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function interpolate(html: string, vars: Record<string, unknown>): string {
  return html.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) => {
    if (key === 'items') return '';
    const value = vars[key];
    if (value === undefined || value === null) return '';
    return escapeHtml(value);
  });
}

export function renderPrintTemplate(
  html: string,
  data: PrintTemplateContext,
): string {
  const withItems = html.replace(
    /{{#items}}([\s\S]*?){{\/items}}/g,
    (_match, inner: string) =>
      (data.items ?? [])
        .map((item) => interpolate(inner, item as unknown as Record<string, unknown>))
        .join(''),
  );
  return interpolate(withItems, data as unknown as Record<string, unknown>);
}

export const DEFAULT_RECEIPT_HTML = `<div style="font-family:'Courier New',monospace;max-width:320px;margin:0 auto;padding:16px;font-size:12px;color:#111;">
  <div style="text-align:center;">
    <div style="font-size:16px;font-weight:700;">{{storeName}}</div>
    <div style="color:#555;">{{storeAddress}}</div>
    <div style="color:#555;">PAN: {{storePan}}</div>
    <div style="color:#555;">{{storePhone}}</div>
  </div>
  <hr style="border:none;border-top:1px dashed #999;margin:10px 0;" />
  <div style="display:flex;justify-content:space-between;"><span>Receipt #</span><span>{{invoiceNumber}}</span></div>
  <div style="display:flex;justify-content:space-between;"><span>Date</span><span>{{date}}</span></div>
  <div style="display:flex;justify-content:space-between;"><span>Cashier</span><span>{{cashier}}</span></div>
  <div style="display:flex;justify-content:space-between;"><span>Customer</span><span>{{customerName}}</span></div>
  <hr style="border:none;border-top:1px dashed #999;margin:10px 0;" />
  {{#items}}
  <div style="display:flex;justify-content:space-between;"><span>{{name}}</span><span>NPR {{lineTotal}}</span></div>
  <div style="color:#666;font-size:11px;">{{quantity}} x NPR {{price}}</div>
  {{/items}}
  <hr style="border:none;border-top:1px dashed #999;margin:10px 0;" />
  <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>NPR {{subtotal}}</span></div>
  <div style="display:flex;justify-content:space-between;"><span>Discount</span><span>NPR {{discount}}</span></div>
  <div style="display:flex;justify-content:space-between;"><span>VAT</span><span>NPR {{vat}}</span></div>
  <div style="display:flex;justify-content:space-between;font-weight:700;font-size:14px;margin-top:6px;"><span>TOTAL</span><span>NPR {{total}}</span></div>
  <div style="margin-top:6px;">Paid via {{paymentMethod}}</div>
  <hr style="border:none;border-top:1px dashed #999;margin:10px 0;" />
  <div style="text-align:center;color:#555;">{{footer}}</div>
</div>`;

export const DEFAULT_INVOICE_HTML = `<div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:32px;color:#111;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:20px;">
    <div>
      <h1 style="margin:0;font-size:26px;">{{storeName}}</h1>
      <p style="margin:6px 0 0;color:#555;">{{storeAddress}}<br/>PAN: {{storePan}} · {{storePhone}}</p>
    </div>
    <div style="text-align:right;">
      <h2 style="margin:0;font-size:20px;">TAX INVOICE</h2>
      <p style="margin:6px 0 0;">{{invoiceNumber}}<br/>{{date}}</p>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:18px;">
    <div><strong>Bill to</strong><br/>{{customerName}}<br/>PAN: {{customerPan}}</div>
    <div><strong>Cashier</strong><br/>{{cashier}}<br/>{{paymentMethod}}</div>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:8px;text-align:left;background:#f5f5f5;">Item</th>
        <th style="border:1px solid #ddd;padding:8px;text-align:center;background:#f5f5f5;">Qty</th>
        <th style="border:1px solid #ddd;padding:8px;text-align:right;background:#f5f5f5;">Price</th>
        <th style="border:1px solid #ddd;padding:8px;text-align:right;background:#f5f5f5;">Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr>
        <td style="border:1px solid #ddd;padding:8px;">{{name}}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;">{{quantity}}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">NPR {{price}}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right;">NPR {{lineTotal}}</td>
      </tr>
      {{/items}}
    </tbody>
  </table>
  <div style="width:260px;margin-left:auto;">
    <div style="display:flex;justify-content:space-between;padding:3px 0;"><span>Subtotal</span><span>NPR {{subtotal}}</span></div>
    <div style="display:flex;justify-content:space-between;padding:3px 0;"><span>Discount</span><span>NPR {{discount}}</span></div>
    <div style="display:flex;justify-content:space-between;padding:3px 0;"><span>VAT</span><span>NPR {{vat}}</span></div>
    <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:2px solid #111;font-weight:700;"><span>Total</span><span>NPR {{total}}</span></div>
  </div>
  <p style="text-align:center;margin-top:36px;color:#555;border-top:1px dashed #aaa;padding-top:16px;">{{footer}}</p>
</div>`;
