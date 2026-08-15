'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Plus, Eye, Printer, Search, Minus, X,
  RotateCcw, CheckCircle, XCircle, AlertTriangle, FileText,
} from 'lucide-react';
import { useSales, useProducts, useReturnRefunds } from '@/hooks/use-api-data';
import { toast } from 'sonner';
import type { Sale, ReturnRefund, ReturnStatus } from '@/lib/types';
import { npr, nprFull, getStatusBadgeClasses } from '@/lib/helpers';
import { useAuthStore } from '@/features/auth/store';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

const STORE_PAN = '309876543';
const STORE_ADDRESS = 'Kathmandu, Nepal';

// Return status badge classes
function getReturnStatusBadgeClasses(status: ReturnStatus): string {
  switch (status) {
    case 'requested': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'approved': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    default: return 'bg-muted text-muted-foreground';
  }
}

export default function BillingPage() {
  const mockSales = useSales().items;
  const mockProducts = useProducts().items;
  const mockReturnRefunds = useReturnRefunds().items;
  const user = useAuthStore((s) => s.user);
  const storeInfo = { name: user?.tenantName || 'Store', phone: '' };

  const [activeTab, setActiveTab] = useState('invoices');

  // --- Invoices state ---
  const [sales, setSales] = useState<Sale[]>(mockSales);
  useEffect(() => {
    setSales(mockSales);
  }, [mockSales]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [printSale, setPrintSale] = useState<Sale | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Create invoice state
  const [customerName, setCustomerName] = useState('');
  const [customerPAN, setCustomerPAN] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState('0');

  // --- Returns state ---
  const [returns, setReturns] = useState<ReturnRefund[]>(mockReturnRefunds);
  useEffect(() => {
    setReturns(mockReturnRefunds);
  }, [mockReturnRefunds]);
  const [returnSearch, setReturnSearch] = useState('');
  const [returnStatusFilter, setReturnStatusFilter] = useState<string>('all');
  const [viewReturn, setViewReturn] = useState<ReturnRefund | null>(null);
  const [processReturn, setProcessReturn] = useState<ReturnRefund | null>(null);
  const [processRefundMethod, setProcessRefundMethod] = useState('Cash');
  const [returnPage, setReturnPage] = useState(1);

  // Print invoice ref
  const printRef = useRef<HTMLDivElement>(null);

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

  // --- Invoices filtering ---
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

  // --- Returns filtering ---
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      const matchesSearch =
        r.returnNumber.toLowerCase().includes(returnSearch.toLowerCase()) ||
        r.customerName.toLowerCase().includes(returnSearch.toLowerCase()) ||
        r.invoiceNumber.toLowerCase().includes(returnSearch.toLowerCase());
      const matchesStatus = returnStatusFilter === 'all' || r.status === returnStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [returns, returnSearch, returnStatusFilter]);

  const RETURN_PER_PAGE = 10;
  const returnTotalPages = Math.ceil(filteredReturns.length / RETURN_PER_PAGE);
  const pagedReturns = filteredReturns.slice((returnPage - 1) * RETURN_PER_PAGE, returnPage * RETURN_PER_PAGE);

  // Return summary stats
  const returnStats = useMemo(() => ({
    total: returns.length,
    pending: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    totalRefunded: returns.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.refundAmount, 0),
  }), [returns]);

  // --- Print handler ---
  const handlePrint = useCallback(() => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${printSale?.invoiceNumber || ''}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #111; }
                .invoice-container { max-width: 700px; margin: 0 auto; }
                .store-header { text-align: center; margin-bottom: 24px; }
                .store-name { font-size: 24px; font-weight: 700; }
                .store-info { font-size: 13px; color: #555; margin-top: 2px; }
                .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
                .invoice-meta div { line-height: 1.6; }
                .meta-label { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
                th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
                th { background: #f5f5f5; font-weight: 600; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .totals { width: 260px; margin-left: auto; margin-bottom: 20px; font-size: 14px; }
                .totals .row { display: flex; justify-content: space-between; padding: 3px 0; }
                .totals .grand { border-top: 2px solid #111; padding-top: 6px; font-weight: 700; font-size: 16px; }
                .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px dashed #aaa; font-size: 14px; color: #555; }
                .payment-info { font-size: 13px; color: #666; margin-top: 8px; }
                hr { border: none; border-top: 1px solid #eee; margin: 16px 0; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  }, [printSale]);

  // --- Process return handler ---
  const handleProcessReturn = useCallback(() => {
    if (!processReturn) return;
    setReturns(prev => prev.map(r => {
      if (r.id === processReturn.id) {
        return {
          ...r,
          status: 'completed' as const,
          refundMethod: processRefundMethod,
          processedBy: 'Admin',
          processedAt: new Date().toISOString(),
        };
      }
      return r;
    }));
    toast.success(`Return ${processReturn.returnNumber} processed successfully. Refund of NPR ${nprFull(processReturn.refundAmount)} via ${processRefundMethod}.`);
    setProcessReturn(null);
    setProcessRefundMethod('Cash');
  }, [processReturn, processRefundMethod]);

  // --- Reject return handler ---
  const handleRejectReturn = useCallback(() => {
    if (!processReturn) return;
    setReturns(prev => prev.map(r => {
      if (r.id === processReturn.id) {
        return {
          ...r,
          status: 'rejected' as const,
          processedBy: 'Admin',
          processedAt: new Date().toISOString(),
        };
      }
      return r;
    }));
    toast.error(`Return ${processReturn.returnNumber} has been rejected.`);
    setProcessReturn(null);
  }, [processReturn]);

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Invoices">
        <Button onClick={() => { setActiveTab('invoices'); setCreateOpen(true); }}>
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invoices">
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="returns">
            <RotateCcw className="h-4 w-4" />
            Returns & Refunds
          </TabsTrigger>
        </TabsList>

        {/* ============ INVOICES TAB ============ */}
        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1" style={{ minWidth: '180px' }}>
                  <Label className="mb-1.5">Search</Label>
                  <Input
                    placeholder="Invoice # or customer..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">From</Label>
                  <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
                </div>
                <div>
                  <Label className="mb-1.5">To</Label>
                  <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
                </div>
                <div>
                  <Label className="mb-1.5">Status</Label>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
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
              {/* Visual Summary Strip */}
              <div className="flex items-center justify-center divide-x divide-border border-b">
                <div className="flex-1 flex flex-col items-center gap-0.5 bg-muted/30 py-3 px-4">
                  <span className="text-xs text-muted-foreground">Total Invoices</span>
                  <span className="text-sm font-semibold">{filtered.length}</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 bg-muted/30 py-3 px-4">
                  <span className="text-xs text-muted-foreground">Total Value</span>
                  <span className="text-sm font-semibold">NPR {nprFull(filtered.reduce((sum, s) => sum + s.total, 0))}</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 bg-muted/30 py-3 px-4">
                  <span className="text-xs text-muted-foreground">Pending</span>
                  <span className="text-sm font-semibold">{filtered.filter(s => s.status === 'pending').length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">PAN</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Subtotal</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">VAT (13%)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((sale) => (
                    <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                      <TableCell>{fmtDate(sale.date)}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell className="hidden md:table-cell">{sale.customerPAN || '—'}</TableCell>
                      <TableCell className="text-center">{sale.items.length}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">NPR {npr(sale.subtotal)}</TableCell>
                      <TableCell className="text-right hidden lg:table-cell">NPR {nprFull(sale.vatAmount)}</TableCell>
                      <TableCell className="text-right font-semibold">NPR {nprFull(sale.total)}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="outline">{sale.paymentMethod}</Badge></TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClasses(sale.status)} variant="secondary">
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View" onClick={() => setSelectedSale(sale)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Print Invoice" onClick={() => setPrintSale(sale)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7} className="font-medium">Total Billed</TableCell>
                    <TableCell className="text-right font-bold">NPR {nprFull(filtered.reduce((sum, s) => sum + s.total, 0))}</TableCell>
                    <TableCell colSpan={4} />
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
        </TabsContent>

        {/* ============ RETURNS & REFUNDS TAB ============ */}
        <TabsContent value="returns" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Returns</p>
                  <p className="text-2xl font-bold">{returnStats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending Returns</p>
                  <p className="text-2xl font-bold">{returnStats.pending}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{returnStats.approved}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Refunded</p>
                  <p className="text-2xl font-bold">NPR {nprFull(returnStats.totalRefunded)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1" style={{ minWidth: '180px' }}>
                  <Label className="mb-1.5">Search</Label>
                  <Input
                    placeholder="Return #, invoice #, or customer..."
                    value={returnSearch}
                    onChange={(e) => { setReturnSearch(e.target.value); setReturnPage(1); }}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Status</Label>
                  <Select value={returnStatusFilter} onValueChange={(v) => { setReturnStatusFilter(v); setReturnPage(1); }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns Table */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return #</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">Items</TableHead>
                      <TableHead className="text-right">Refund Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedReturns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                          <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          No returns found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedReturns.map((ret) => (
                        <TableRow key={ret.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                          <TableCell>{ret.invoiceNumber}</TableCell>
                          <TableCell>{ret.customerName}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            <Badge variant="outline">{ret.items.length}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">NPR {nprFull(ret.refundAmount)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{ret.refundMethod}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getReturnStatusBadgeClasses(ret.status)} variant="secondary">
                              {ret.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{fmtDate(ret.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title="View" onClick={() => setViewReturn(ret)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(ret.status === 'requested' || ret.status === 'approved') && (
                                <Button variant="ghost" size="icon" title="Process" onClick={() => {
                                  setProcessReturn(ret);
                                  setProcessRefundMethod(ret.refundMethod);
                                }}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredReturns.length > RETURN_PER_PAGE && (
                <div className="flex items-center justify-between pt-4 px-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((returnPage - 1) * RETURN_PER_PAGE) + 1}-{Math.min(returnPage * RETURN_PER_PAGE, filteredReturns.length)} of {filteredReturns.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setReturnPage(p => Math.max(1, p - 1))} disabled={returnPage === 1}>Previous</Button>
                    <span className="text-sm font-medium">{returnPage} / {returnTotalPages || 1}</span>
                    <Button variant="outline" size="sm" onClick={() => setReturnPage(p => Math.min(returnTotalPages, p + 1))} disabled={returnPage >= returnTotalPages}>Next</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ INVOICE VIEW DIALOG ============ */}
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
                <div className="text-xl font-bold">{storeInfo.name}</div>
                <div className="text-sm text-muted-foreground">{STORE_ADDRESS}</div>
                <div className="text-sm text-muted-foreground">PAN: {STORE_PAN} | Phone: {storeInfo.phone}</div>
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
                <div className="flex justify-between"><span>VAT (13%)</span><span>NPR {nprFull(selectedSale.vatAmount)}</span></div>
                <div className="flex justify-between border-t pt-1 text-base font-bold"><span>Grand Total</span><span>NPR {nprFull(selectedSale.total)}</span></div>
                <div className="mt-1 flex justify-between text-muted-foreground"><span>Payment</span><span>{selectedSale.paymentMethod}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Staff</span><span>{selectedSale.staffName}</span></div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setSelectedSale(null); setPrintSale(selectedSale); }}>
                  <Printer className="h-4 w-4" /> Print Invoice
                </Button>
                <Button onClick={() => setSelectedSale(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ PRINT INVOICE DIALOG ============ */}
      <Dialog open={!!printSale} onOpenChange={(open) => !open && setPrintSale(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Invoice
            </DialogTitle>
            <DialogDescription>Review and print the invoice</DialogDescription>
          </DialogHeader>
          {printSale && (
            <div className="space-y-4">
              <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
                <div ref={printRef}>
                  {/* Store Header */}
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold">{storeInfo.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{STORE_ADDRESS}</div>
                    <div className="text-sm text-muted-foreground">PAN: {STORE_PAN} | Phone: {storeInfo.phone}</div>
                  </div>

                  <Separator />

                  {/* Invoice Info */}
                  <div className="flex justify-between text-sm mt-4 mb-6">
                    <div>
                      <div className="font-medium text-base">Customer</div>
                      <div className="mt-1">{printSale.customerName}</div>
                      {printSale.customerPAN && <div className="mt-0.5">PAN: {printSale.customerPAN}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-base">Invoice Details</div>
                      <div className="mt-1">Invoice #: {printSale.invoiceNumber}</div>
                      <div className="mt-0.5">Date: {new Date(printSale.date).toLocaleString('en-GB')}</div>
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
                      {printSale.items.map((item, idx) => (
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
                  <div className="ml-auto w-72 space-y-2 text-sm mt-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>NPR {npr(printSale.subtotal)}</span>
                    </div>
                    {printSale.discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount</span>
                        <span>- NPR {npr(printSale.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (13%)</span>
                      <span>NPR {nprFull(printSale.vatAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total</span>
                      <span>NPR {nprFull(printSale.total)}</span>
                    </div>
                  </div>

                  {/* Payment & Staff */}
                  <div className="text-sm text-muted-foreground space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="font-medium text-foreground">{printSale.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Served By</span>
                      <span className="font-medium text-foreground">{printSale.staffName}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Footer */}
                  <div className="text-center py-4">
                    <p className="text-base font-medium text-muted-foreground">Thank you for your purchase!</p>
                    {storeInfo.name} &bull; {STORE_ADDRESS}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPrintSale(null)}>Cancel</Button>
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ CREATE INVOICE DIALOG ============ */}
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
                <div className="flex justify-between"><span className="text-muted-foreground">VAT (13%)</span><span>NPR {nprFull(vatAmount)}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>Grand Total</span><span>NPR {nprFull(grandTotal)}</span></div>
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

      {/* ============ VIEW RETURN DIALOG ============ */}
      <Dialog open={!!viewReturn} onOpenChange={(open) => !open && setViewReturn(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Return {viewReturn?.returnNumber}
            </DialogTitle>
            <DialogDescription>Return details</DialogDescription>
          </DialogHeader>
          {viewReturn && (
            <div className="space-y-4">
              {/* Return Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Invoice #</div>
                  <div className="font-medium">{viewReturn.invoiceNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Customer</div>
                  <div className="font-medium">{viewReturn.customerName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <Badge className={getReturnStatusBadgeClasses(viewReturn.status)} variant="secondary">
                    {viewReturn.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Refund Amount</div>
                  <div className="font-semibold text-base">NPR {nprFull(viewReturn.refundAmount)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Refund Method</div>
                  <div className="font-medium">{viewReturn.refundMethod}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date Requested</div>
                  <div className="font-medium">{new Date(viewReturn.createdAt).toLocaleString('en-GB')}</div>
                </div>
                {viewReturn.processedBy && (
                  <div>
                    <div className="text-muted-foreground">Processed By</div>
                    <div className="font-medium">{viewReturn.processedBy}</div>
                  </div>
                )}
                {viewReturn.processedAt && (
                  <div>
                    <div className="text-muted-foreground">Processed At</div>
                    <div className="font-medium">{new Date(viewReturn.processedAt).toLocaleString('en-GB')}</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Reason */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Return Reason</div>
                <div className="text-sm bg-muted/50 rounded-md p-3">{viewReturn.reason}</div>
              </div>

              <Separator />

              {/* Returned Items */}
              <div>
                <div className="text-sm font-medium mb-2">Returned Items</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="hidden sm:table-cell">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewReturn.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">NPR {npr(item.total)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{item.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                {(viewReturn.status === 'requested' || viewReturn.status === 'approved') && (
                  <Button onClick={() => { setViewReturn(null); setProcessReturn(viewReturn); setProcessRefundMethod(viewReturn.refundMethod); }}>
                    <CheckCircle className="h-4 w-4" /> Process Return
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewReturn(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ PROCESS RETURN DIALOG ============ */}
      <Dialog open={!!processReturn} onOpenChange={(open) => !open && setProcessReturn(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Process Return
            </DialogTitle>
            <DialogDescription>
              Confirm the refund for {processReturn?.returnNumber}
            </DialogDescription>
          </DialogHeader>
          {processReturn && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return #</span>
                  <span className="font-medium">{processReturn.returnNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice #</span>
                  <span className="font-medium">{processReturn.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{processReturn.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{processReturn.items.length} item(s)</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Refund Amount</span>
                  <span>NPR {nprFull(processReturn.refundAmount)}</span>
                </div>
              </div>

              {/* Items Preview */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Items to Refund</Label>
                <div className="space-y-2">
                  {processReturn.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm rounded-md border px-3 py-2">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                      </div>
                      <span className="font-medium">NPR {npr(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Method */}
              <div className="grid gap-2">
                <Label>Refund Method</Label>
                <Select value={processRefundMethod} onValueChange={setProcessRefundMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="eSewa">eSewa</SelectItem>
                    <SelectItem value="Khalti">Khalti</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" className="text-red-500 hover:text-red-600" onClick={handleRejectReturn}>
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button onClick={handleProcessReturn}>
                  <CheckCircle className="h-4 w-4" /> Confirm Refund
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
