'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, X, ShoppingCart, Banknote, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { CartItem, Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'esewa', label: 'eSewa', icon: Smartphone },
  { id: 'khalti', label: 'Khalti', icon: Wallet },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export default function POSTerminal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cash');

  const activeProducts = mockProducts.filter((p) => p.isActive);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeProducts, searchQuery, selectedCategory]);

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

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    toast.success(`Sale completed! NPR ${npr(total)} via ${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}`);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Left Side: Products */}
      <div className="flex-1 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= product.minStock;
            return (
              <Card
                key={product.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  isOutOfStock && 'cursor-not-allowed opacity-50',
                  isLowStock && 'border-amber-400'
                )}
                onClick={() => !isOutOfStock && addToCart(product)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium leading-tight">{product.name}</div>
                    <div className="text-base font-bold">NPR {npr(product.price)}</div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {product.stock} {product.unit}
                    </div>
                    {isOutOfStock && (
                      <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                    )}
                    {isLowStock && (
                      <Badge className="bg-amber-100 text-amber-700" variant="secondary">
                        Low Stock
                      </Badge>
                    )}
                    {!isOutOfStock && (
                      <Button size="sm" className="h-8 w-full text-xs">
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right Side: Cart */}
      <div className="w-full lg:w-[380px]">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </CardTitle>
              {cart.length > 0 && (
                <Badge variant="secondary">{cart.length} items</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Cart Items */}
            <ScrollArea className="max-h-64">
              {cart.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  Cart is empty
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium leading-tight">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          NPR {npr(item.product.price)} each
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Quantity Controls per item */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <Separator />
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="flex-1 truncate pr-2">{item.product.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="w-20 text-right font-medium">
                        NPR {npr(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
                <Separator />
              </div>
            )}

            {/* Totals */}
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
                  className="h-8 w-24 text-right"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT (13%)</span>
                <span>NPR {npr(Math.round(vat * 100) / 100)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>NPR {npr(Math.round(total * 100) / 100)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Payment Method</div>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? 'default' : 'outline'}
                      className="h-10 justify-start gap-2"
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {method.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Complete Sale */}
            <Button className="h-12 w-full text-base font-semibold" onClick={handleCompleteSale}>
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
