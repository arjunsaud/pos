'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, ChevronLeft, ChevronRight, ShoppingCart, DollarSign, TrendingUp, RotateCcw, Printer, FileText } from 'lucide-react';
import { mockSales } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';
import { cn } from '@/lib/utils';
import { npr, nprFull, getStatusBadgeClasses } from '@/lib/helpers';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB');
const formatDate = (d: Date) => d.toISOString().slice(0, 10);
const ITEMS_PER_PAGE = 5;

const DATE_PRESETS = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month'] as const;

function getPaymentMethodColor(method: string): string {
  switch (method) {
    case 'Cash': return 'bg-emerald-500';
    case 'Card': return 'bg-blue-500';
    case 'eSewa': return 'bg-green-500';
    case 'Khalti': return 'bg-purple-500';
    default: return 'bg-gray-400';
  }
}

export default function SalesPage() {
  const [sales] = useState<Sale[]>(mockSales);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePreset, setDatePreset] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = sales.filter((s) => {
      const matchesSearch =
        s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || s.paymentMethod === paymentFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const saleDate = s.date.slice(0, 10);
      const matchesFrom = !dateFrom || saleDate >= dateFrom;
      const matchesTo = !dateTo || saleDate <= dateTo;
      return matchesSearch && matchesPayment && matchesStatus && matchesFrom && matchesTo;
    });
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else cmp = a.total - b.total;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [sales, search, dateFrom, dateTo, paymentFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalSales = filtered.reduce((sum, s) => sum + s.total, 0);

  // Quick stats - computed from all sales (unfiltered) for today
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySales = useMemo(() => {
    const today = sales.filter((s) => s.date.slice(0, 10) === todayStr && s.status === 'completed');
    const count = today.length;
    const revenue = today.reduce((sum, s) => sum + s.total, 0);
    const refunds = sales.filter((s) => s.date.slice(0, 10) === todayStr && s.status === 'refunded').length;
    const avg = count > 0 ? revenue / count : 0;
    return { count, revenue, avg, refunds };
  }, [sales, todayStr]);

  const applyPreset = (preset: string) => {
    const today = new Date();
    const from = new Date();
    if (preset === 'Today') {
      // from is already today
    } else if (preset === 'Last 7 Days') {
      from.setDate(from.getDate() - 6);
    } else if (preset === 'Last 30 Days') {
      from.setDate(from.getDate() - 29);
    } else if (preset === 'This Month') {
      from.setDate(1);
    }
    setDateFrom(formatDate(from));
    setDateTo(formatDate(today));
    setDatePreset(preset);
    setPage(1);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setDatePreset('');
    setPage(1);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setDatePreset('');
    setPage(1);
  };

  const handleSort = (field: 'date' | 'total') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };
  const sortIcon = (field: 'date' | 'total') => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕';

  const exportCSV = () => {
    const headers = ['Invoice #', 'Date', 'Customer', 'PAN', 'Items', 'Subtotal', 'VAT', 'Total', 'Payment', 'Status'];
    const rows = filtered.map(s => [
      s.invoiceNumber,
      s.date,
      s.customerName,
      s.customerPAN,
      String(s.items.length),
      String(s.subtotal),
      String(s.vatAmount),
      String(s.total),
      s.paymentMethod,
      s.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sales-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sales History">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </PageHeader>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded-lg bg-emerald-500/10 p-1.5">
                <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Today&apos;s Sales</span>
                <span className="font-semibold">{todaySales.count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded-lg bg-blue-500/10 p-1.5">
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Today&apos;s Revenue</span>
                <span className="font-semibold">NPR {npr(todaySales.revenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded-lg bg-purple-500/10 p-1.5">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Avg Order Value</span>
                <span className="font-semibold">NPR {npr(todaySales.avg)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded-lg bg-amber-500/10 p-1.5">
                <RotateCcw className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Refunds</span>
                <span className="font-semibold">{todaySales.refunds}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {DATE_PRESETS.map((preset) => (
              <Button
                key={preset}
                variant={datePreset === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
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
            <Input type="date" value={dateFrom} onChange={(e) => handleDateFromChange(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">To</Label>
            <Input type="date" value={dateTo} onChange={(e) => handleDateToChange(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Payment</Label>
            <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="eSewa">eSewa</SelectItem>
                <SelectItem value="Khalti">Khalti</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
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
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('date')}>Date <span className="ml-1 text-[10px] opacity-60">{sortIcon('date')}</span></TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort('total')}>Total <span className="ml-1 text-[10px] opacity-60">{sortIcon('total')}</span></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((sale) => (
                <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(sale.date)}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell className="text-center">{sale.items.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('inline-block h-[3px] w-[3px] rounded-full', getPaymentMethodColor(sale.paymentMethod))} />
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClasses(sale.status)} variant="secondary">
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">NPR {nprFull(sale.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSale(sale)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="font-medium">Total Sales</TableCell>
                <TableCell className="text-right font-bold">NPR {nprFull(totalSales)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedSale && (
            <div className="space-y-5">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold tracking-wide">INVOICE</span>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{selectedSale.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeClasses(selectedSale.status)} variant="secondary">
                    {selectedSale.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <span className={cn('inline-block h-2 w-2 rounded-full', getPaymentMethodColor(selectedSale.paymentMethod))} />
                    {selectedSale.paymentMethod}
                  </Badge>
                </div>
              </div>

              <Separator className="border-dashed" />

              {/* Customer & Sale Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Bill To */}
                <div className="space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Bill To</p>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">{selectedSale.customerName}</p>
                    {selectedSale.customerPAN && (
                      <p className="text-xs text-muted-foreground">PAN: <span className="font-mono">{selectedSale.customerPAN}</span></p>
                    )}
                    <p className="text-xs text-muted-foreground italic">Kathmandu, Nepal</p>
                  </div>
                </div>
                {/* Right: Invoice Details */}
                <div className="space-y-2 text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Invoice Details</p>
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{new Date(selectedSale.date).toLocaleString('en-GB')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Staff</p>
                      <p className="text-sm font-medium">{selectedSale.staffName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Payment Method</p>
                      <p className="text-sm font-medium">{selectedSale.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item, idx) => (
                    <TableRow key={idx} className={cn(idx % 2 === 0 && 'bg-muted/30')}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">NPR {nprFull(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-mono font-medium">NPR {nprFull(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals Section */}
              <div className="ml-auto w-64 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">NPR {nprFull(selectedSale.subtotal)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-mono">- NPR {nprFull(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT 13%</span>
                  <span className="font-mono">NPR {nprFull(selectedSale.vatAmount)}</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted/50 px-3 py-2 font-bold">
                  <span>Total</span>
                  <span className="font-mono">NPR {nprFull(selectedSale.total)}</span>
                </div>
              </div>

              <Separator className="border-dashed" />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Thank you for your business!</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5" />
                    Print Receipt
                  </Button>
                  <Button variant="default" size="sm" onClick={() => setSelectedSale(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
