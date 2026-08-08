'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, Plus, Minus, X, ShoppingCart, Banknote, CreditCard, Smartphone, Wallet, Receipt, Barcode, Trash2, TrendingUp, Clock, Package, Pause, PlayCircle } from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import type { CartItem, Product, HeldSale } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDateTime, npr } from '@/lib/helpers';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' },
  { id: 'esewa', label: 'eSewa', icon: Smartphone, color: 'text-green-600 dark:text-green-400' },
  { id: 'khalti', label: 'Khalti', icon: Wallet, color: 'text-purple-600 dark:text-purple-400' },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export default function POSTerminal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cash');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState<{ items: CartItem[]; subtotal: number; discount: number; vat: number; total: number; method: string; time: string } | null>(null);
  // Hold/Resume state
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [heldListOpen, setHeldListOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      if (!p.isActive) return false;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', ...mockCategories.map((c) => c.name)];

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Maximum stock reached for ${product.name}`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            toast.error(`Maximum stock reached for ${item.product.name}`);
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.min(discount, subtotal);
  const taxableAmount = subtotal - discountAmount;
  const vat = taxableAmount * 0.13;
  const total = taxableAmount + vat;

  const handleBarcodeScan = () => {
    if (!barcodeInput.trim()) return;
    const product = mockProducts.find(p => p.sku.toLowerCase() === barcodeInput.trim().toLowerCase());
    if (product) {
      addToCart(product);
      toast.success(`Added ${product.name} to cart`);
    } else {
      toast.error(`Product not found: ${barcodeInput}`);
    }
    setBarcodeInput('');
  };

  const handleHoldSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    const held: HeldSale = {
      id: `held-${Date.now()}`,
      cart: [...cart],
      customerName: 'Walk-in',
      heldAt: new Date().toISOString(),
      total: Math.round(total * 100) / 100,
    };
    setHeldSales(prev => [held, ...prev]);
    setCart([]);
    setDiscount(0);
    toast.success('Sale held! You can resume it later.');
  };

  const handleResumeSale = (held: HeldSale) => {
    if (cart.length > 0) {
      // Auto-hold current cart if not empty
      const autoHeld: HeldSale = {
        id: `held-${Date.now()}`,
        cart: [...cart],
        customerName: 'Walk-in',
        heldAt: new Date().toISOString(),
        total: Math.round(total * 100) / 100,
      };
      setHeldSales(prev => [autoHeld, ...prev]);
    }
    setCart(held.cart);
    setHeldSales(prev => prev.filter(h => h.id !== held.id));
    setHeldListOpen(false);
    toast.success('Sale resumed!');
  };

  const handleDeleteHeld = (id: string) => {
    setHeldSales(prev => prev.filter(h => h.id !== id));
    toast.success('Held sale discarded');
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
    const saleData = {
      items: [...cart],
      subtotal,
      discount: discountAmount,
      vat: Math.round(vat * 100) / 100,
      total: Math.round(total * 100) / 100,
      method: method?.label || 'Cash',
      time: new Date().toISOString(),
    };
    setLastSale(saleData);
    setReceiptOpen(true);
    toast.success(`Sale completed! NPR ${npr(saleData.total)} via ${saleData.method}`);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="POS Terminal"
        description="Process sales and accept payments"
      >
        <div className="flex items-center gap-2">
          {heldSales.length > 0 && (
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30" onClick={() => setHeldListOpen(true)}>
              <Pause className="h-3.5 w-3.5" />
              {heldSales.length} Held
            </Button>
          )}
          <Badge variant="outline" className="hidden sm:flex gap-1.5">
            <ShoppingCart className="h-3 w-3" />
            {cart.length} items · NPR {npr(total)}
          </Badge>
        </div>
      </PageHeader>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Today's Sales</p>
            <p className="text-sm font-bold">NPR {npr(35200)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Items Sold</p>
            <p className="text-sm font-bold">47</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Avg. Order</p>
            <p className="text-sm font-bold">NPR {npr(749)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Left: Products */}
        <div className="flex-1 space-y-4">
          {/* Search + Barcode */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative w-44 hidden sm:block">
              <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Scan barcode/PLU"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeScan()}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Pills */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="shrink-0"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.minStock;
              return (
                <Card
                  key={product.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                    isOutOfStock && 'cursor-not-allowed opacity-50',
                    isLowStock && !isOutOfStock && 'border-amber-400 dark:border-amber-600'
                  )}
                  onClick={() => !isOutOfStock && addToCart(product)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div className="text-sm font-medium leading-tight min-w-0">
                          {product.name}
                        </div>
                        {isLowStock && !isOutOfStock && (
                          <Badge variant="secondary" className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-1.5">
                            Low
                          </Badge>
                        )}
                      </div>
                      <div className="text-lg font-bold">NPR {npr(product.price)}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                        {!isOutOfStock ? (
                          <Button size="sm" className="h-7 text-xs gap-1">
                            <Plus className="h-3 w-3" /> Add
                          </Button>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">Out</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="w-full lg:w-[400px]">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                </CardTitle>
                {cart.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{cart.reduce((s, i) => s + i.quantity, 0)} items</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { setCart([]); setDiscount(0); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Cart Items */}
              <ScrollArea className="max-h-72">
                {cart.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 opacity-30" />
                    Cart is empty
                  </div>
                ) : (
                  <div className="space-y-2 pr-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 transition-colors hover:bg-muted">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-tight truncate">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">NPR {npr(item.product.price)} each</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="w-20 text-right text-sm font-semibold shrink-0">
                          NPR {npr(item.product.price * item.quantity)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Totals */}
              {cart.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>NPR {npr(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Discount</span>
                      <Input
                        type="number"
                        min={0}
                        value={discount || ''}
                        onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className="h-8 w-28 text-right"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (13%)</span>
                      <span>NPR {npr(Math.round(vat * 100) / 100)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>NPR {npr(Math.round(total * 100) / 100)}</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        return (
                          <Button
                            key={method.id}
                            variant={paymentMethod === method.id ? 'default' : 'outline'}
                            className={cn('h-10 justify-start gap-2 transition-all',
                              paymentMethod === method.id && 'shadow-sm'
                            )}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <Icon className="h-4 w-4" />
                            {method.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      onClick={handleHoldSale}
                    >
                      <Pause className="h-4 w-4" />
                      Hold
                    </Button>
                    <Button className="flex-[2] h-12 text-base font-semibold gap-2" onClick={handleCompleteSale}>
                      <Receipt className="h-5 w-5" />
                      Complete Sale
                    </Button>
                  </div>
                </>
              )}

              {/* Held Sales - Mobile Access */}
              {heldSales.length > 0 && cart.length === 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    onClick={() => setHeldListOpen(true)}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Resume Held Sale ({heldSales.length})
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Held Sales Dialog */}
      <Dialog open={heldListOpen} onOpenChange={setHeldListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pause className="h-5 w-5" />
              Held Sales ({heldSales.length})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-80">
            {heldSales.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No held sales
              </div>
            ) : (
              <div className="space-y-2">
                {heldSales.map((held) => (
                  <div key={held.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{held.cart.reduce((s, i) => s + i.quantity, 0)} items</div>
                      <div className="text-xs text-muted-foreground">
                        {held.cart.map(i => i.product.name).join(', ')}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">Held at {formatDateTime(held.heldAt)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold mr-1">NPR {npr(held.total)}</span>
                      <Button size="sm" className="h-7 gap-1" onClick={() => handleResumeSale(held)}>
                        <PlayCircle className="h-3.5 w-3.5" /> Resume
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteHeld(held.id)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Sale Receipt
            </DialogTitle>
          </DialogHeader>
          {lastSale && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
                <div className="text-center space-y-1">
                  <p className="font-bold text-base">ABC Store</p>
                  <p className="text-xs text-muted-foreground">Kathmandu, Nepal · PAN: 309876543</p>
                  <p className="text-xs text-muted-foreground">Tel: +977-9801234567</p>
                </div>
                <Separator />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDateTime(lastSale.time)}</span>
                  <span>{lastSale.method}</span>
                </div>
                <Separator />
                {/* Items */}
                <div className="space-y-1.5">
                  {lastSale.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="truncate block">{item.product.name}</span>
                        <span className="text-xs text-muted-foreground">{item.quantity} × NPR {npr(item.product.price)}</span>
                      </div>
                      <span className="font-medium shrink-0 ml-2">NPR {npr(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>NPR {npr(lastSale.subtotal)}</span>
                  </div>
                  {lastSale.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span>- NPR {npr(lastSale.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (13%)</span>
                    <span>NPR {npr(lastSale.vat)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>NPR {npr(lastSale.total)}</span>
                  </div>
                </div>
                <Separator />
                <div className="text-center text-xs text-muted-foreground pt-1">
                  Thank you for shopping with us!
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => setReceiptOpen(false)}>
                Close Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
