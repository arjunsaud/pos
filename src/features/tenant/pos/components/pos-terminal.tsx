'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Search, Plus, Minus, X, ShoppingCart, Banknote, CreditCard, Smartphone, Wallet, Receipt, Barcode, Trash2, TrendingUp, Clock, Pause, PlayCircle, Users, Printer } from 'lucide-react';
import { mockProducts, mockCategories, mockCustomers } from '@/lib/mock-data';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import type { CartItem, Product, HeldSale, Customer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDateTime, npr, nprFull } from '@/lib/helpers';
import { useAuthStore } from '@/features/auth/store';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' },
  { id: 'esewa', label: 'eSewa', icon: Smartphone, color: 'text-green-600 dark:text-green-400' },
  { id: 'khalti', label: 'Khalti', icon: Wallet, color: 'text-purple-600 dark:text-purple-400' },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export default function POSTerminal() {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cash');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState<{ items: CartItem[]; subtotal: number; discount: number; vat: number; total: number; method: string; time: string } | null>(null);
  const [receiptNumber, setReceiptNumber] = useState(0);
  // Hold/Resume state
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [heldListOpen, setHeldListOpen] = useState(false);
  // Customer selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [isCartPulsing, setIsCartPulsing] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return mockCustomers;
    const q = customerSearch.toLowerCase();
    return mockCustomers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [customerSearch]);

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
    setIsCartPulsing(true);
    setTimeout(() => setIsCartPulsing(false), 600);
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
    setReceiptNumber(Math.floor(100000 + Math.random() * 900000));
    setReceiptOpen(true);
    toast.success(`Sale completed! NPR ${npr(saleData.total)} via ${saleData.method}${selectedCustomer ? ` for ${selectedCustomer.name}` : ''}`);
    setCart([]);
    setDiscount(0);
    setCartSheetOpen(false);
  };

  const handlePrintReceipt = useCallback(() => {
    if (!lastSale) return;
    const receiptEl = document.getElementById('pos-receipt');
    if (!receiptEl) return;
    const printWin = window.open('', '_blank', 'width=400,height=600');
    if (!printWin) return;
    const cashierName = user?.name || 'Admin';
    printWin.document.write(`<!DOCTYPE html><html><head><title>Receipt</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; max-width: 320px; margin: 0 auto; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .muted { color: #666; }
        .row { display: flex; justify-content: space-between; padding: 2px 0; }
        .dashed { border-top: 1px dashed #999; margin: 8px 0; }
        .item { display: flex; justify-content: space-between; padding: 3px 0; }
        .item-detail { color: #666; font-size: 11px; }
        .total { font-size: 14px; font-weight: bold; padding: 4px 0; }
        .footer { text-align: center; margin-top: 12px; color: #666; font-size: 11px; }
        .receipt-num { font-size: 11px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="center">
        <p class="bold" style="font-size:16px;">ABC Store</p>
        <p class="muted">Kathmandu, Nepal &middot; PAN: 309876543</p>
        <p class="muted">Tel: +977-9801234567</p>
      </div>
      <div class="dashed"></div>
      <div class="row"><span class="muted">Receipt #</span><span>${String(receiptNumber).padStart(6, '0')}</span></div>
      <div class="row"><span class="muted">Cashier</span><span>${cashierName}</span></div>
      <div class="row"><span class="muted">Customer</span><span>${selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span></div>
      ${selectedCustomer?.pan ? `<div class="row"><span class="muted">PAN</span><span>${selectedCustomer.pan}</span></div>` : ''}
      <div class="row"><span class="muted">${formatDateTime(lastSale.time)}</span><span>${lastSale.method}</span></div>
      <div class="dashed"></div>
      ${lastSale.items.map(item => `
        <div class="item"><span>${item.product.name}</span><span>NPR ${npr(item.product.price * item.quantity)}</span></div>
        <div class="item-detail">${item.quantity} &times; NPR ${npr(item.product.price)}</div>
      `).join('')}
      <div class="dashed"></div>
      <div class="row"><span class="muted">Subtotal</span><span>NPR ${npr(lastSale.subtotal)}</span></div>
      ${lastSale.discount > 0 ? `<div class="row"><span>Discount</span><span>- NPR ${npr(lastSale.discount)}</span></div>` : ''}
      <div class="row"><span class="muted">VAT (13%)</span><span>NPR ${nprFull(lastSale.vat)}</span></div>
      <div class="dashed"></div>
      <div class="row total"><span>TOTAL</span><span>NPR ${nprFull(lastSale.total)}</span></div>
      <div class="dashed"></div>
      <p class="footer">Thank you for shopping with us!</p>
      </body></html>`);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  }, [lastSale, receiptNumber, user, selectedCustomer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeRef.current?.focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (receiptOpen) {
          setReceiptOpen(false);
        } else if (heldListOpen) {
          setHeldListOpen(false);
        } else if (cart.length > 0) {
          setCart([]);
          setDiscount(0);
          toast.success('Cart cleared');
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
      if (e.key === 'F9' && cart.length > 0 && !receiptOpen && !heldListOpen) {
        e.preventDefault();
        handleCompleteSale();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cart, receiptOpen, heldListOpen, searchQuery, handleCompleteSale]);

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <PageHeader
        title="POS Terminal"
        description="Process sales and accept payments"
      >
        <div className="flex items-center gap-2">
          {heldSales.length > 0 && (
            <Button variant="outline" size="sm" className="flex gap-1.5 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30" onClick={() => setHeldListOpen(true)}>
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative sm:w-44">
              <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={barcodeRef}
                placeholder="Scan barcode/PLU"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeScan()}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="w-full overflow-x-auto no-scrollbar">
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
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden md:flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">F2</kbd> Barcode</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">F9</kbd> Checkout</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5"><kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">Esc</kbd> Clear</span>
          </div>
        </div>

        {/* Right: Cart */}
        <div className="hidden md:block w-full lg:w-[400px]">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </CardTitle>
                  {/* Customer Selection */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => { setShowCustomerDropdown(!showCustomerDropdown); setCustomerSearch(''); }}
                    >
                      <Users className="h-3 w-3" />
                      {selectedCustomer ? selectedCustomer.name : 'Walk-in'}
                    </Button>
                    {showCustomerDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowCustomerDropdown(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-lg border bg-popover p-2 shadow-md">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search by name or phone..."
                              value={customerSearch}
                              onChange={(e) => setCustomerSearch(e.target.value)}
                              className="h-8 pl-8 text-xs"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto mt-1">
                            {filteredCustomers.length === 0 ? (
                              <div className="px-2 py-3 text-center text-xs text-muted-foreground">No customers found</div>
                            ) : (
                              filteredCustomers.map((customer) => (
                                <div
                                  key={customer.id}
                                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-accent cursor-pointer transition-colors"
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setShowCustomerDropdown(false);
                                    setCustomerSearch('');
                                  }}
                                >
                                  <div className="min-w-0">
                                    <div className="text-xs font-medium truncate">{customer.name}</div>
                                    <div className="text-[11px] text-muted-foreground">{customer.phone}</div>
                                  </div>
                                  {customer.pan && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0 ml-1">PAN</Badge>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                          <Separator className="my-1" />
                          <div
                            className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-accent cursor-pointer transition-colors text-muted-foreground"
                            onClick={() => {
                              setSelectedCustomer(null);
                              setShowCustomerDropdown(false);
                              setCustomerSearch('');
                            }}
                          >
                            <span className="text-xs">Clear (Walk-in Customer)</span>
                            <X className="h-3 w-3" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
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
                  <div className="space-y-0 pr-3">
                    {cart.map((item, idx) => {
                      const isLowStock = item.product.stock > 0 && item.product.stock <= item.product.minStock;
                      return (
                        <div
                          key={item.product.id}
                          className={cn(
                            'flex items-center gap-2 py-2.5 px-2 rounded-lg bg-muted/50 transition-colors hover:bg-muted border-b last:border-b-0',
                            idx === 0 && 'rounded-t-lg',
                            idx === cart.length - 1 && 'rounded-b-lg'
                          )}
                        >
                          <div className={cn('w-0.5 h-8 rounded-full shrink-0', isLowStock ? 'bg-amber-400 dark:bg-amber-500' : 'bg-emerald-400 dark:bg-emerald-500')} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium leading-tight truncate">{item.product.name}</div>
                            <div className="text-xs text-muted-foreground">NPR {npr(item.product.price)} each</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-lg border-border/60"
                              onClick={() => updateQuantity(item.product.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-lg border-border/60"
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
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Totals */}
              {cart.length > 0 && (
                <>
                  <Separator />
                  <div className="bg-gradient-to-b from-muted/50 to-transparent rounded-t-xl -mx-1 px-3 pt-4 pb-3">
                    <div className="space-y-2.5 text-sm">
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
                        <span>NPR {nprFull(vat)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-baseline pt-0.5">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-lg font-bold animate-gentle-pulse">NPR {nprFull(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.id;
                        const txCounts: Record<string, number> = { cash: 28, card: 12, esewa: 7, khalti: 3 };
                        const borderColor = method.id === 'cash' ? 'border-b-emerald-500' : method.id === 'card' ? 'border-b-blue-500' : method.id === 'esewa' ? 'border-b-green-500' : 'border-b-purple-500';
                        return (
                          <Button
                            key={method.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              'h-10 justify-start gap-2 transition-all relative overflow-hidden',
                              isSelected && cn('shadow-sm border-b-[3px]', borderColor)
                            )}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1 text-left">{method.label}</span>
                            <span className="text-[10px] opacity-70">{txCounts[method.id]} today</span>
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
                    <Button className="flex-[2] h-12 text-base font-semibold gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600" onClick={handleCompleteSale}>
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

      {/* Mobile Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 z-30 md:hidden">
          <Button
            className={cn(
              'w-full h-14 justify-between px-4 shadow-2xl rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white',
              isCartPulsing && 'animate-cart-pulse'
            )}
            onClick={() => setCartSheetOpen(true)}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">View Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </span>
            <span className="font-bold text-lg">NPR {npr(total)}</span>
          </Button>
        </div>
      )}

      {/* Mobile Cart Sheet */}
      <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md gap-0 p-0 flex flex-col">
          <SheetHeader className="border-b px-4 py-3 shrink-0">
            <div className="flex items-center justify-between pr-8">
              <SheetTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {cart.length > 0 && (
                  <Badge variant="secondary">{cart.reduce((s, i) => s + i.quantity, 0)} items</Badge>
                )}
              </SheetTitle>
              {cart.length > 0 && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { setCart([]); setDiscount(0); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {/* Customer Selection - Mobile */}
            <div className="relative mt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs w-full justify-start"
                onClick={() => { setShowCustomerDropdown(!showCustomerDropdown); setCustomerSearch(''); }}
              >
                <Users className="h-3 w-3" />
                {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
              </Button>
              {showCustomerDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCustomerDropdown(false)} />
                  <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-lg border bg-popover p-2 shadow-md">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="h-8 pl-8 text-xs"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto mt-1">
                      {filteredCustomers.length === 0 ? (
                        <div className="px-2 py-3 text-center text-xs text-muted-foreground">No customers found</div>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerDropdown(false);
                              setCustomerSearch('');
                            }}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">{customer.name}</div>
                              <div className="text-[11px] text-muted-foreground">{customer.phone}</div>
                            </div>
                            {customer.pan && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0 ml-1">PAN</Badge>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <Separator className="my-1" />
                    <div
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-accent cursor-pointer transition-colors text-muted-foreground"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setShowCustomerDropdown(false);
                        setCustomerSearch('');
                      }}
                    >
                      <span className="text-xs">Clear (Walk-in Customer)</span>
                      <X className="h-3 w-3" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetHeader>

          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {cart.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="h-10 w-10 opacity-20" />
                Cart is empty
              </div>
            ) : (
              <div className="space-y-0">
                {cart.map((item, idx) => {
                  const isLowStock = item.product.stock > 0 && item.product.stock <= item.product.minStock;
                  return (
                    <div
                      key={item.product.id}
                      className={cn(
                        'flex items-center gap-2 py-3 px-2 rounded-lg bg-muted/50 transition-colors hover:bg-muted border-b last:border-b-0',
                        idx === 0 && 'rounded-t-lg',
                        idx === cart.length - 1 && 'rounded-b-lg'
                      )}
                    >
                      <div className={cn('w-0.5 h-8 rounded-full shrink-0', isLowStock ? 'bg-amber-400 dark:bg-amber-500' : 'bg-emerald-400 dark:bg-emerald-500')} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium leading-tight truncate">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">NPR {npr(item.product.price)} each</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg border-border/60"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg border-border/60"
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
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Held Sales - Mobile */}
            {heldSales.length > 0 && cart.length === 0 && (
              <>
                <Separator className="my-3" />
                <Button
                  variant="outline"
                  className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  onClick={() => { setCartSheetOpen(false); setHeldListOpen(true); }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Resume Held Sale ({heldSales.length})
                </Button>
              </>
            )}
          </div>

          {/* Sticky Bottom: Totals + Payment + Actions */}
          {cart.length > 0 && (
            <div className="border-t bg-background p-4 space-y-3 shrink-0">
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
                  <span>NPR {nprFull(vat)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline pt-0.5">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold animate-gentle-pulse">NPR {nprFull(total)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</div>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    const txCounts: Record<string, number> = { cash: 28, card: 12, esewa: 7, khalti: 3 };
                    const borderColor = method.id === 'cash' ? 'border-b-emerald-500' : method.id === 'card' ? 'border-b-blue-500' : method.id === 'esewa' ? 'border-b-green-500' : 'border-b-purple-500';
                    return (
                      <Button
                        key={method.id}
                        variant={isSelected ? 'default' : 'outline'}
                        className={cn(
                          'h-10 justify-start gap-2 transition-all relative overflow-hidden',
                          isSelected && cn('shadow-sm border-b-[3px]', borderColor)
                        )}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{method.label}</span>
                        <span className="text-[10px] opacity-70">{txCounts[method.id]} today</span>
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
                <Button
                  className="flex-[2] h-12 text-base font-semibold gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                  onClick={handleCompleteSale}
                >
                  <Receipt className="h-5 w-5" />
                  Complete Sale
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
              <div id="pos-receipt" className="rounded-lg bg-stone-50 dark:bg-stone-900/30 p-4 space-y-3 text-sm">
                <div className="text-center space-y-1">
                  <p className="font-bold text-base">ABC Store</p>
                  <p className="text-xs text-muted-foreground">Kathmandu, Nepal · PAN: 309876543</p>
                  <p className="text-xs text-muted-foreground">Tel: +977-9801234567</p>
                </div>
                <div className="border-t border-dashed" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Receipt #</span>
                  <span className="font-medium">{String(receiptNumber).padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cashier</span>
                  <span className="font-medium">{user?.name || 'Admin'}</span>
                </div>
                {/* Customer Info */}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span>
                </div>
                {selectedCustomer?.pan && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">PAN</span>
                    <span>{selectedCustomer.pan}</span>
                  </div>
                )}
                <div className="border-t border-dashed" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDateTime(lastSale.time)}</span>
                  <span>{lastSale.method}</span>
                </div>
                <div className="border-t border-dashed" />
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
                <div className="border-t border-dashed" />
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
                    <span>NPR {nprFull(lastSale.vat)}</span>
                  </div>
                  <div className="border-t border-dashed" />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>NPR {nprFull(lastSale.total)}</span>
                  </div>
                </div>
                <div className="border-t border-dashed" />
                <div className="text-center text-xs text-muted-foreground pt-1">
                  Thank you for shopping with us!
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" variant="outline" onClick={handlePrintReceipt}>
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
                <Button className="flex-1" onClick={() => setReceiptOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
