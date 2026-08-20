import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatNpr, SHORTCUTS } from '@posnepal/shared';
import {
  Search,
  Package,
  Minus,
  Plus,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { apiRequest, listResource, num, str } from '@/lib/api';
import { printSale } from '@/lib/print';
import type { CartItem, DesktopUser, ProductRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function ProductThumb({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-muted">
      {!failed && src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <Package className="size-8 text-muted-foreground/50" />
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

const PAYMENTS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'esewa', label: 'eSewa', icon: Smartphone },
  { id: 'khalti', label: 'Khalti', icon: Wallet },
] as const;

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
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState('cash');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void listResource('/v1/user/product')
      .then((rows) => setProducts(rows.map(toProduct).filter((p) => p.isActive)))
      .catch(() => setMessage('Could not load products'));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      return !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q);
    });
  }, [products, query, category]);

  const add = useCallback((product: ProductRow) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
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

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="POS" description="Point of sale terminal">
        <Badge variant="secondary">{cartCount} in cart</Badge>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Products', value: String(products.length) },
          { label: 'Cart items', value: String(cartCount) },
          { label: 'Total', value: formatNpr(total) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Input
              ref={barcodeRef}
              className="sm:w-44"
              placeholder={`Barcode (${SHORTCUTS.posBarcode.keysLabel})`}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && scan()}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? 'default' : 'outline'}
                onClick={() => setCategory(cat)}
                className="shrink-0 capitalize"
              >
                {cat === 'all' ? 'All' : cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                className="rounded-xl border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <ProductThumb src={p.image} name={p.name} />
                <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.sku} · stock {p.stock}
                </p>
                <p className="mt-1 text-sm font-medium">{formatNpr(p.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:w-[400px]">
          <Card className="sticky top-4 gap-4 py-4">
            <CardHeader className="px-4 pb-0">
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <div className="max-h-72 space-y-3 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            onClick={() =>
                              setCart((c) =>
                                c.map((i) =>
                                  i.product.id === item.product.id
                                    ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                                    : i,
                                ),
                              )
                            }
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            onClick={() =>
                              setCart((c) =>
                                c.map((i) =>
                                  i.product.id === item.product.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i,
                                ),
                              )
                            }
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{formatNpr(item.product.price * item.quantity)}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1.5 border-t pt-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNpr(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT 13%</span><span>{formatNpr(vat)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>{formatNpr(total)}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PAYMENTS.map((pay) => {
                  const Icon = pay.icon;
                  return (
                    <Button
                      key={pay.id}
                      type="button"
                      size="sm"
                      variant={method === pay.id ? 'default' : 'outline'}
                      className="justify-start gap-2"
                      onClick={() => setMethod(pay.id)}
                    >
                      <Icon className="size-4" />
                      {pay.label}
                    </Button>
                  );
                })}
              </div>

              {message ? <p className={cn('text-sm', message.includes('failed') ? 'text-destructive' : 'text-emerald-700')}>{message}</p> : null}

              <Button
                className="h-11 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-600/90 hover:to-emerald-500/90"
                disabled={cart.length === 0}
                onClick={() => void checkout()}
              >
                Complete sale ({SHORTCUTS.posCheckout.keysLabel})
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
