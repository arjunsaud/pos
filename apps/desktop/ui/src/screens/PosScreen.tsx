import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatNpr, SHORTCUTS } from '@posnepal/shared';
import { apiRequest, listResource, num, str } from '../lib/api';
import { printSale } from '../lib/print';
import type { CartItem, DesktopUser, ProductRow } from '../lib/types';

function ProductThumb({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  return (
    <div className="pimg">
      {!failed && src ? (
        <img src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        <span className="pimg-ph" aria-hidden />
      )}
    </div>
  );
}

function toProduct(row: Record<string, unknown>): ProductRow {
  return {
    id: str(row, 'id', '_id'),
    name: str(row, 'name'),
    sku: str(row, 'sku'),
    barcode: str(row, 'barcode'),
    price: num(row, 'price', 'sellingPrice'),
    stock: num(row, 'stock', 'quantity'),
    category: str(row, 'category', 'categoryName'),
    isActive: row.isActive !== false,
    image: str(row, 'image') || undefined,
  };
}

export function PosScreen({
  user,
  checkoutSignal,
  barcodeSignal,
  clearSignal,
}: {
  user: DesktopUser;
  checkoutSignal: number;
  barcodeSignal: number;
  clearSignal: number;
}) {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [query, setQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState('cash');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void listResource('/v1/user/product')
      .then((rows) => setProducts(rows.map(toProduct).filter((p) => p.isActive)))
      .catch(() => setMessage('Could not load products'));
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q),
    );
  }, [products, query]);

  const add = useCallback((product: ProductRow) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const vat = subtotal * 0.13;
  const total = subtotal + vat;

  const checking = useRef(false);

  const checkout = useCallback(async () => {
    if (cart.length === 0 || checking.current) return;
    checking.current = true;
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const snapshot = cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      await apiRequest('/v1/user/sale/create', {
        method: 'POST',
        body: {
          tenantId: user.tenantId || '',
          invoiceNumber,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity,
          })),
          subtotal,
          discount: 0,
          vatAmount: Math.round(vat * 100) / 100,
          total: Math.round(total * 100) / 100,
          paymentMethod: method,
          status: 'completed',
          staffName: user.name,
        },
      });
      setCart([]);
      setMessage('Sale completed — printing receipt');
      void printSale(
        'receipt',
        {
          invoiceNumber,
          items: snapshot,
          subtotal,
          discount: 0,
          vat,
          total,
          paymentMethod: method,
          cashier: user.name,
        },
        user.tenantName || 'Store',
      );
    } catch {
      setMessage('Sale failed');
    } finally {
      checking.current = false;
    }
  }, [cart, method, subtotal, total, user, vat]);

  useEffect(() => {
    if (checkoutSignal) void checkout();
  }, [checkoutSignal, checkout]);

  useEffect(() => {
    if (barcodeSignal) barcodeRef.current?.focus();
  }, [barcodeSignal]);

  useEffect(() => {
    if (clearSignal) {
      setCart([]);
      setQuery('');
    }
  }, [clearSignal]);

  const scan = () => {
    const code = barcode.trim();
    if (!code) return;
    const match = products.find((p) => p.barcode === code || p.sku === code);
    if (match) add(match);
    setBarcode('');
  };

  return (
    <div className="pos">
      <div className="products">
        <div className="row">
          <input className="search" style={{ flex: 1 }} placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          <input
            ref={barcodeRef}
            className="search"
            style={{ width: 180 }}
            placeholder={`Barcode (${SHORTCUTS.posBarcode.keysLabel})`}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && scan()}
          />
        </div>
        <div className="hint">
          <span><kbd>{SHORTCUTS.posBarcode.keysLabel}</kbd> barcode</span>
          <span><kbd>{SHORTCUTS.posCheckout.keysLabel}</kbd> checkout</span>
          <span><kbd>{SHORTCUTS.posClear.keysLabel}</kbd> clear</span>
        </div>
        <div className="plist">
          {visible.map((p) => (
            <button key={p.id} className="pitem" onClick={() => add(p)}>
              <ProductThumb src={p.image} name={p.name} />
              <b>{p.name}</b>
              <small>{p.sku} · stock {p.stock}</small>
              <div>{formatNpr(p.price)}</div>
            </button>
          ))}
        </div>
      </div>
      <aside className="cart">
        <h3>Cart</h3>
        <div className="cart-list">
          {cart.length === 0 && <p style={{ color: 'var(--muted-foreground)' }}>Empty</p>}
          {cart.map((item) => (
            <div key={item.product.id} className="row">
              <div>
                <b>{item.product.name}</b>
                <div className="qty">
                  <button type="button" onClick={() => setCart((c) => c.map((i) => i.product.id === item.product.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}>-</button>
                  {item.quantity}
                  <button type="button" onClick={() => setCart((c) => c.map((i) => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button>
                </div>
              </div>
              <div>{formatNpr(item.product.price * item.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="row"><span>Subtotal</span><b>{formatNpr(subtotal)}</b></div>
        <div className="row"><span>VAT 13%</span><b>{formatNpr(vat)}</b></div>
        <div className="row"><span>Total</span><b>{formatNpr(total)}</b></div>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="search">
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="esewa">eSewa</option>
          <option value="khalti">Khalti</option>
        </select>
        <p className="error">{message}</p>
        <button className="cta" disabled={cart.length === 0} onClick={() => void checkout()}>
          Complete sale ({SHORTCUTS.posCheckout.keysLabel})
        </button>
      </aside>
    </div>
  );
}
