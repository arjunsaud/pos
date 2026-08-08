'use client';

import { useState, useMemo, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Eye, Printer, Search, Minus, X } from 'lucide-react';
import { mockSales, mockProducts } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';
import { npr, getStatusBadgeClasses } from '@/lib/helpers';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

export default function BillingPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Create invoice state
  const [customerName, setCustomerName] = useState('');
  const [customerPAN, setCustomerPAN] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState('0');

  const resetCreateForm = useCallback(() => {
    setCustomerName('');
    setCustomerPAN('');
    setInvoiceItems([]);
    setProductSearch('');
    setPaymentMethod('Cash');
    setDiscount('0');
  }, []);

  const filteredProducts = useMemo(() => {
    const addedIds = new Set(invoiceItems.map((i) => i.productId));
    return mockProducts.filter(
      (p) =>
        p.isActive &&
        !addedIds.has(p.id) &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(productSearch.toLowerCase()))
    );
  }, [productSearch, invoiceItems]);

  const invoiceSubtotal = useMemo(
    () =>
      invoiceItems.reduce((sum, item) => {
        const product = mockProducts.find((p) => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [invoiceItems]
  );

  const discountAmount = Math.min(Number(discount) || 0, invoiceSubtotal);
  const vatAmount = ((invoiceSubtotal - discountAmount) * 13) / 100;
  const grandTotal = invoiceSubtotal - discountAmount + vatAmount;

  const handleCreateInvoice = useCallback(() => {
    if (invoiceItems.length === 0) {
      toast.error('Add at least one product to the invoice');
      return;
    }
    const nextNum = String(sales.length + 1).padStart(4, '0');
    const newSale: Sale = {
      id: `s-new-${Date.now()}`,
      invoiceNumber: `INV-2024-${nextNum}`,
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPAN: customerPAN.trim(),
      items: invoiceItems.map((item) => {
        const product = mockProducts.find((p) => p.id === item.productId)!;
        return {
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          total: product.price * item.quantity,
        };
      }),
      subtotal: invoiceSubtotal,
      discount: discountAmount,
      vatAmount,
      vatPercent: 13,
      total: grandTotal,
      paymentMethod,
      status: 'completed',
      date: new Date().toISOString(),
      staffName: 'Admin',
    };
    setSales((prev) => [newSale, ...prev]);
    resetCreateForm();
    setCreateOpen(false);
    setSelectedSale(newSale);
    toast.success('Invoice created successfully');
  }, [invoiceItems, sales.length, customerName, customerPAN, invoiceSubtotal, discountAmount, vatAmount, grandTotal, paymentMethod, resetCreateForm]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const saleDate = s.date.slice(0, 10);
      const matchesFrom = !dateFrom || saleDate >= dateFrom;
      const matchesTo = !dateTo || saleDate <= dateTo;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [sales, search, dateFrom, dateTo, statusFilter]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Invoices">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1" style={{ minWidth: '180px' }}>
              <Label className="mb-1.5">Search</Label>
              <Input
                placeholder="Invoice # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">VAT (13%)</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((sale) => (
                <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                  <TableCell>{fmtDate(sale.date)}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.customerPAN || '—'}</TableCell>
                  <TableCell className="text-center">{sale.items.length}</TableCell>
                  <TableCell className="text-right">NPR {npr(sale.subtotal)}</TableCell>
                  <TableCell className="text-right">NPR {npr(sale.vatAmount)}</TableCell>
                  <TableCell className="text-right font-semibold">NPR {npr(sale.total)}</TableCell>
                  <TableCell><Badge variant="outline">{sale.paymentMethod}</Badge></TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClasses(sale.status)} variant="secondary">
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedSale(sale)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="font-medium">Total Billed</TableCell>
                <TableCell className="text-right font-bold">NPR {npr(filtered.reduce((sum, s) => sum + s.total, 0))}</TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableFooter>
          </Table>
          </div>
          <div className="flex items-center justify-between pt-4 px-4">
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length > 0 ? ((page - 1) * ITEMS_PER_PAGE) + 1 : 0}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice View Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedSale?.invoiceNumber}</DialogTitle>
            <DialogDescription>Invoice details</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              {/* Store Header */}
              <div className="text-center">
                <div className="text-xl font-bold">ABC Store</div>
                <div className="text-sm text-muted-foreground">Kathmandu, Nepal</div>
                <div className="text-sm text-muted-foreground">PAN: 309876543 | Phone: +977-9801234567</div>
              </div>

              {/* Invoice Info */}
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">Customer</div>
                  <div>{selectedSale.customerName}</div>
                  {selectedSale.customerPAN && <div>PAN: {selectedSale.customerPAN}</div>}
                </div>
                <div className="text-right">
                  <div className="font-medium">Invoice #</div>
                  <div>{selectedSale.invoiceNumber}</div>
                  <div className="font-medium mt-1">Date</div>
                  <div>{new Date(selectedSale.date).toLocaleString('en-GB')}</div>
                </div>
              </div>

              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">NPR {npr(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="ml-auto w-64 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>NPR {npr(selectedSale.subtotal)}</span></div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>- NPR {npr(selectedSale.discount)}</span></div>
                )}
                <div className="flex justify-between"><span>VAT (13%)</span><span>NPR {npr(selectedSale.vatAmount)}</span></div>
                <div className="flex justify-between border-t pt-1 text-base font-bold"><span>Grand Total</span><span>NPR {npr(selectedSale.total)}</span></div>
                <div className="mt-1 flex justify-between text-muted-foreground"><span>Payment</span><span>{selectedSale.paymentMethod}</span></div>
              </div>

              <DialogFooter>
                <Button onClick={() => toast.success('Print sent to printer')}>
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { resetCreateForm(); } setCreateOpen(open); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Add products and complete the invoice</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Customer Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Customer Name</Label>
                <Input
                  placeholder="Walk-in Customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer PAN (optional)</Label>
                <Input
                  placeholder="e.g., 301234567"
                  value={customerPAN}
                  onChange={(e) => setCustomerPAN(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Product Search & Selection */}
            <div className="grid gap-2">
              <Label>Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              {productSearch && filteredProducts.length > 0 && (
                <ScrollArea className="max-h-48 rounded-md border">
                  <div className="p-2 grid gap-1">
                    {filteredProducts.slice(0, 8).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-left"
                        onClick={() => {
                          setInvoiceItems((prev) => [...prev, { productId: p.id, quantity: 1 }]);
                          setProductSearch('');
                        }}
                      >
                        <div>
                          <span className="font-medium">{p.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{p.sku}</span>
                        </div>
                        <span className="text-sm font-semibold">NPR {npr(p.price)}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {productSearch && filteredProducts.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No products found.</p>
              )}
            </div>

            {/* Selected Items */}
            {invoiceItems.length > 0 && (
              <div className="grid gap-2">
                <Label>Invoice Items</Label>
                <div className="rounded-md border">
                  <ScrollArea className="max-h-52">
                    <div className="p-2 grid gap-2">
                      {invoiceItems.map((item) => {
                        const product = mockProducts.find((p) => p.id === item.productId)!;
                        return (
                          <div key={item.productId} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{product.name}</div>
                              <div className="text-xs text-muted-foreground">NPR {npr(product.price)} × {item.quantity} = NPR {npr(product.price * item.quantity)}</div>
                            </div>
                            <div className="flex items-center gap-1 ml-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setInvoiceItems((prev) =>
                                      prev.map((i) =>
                                        i.productId === item.productId ? { ...i, quantity: i.quantity - 1 } : i
                                      )
                                    );
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setInvoiceItems((prev) =>
                                    prev.map((i) =>
                                      i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
                                    )
                                  );
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600"
                                onClick={() => {
                                  setInvoiceItems((prev) => prev.filter((i) => i.productId !== item.productId));
                                }}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}

            <Separator />

            {/* Payment & Discount */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="eSewa">eSewa</SelectItem>
                    <SelectItem value="Khalti">Khalti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Discount (NPR)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>

            {/* Totals Summary */}
            {invoiceItems.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>NPR {npr(invoiceSubtotal)}</span></div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>- NPR {npr(discountAmount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">VAT (13%)</span><span>NPR {npr(vatAmount)}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>Grand Total</span><span>NPR {npr(grandTotal)}</span></div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetCreateForm(); setCreateOpen(false); }}>Cancel</Button>
            <Button onClick={handleCreateInvoice} disabled={invoiceItems.length === 0}>
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
