'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, ShoppingCart, Calendar, Download, Search, Eye, TrendingUp, Receipt, BarChart3 } from 'lucide-react';
import { mockSales, mockSalesReportData, mockInventoryReportData, mockVATReportData } from '@/lib/mock-data';
import { npr, nprFull, getStatusBadgeClasses, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Nepal Fiscal Year: Shrawan (mid-July) to Ashad (mid-July)
const FISCAL_YEARS = ['2081/82 BS','2080/81 BS','2079/80 BS'];

function getFiscalYearMonths(fy: string): { start: string; end: string } {
  // Simplified: map fiscal year to approximate Gregorian ranges
  const map: Record<string, { start: string; end: string }> = {
    '2081/82 BS': { start: '2024-07-16', end: '2025-07-15' },
    '2080/81 BS': { start: '2023-07-16', end: '2024-07-15' },
    '2079/80 BS': { start: '2022-07-16', end: '2023-07-15' },
  };
  return map[fy] || { start: '2024-01-01', end: '2024-12-31' };
}

export default function SalesReportsPage() {
  const [tab, setTab] = useState('sales');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateMode, setDateMode] = useState<'month' | 'custom' | 'fiscal'>('month');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2081/82 BS');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Date range helper
  const dateRange = useMemo(() => {
    if (dateMode === 'fiscal') return getFiscalYearMonths(fiscalYear);
    if (dateMode === 'custom' && dateFrom && dateTo) return { start: dateFrom, end: dateTo };
    if (dateMode === 'month') {
      const mi = MONTHS.indexOf(selectedMonth);
      return { start: `${selectedYear}-${String(mi + 1).padStart(2, '0')}-01`, end: `${selectedYear}-${String(mi + 1).padStart(2, '0')}-31` };
    }
    return { start: '2024-01-01', end: '2024-12-31' };
  }, [dateMode, selectedMonth, selectedYear, dateFrom, dateTo, fiscalYear]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return mockSales.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const d = s.date;
      const matchDate = d >= dateRange.start && d <= dateRange.end;
      return matchSearch && matchStatus && matchDate;
    });
  }, [search, statusFilter, dateRange]);

  // Summary stats
  const salesStats = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((s, sale) => s + sale.total, 0);
    const completed = filteredSales.filter(s => s.status === 'completed').length;
    const totalVAT = filteredSales.reduce((s, sale) => s + sale.vatAmount, 0);
    return { totalSales, totalRevenue, completed, totalVAT };
  }, [filteredSales]);

  // Filtered report data
  const filteredReportData = useMemo(() => {
    return mockSalesReportData.filter(r => r.date >= dateRange.start && r.date <= dateRange.end);
  }, [dateRange]);

  const filteredInvData = useMemo(() => mockInventoryReportData, []);
  const filteredVATData = useMemo(() => mockVATReportData, []);

  const exportCSV = () => {
    const headers = ['Invoice', 'Customer', 'Total', 'VAT', 'Status', 'Date'];
    const rows = filteredSales.map(s => [s.invoiceNumber, s.customerName, String(s.total), String(s.vatAmount), s.status, s.date]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sales-reports.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sales & Reports" description="View sales data and generate reports">
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
      </PageHeader>

      {/* Date Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label className="mb-1.5">Filter By</Label>
              <Select value={dateMode} onValueChange={v => setDateMode(v as 'month' | 'custom' | 'fiscal')}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="month">Month</SelectItem><SelectItem value="custom">Custom Date</SelectItem><SelectItem value="fiscal">Fiscal Year</SelectItem></SelectContent>
              </Select>
            </div>
            {dateMode === 'month' && (<>
              <div><Label className="mb-1.5">Month</Label><Select value={selectedMonth} onValueChange={setSelectedMonth}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="mb-1.5">Year</Label><Select value={selectedYear} onValueChange={setSelectedYear}><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2025">2025</SelectItem><SelectItem value="2024">2024</SelectItem></SelectContent></Select></div>
            </>)}
            {dateMode === 'custom' && (<>
              <div><Label className="mb-1.5">From</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-[160px]" /></div>
              <div><Label className="mb-1.5">To</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-[160px]" /></div>
            </>)}
            {dateMode === 'fiscal' && (<div><Label className="mb-1.5">Fiscal Year</Label><Select value={fiscalYear} onValueChange={setFiscalYear}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{FISCAL_YEARS.map(fy => <SelectItem key={fy} value={fy}>{fy}</SelectItem>)}</SelectContent></Select></div>)}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><ShoppingCart className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Sales</p><p className="text-2xl font-bold">{salesStats.totalSales}</p></div></CardContent></Card>
        <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div><div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold">NPR {npr(salesStats.totalRevenue)}</p></div></CardContent></Card>
        <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10"><TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" /></div><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{salesStats.completed}</p></div></CardContent></Card>
        <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10"><Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">VAT Collected</p><p className="text-2xl font-bold">NPR {npr(salesStats.totalVAT)}</p></div></CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="sales"><ShoppingCart className="h-4 w-4 mr-1.5" />Sales</TabsTrigger><TabsTrigger value="inventory"><BarChart3 className="h-4 w-4 mr-1.5" />Inventory</TabsTrigger><TabsTrigger value="vat"><Receipt className="h-4 w-4 mr-1.5" />VAT</TabsTrigger></TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="mt-4 space-y-4">
          <Card><CardContent className="flex flex-wrap items-end gap-3 p-4">
            <div className="flex-1" style={{ minWidth: '180px' }}><Label className="mb-1.5">Search</Label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div></div>
            <div><Label className="mb-1.5">Status</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent></Select></div>
          </CardContent></Card>
          <Card className="transition-shadow hover:shadow-md"><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="hover:bg-muted/50"><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead className="hidden md:table-cell">Items</TableHead><TableHead>Total</TableHead><TableHead className="hidden sm:table-cell">VAT</TableHead><TableHead>Status</TableHead><TableHead className="hidden lg:table-cell">Payment</TableHead><TableHead className="hidden lg:table-cell">Date</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{filteredSales.length === 0 ? <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No sales found.</TableCell></TableRow> : filteredSales.map(sale => (<TableRow key={sale.id} className="hover:bg-muted/50 transition-colors"><TableCell className="font-mono text-sm font-medium">{sale.invoiceNumber}</TableCell><TableCell className="font-medium">{sale.customerName}</TableCell><TableCell className="hidden md:table-cell text-muted-foreground">{sale.items.length}</TableCell><TableCell className="font-medium">NPR {npr(sale.total)}</TableCell><TableCell className="hidden sm:table-cell text-muted-foreground">NPR {npr(sale.vatAmount)}</TableCell><TableCell><Badge className={cn('capitalize', getStatusBadgeClasses(sale.status))}>{sale.status}</Badge></TableCell><TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{sale.paymentMethod}</TableCell><TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(sale.date)}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSale(sale)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Inventory Report Tab */}
        <TabsContent value="inventory" className="mt-4">
          <Card className="transition-shadow hover:shadow-md"><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="hover:bg-muted/50"><TableHead>Category</TableHead><TableHead>Total Products</TableHead><TableHead>Total Value</TableHead><TableHead>Low Stock</TableHead></TableRow></TableHeader><TableBody>{filteredInvData.map((r, i) => (<TableRow key={i} className="hover:bg-muted/50 transition-colors"><TableCell className="font-medium">{r.category}</TableCell><TableCell>{r.totalProducts}</TableCell><TableCell className="font-medium">NPR {npr(r.totalValue)}</TableCell><TableCell><Badge className={r.lowStock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}>{r.lowStock}</Badge></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* VAT Report Tab */}
        <TabsContent value="vat" className="mt-4">
          <Card className="transition-shadow hover:shadow-md"><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="hover:bg-muted/50"><TableHead>Month</TableHead><TableHead>Taxable Amount</TableHead><TableHead>VAT Collected (13%)</TableHead><TableHead>VAT Paid</TableHead><TableHead>Net VAT</TableHead></TableRow></TableHeader><TableBody>{filteredVATData.map((r, i) => {const net = r.vatCollected - r.vatPaid; return (<TableRow key={i} className="hover:bg-muted/50 transition-colors"><TableCell className="font-medium">{r.month}</TableCell><TableCell>NPR {npr(r.taxableAmount)}</TableCell><TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">NPR {npr(r.vatCollected)}</TableCell><TableCell className="text-red-600 dark:text-red-400">NPR {npr(r.vatPaid)}</TableCell><TableCell className={cn('font-medium', net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(net)}</TableCell></TableRow>);})}</TableBody></Table></div></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Sale Detail Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedSale && (<><DialogHeader><DialogTitle>Sale Details — {selectedSale.invoiceNumber}</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedSale.customerName}</p></div><div><p className="text-muted-foreground">Status</p><Badge className={cn('capitalize', getStatusBadgeClasses(selectedSale.status))}>{selectedSale.status}</Badge></div><div><p className="text-muted-foreground">Payment</p><p className="font-medium">{selectedSale.paymentMethod}</p></div><div><p className="text-muted-foreground">Date</p><p className="font-medium">{formatDate(selectedSale.date)}</p></div></div><div className="rounded-lg border p-3 space-y-1"><h4 className="text-sm font-semibold mb-2">Items</h4><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader><TableBody>{selectedSale.items.map((item, i) => (<TableRow key={i}><TableCell className="text-sm">{item.productName}</TableCell><TableCell className="text-right text-sm">{item.quantity}</TableCell><TableCell className="text-right text-sm">NPR {npr(item.unitPrice)}</TableCell><TableCell className="text-right text-sm font-medium">NPR {npr(item.total)}</TableCell></TableRow>))}</TableBody></Table></div><div className="space-y-1 text-sm text-right"><p>Subtotal: <span className="font-medium ml-2">NPR {npr(selectedSale.subtotal)}</span></p><p>Discount: <span className="text-red-500 ml-2">-NPR {npr(selectedSale.discount)}</span></p><p>VAT (13%): <span className="font-medium ml-2">NPR {npr(selectedSale.vatAmount)}</span></p><p className="text-base font-bold pt-1 border-t">Total: <span className="ml-2">NPR {nprFull(selectedSale.total)}</span></p></div></div></>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
