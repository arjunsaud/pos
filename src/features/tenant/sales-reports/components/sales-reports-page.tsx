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
import {
  DollarSign, ShoppingCart, Calendar, Download, Search, Eye,
  TrendingUp, TrendingDown, Receipt, BarChart3, FileText, Printer,
} from 'lucide-react';
import { PieChart as PieChartIcon, Package, AlertTriangle, Archive } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import {
  mockSales, mockSalesReportData, mockInventoryReportData,
  mockVATReportData, mockProfitLossData, mockProducts,
} from '@/lib/mock-data';
import { npr, nprFull, getStatusBadgeClasses, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Nepal Fiscal Year: Shrawan (mid-July) to Ashad (mid-July)
const FISCAL_YEARS = ['2081/82 BS','2080/81 BS','2079/80 BS'];

// Pie chart colors
const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

function getFiscalYearMonths(fy: string): { start: string; end: string } {
  const map: Record<string, { start: string; end: string }> = {
    '2081/82 BS': { start: '2024-07-16', end: '2025-07-15' },
    '2080/81 BS': { start: '2023-07-16', end: '2024-07-15' },
    '2079/80 BS': { start: '2022-07-16', end: '2023-07-15' },
  };
  return map[fy] || { start: '2024-01-01', end: '2024-12-31' };
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const mi = parseInt(month, 10) - 1;
  return `${MONTHS[mi]} ${year}`;
}

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV exported successfully');
}

// Recharts tooltip that formats values as NPR
function NprTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: NPR {npr(entry.value)}
        </p>
      ))}
    </div>
  );
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

  // ---- Profit & Loss computed data ----
  const plData = useMemo(() => {
    return mockProfitLossData.map(d => ({
      ...d,
      label: formatMonthLabel(d.month),
      margin: d.revenue > 0 ? ((d.netProfit / d.revenue) * 100).toFixed(1) : '0.0',
    }));
  }, []);

  const plSummary = useMemo(() => {
    const totalRevenue = plData.reduce((s, d) => s + d.revenue, 0);
    const totalCOGS = plData.reduce((s, d) => s + d.costOfGoods, 0);
    const grossProfit = plData.reduce((s, d) => s + d.grossProfit, 0);
    const netProfit = plData.reduce((s, d) => s + d.netProfit, 0);
    return { totalRevenue, totalCOGS, grossProfit, netProfit };
  }, [plData]);

  // ---- Inventory computed data ----
  const invSummary = useMemo(() => {
    const totalProducts = filteredInvData.reduce((s, d) => s + d.totalProducts, 0);
    const totalStockValue = filteredInvData.reduce((s, d) => s + d.totalValue, 0);
    const lowStockItems = filteredInvData.reduce((s, d) => s + d.lowStock, 0);
    const deadStock = mockProducts.filter(p => p.stock === 0 && p.isActive).length;
    return { totalProducts, totalStockValue, lowStockItems, deadStock };
  }, [filteredInvData]);

  const invPieData = useMemo(() => {
    return filteredInvData.map(d => ({
      name: d.category,
      value: d.totalValue,
    }));
  }, [filteredInvData]);

  // ---- VAT computed data ----
  const vatData = useMemo(() => {
    return filteredVATData.map(d => ({
      ...d,
      label: formatMonthLabel(d.month),
      netPayable: d.vatCollected - d.vatPaid,
    }));
  }, [filteredVATData]);

  const vatSummary = useMemo(() => {
    const totalCollected = vatData.reduce((s, d) => s + d.vatCollected, 0);
    const totalPaid = vatData.reduce((s, d) => s + d.vatPaid, 0);
    const netPayable = totalCollected - totalPaid;
    const firstMonth = vatData.length > 0 ? formatMonthLabel(vatData[0].month) : '';
    const lastMonth = vatData.length > 0 ? formatMonthLabel(vatData[vatData.length - 1].month) : '';
    const filingPeriod = vatData.length > 0 ? `${firstMonth} – ${lastMonth}` : 'N/A';
    return { totalCollected, totalPaid, netPayable, filingPeriod };
  }, [vatData]);

  // ---- Export handlers ----
  const exportSalesCSV = () => {
    const headers = ['Invoice', 'Customer', 'Total', 'VAT', 'Status', 'Date'];
    const rows = filteredSales.map(s => [s.invoiceNumber, s.customerName, String(s.total), String(s.vatAmount), s.status, s.date]);
    downloadCSV('sales-reports.csv', headers, rows);
  };

  const exportPDF = () => {
    window.print();
    toast.info('Print dialog opened for PDF export');
  };

  const exportPLCSV = () => {
    const headers = ['Month', 'Revenue', 'COGS', 'Gross Profit', 'Expenses', 'Net Profit', 'Margin %'];
    const rows = plData.map(d => [d.label, String(d.revenue), String(d.costOfGoods), String(d.grossProfit), String(d.expenses), String(d.netProfit), d.margin]);
    downloadCSV('profit-loss-report.csv', headers, rows);
  };

  const exportInvCSV = () => {
    const headers = ['Category', 'Products Count', 'Total Value', 'Low Stock Count', 'Status'];
    const rows = filteredInvData.map(d => {
      const status = d.lowStock > 0 ? 'Attention Needed' : 'Healthy';
      return [d.category, String(d.totalProducts), String(d.totalValue), String(d.lowStock), status];
    });
    downloadCSV('inventory-report.csv', headers, rows);
  };

  const exportVATCSV = () => {
    const headers = ['Month', 'Taxable Amount', 'VAT Collected (13%)', 'VAT Paid', 'Net Payable'];
    const rows = vatData.map(d => [d.label, String(d.taxableAmount), String(d.vatCollected), String(d.vatPaid), String(d.netPayable)]);
    downloadCSV('vat-report.csv', headers, rows);
  };

  // Custom pie chart label
  const renderPieLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sales & Reports" description="View sales data and generate reports">
        <div className="flex items-center gap-2">
          {tab === 'sales' && (
            <>
              <Button variant="outline" size="sm" onClick={exportSalesCSV}><Download className="h-4 w-4 mr-1.5" />Export CSV</Button>
              <Button variant="outline" size="sm" onClick={exportPDF}><Printer className="h-4 w-4 mr-1.5" />Export PDF</Button>
            </>
          )}
          {tab === 'pnl' && (
            <>
              <Button variant="outline" size="sm" onClick={exportPLCSV}><Download className="h-4 w-4 mr-1.5" />Export CSV</Button>
              <Button variant="outline" size="sm" onClick={exportPDF}><Printer className="h-4 w-4 mr-1.5" />Export PDF</Button>
            </>
          )}
          {tab === 'inventory' && (
            <>
              <Button variant="outline" size="sm" onClick={exportInvCSV}><Download className="h-4 w-4 mr-1.5" />Export CSV</Button>
              <Button variant="outline" size="sm" onClick={exportPDF}><Printer className="h-4 w-4 mr-1.5" />Export PDF</Button>
            </>
          )}
          {tab === 'vat' && (
            <>
              <Button variant="outline" size="sm" onClick={exportVATCSV}><Download className="h-4 w-4 mr-1.5" />Export CSV</Button>
              <Button variant="outline" size="sm" onClick={exportPDF}><Printer className="h-4 w-4 mr-1.5" />Export PDF</Button>
            </>
          )}
        </div>
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

      {/* ========== TABS ========== */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="sales"><ShoppingCart className="h-4 w-4 mr-1.5" />Sales</TabsTrigger>
          <TabsTrigger value="pnl"><TrendingUp className="h-4 w-4 mr-1.5" />Profit & Loss</TabsTrigger>
          <TabsTrigger value="inventory"><PieChartIcon className="h-4 w-4 mr-1.5" />Inventory</TabsTrigger>
          <TabsTrigger value="vat"><FileText className="h-4 w-4 mr-1.5" />VAT</TabsTrigger>
        </TabsList>

        {/* ==================== SALES TAB ==================== */}
        <TabsContent value="sales" className="mt-4 space-y-4">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><ShoppingCart className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Sales</p><p className="text-2xl font-bold">{salesStats.totalSales}</p></div></CardContent></Card>
            <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div><div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold">NPR {npr(salesStats.totalRevenue)}</p></div></CardContent></Card>
            <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10"><TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" /></div><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{salesStats.completed}</p></div></CardContent></Card>
            <Card className="transition-shadow hover:shadow-md"><CardContent className="flex items-center gap-4 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10"><Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">VAT Collected</p><p className="text-2xl font-bold">NPR {npr(salesStats.totalVAT)}</p></div></CardContent></Card>
          </div>

          {/* Search + Status Filter */}
          <Card><CardContent className="flex flex-wrap items-end gap-3 p-4">
            <div className="flex-1" style={{ minWidth: '180px' }}><Label className="mb-1.5">Search</Label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div></div>
            <div><Label className="mb-1.5">Status</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent></Select></div>
          </CardContent></Card>

          {/* Sales Table */}
          <Card className="transition-shadow hover:shadow-md"><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="hover:bg-muted/50"><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead className="hidden md:table-cell">Items</TableHead><TableHead>Total</TableHead><TableHead className="hidden sm:table-cell">VAT</TableHead><TableHead>Status</TableHead><TableHead className="hidden lg:table-cell">Payment</TableHead><TableHead className="hidden lg:table-cell">Date</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{filteredSales.length === 0 ? <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No sales found.</TableCell></TableRow> : filteredSales.map(sale => (<TableRow key={sale.id} className="hover:bg-muted/50 transition-colors"><TableCell className="font-mono text-sm font-medium">{sale.invoiceNumber}</TableCell><TableCell className="font-medium">{sale.customerName}</TableCell><TableCell className="hidden md:table-cell text-muted-foreground">{sale.items.length}</TableCell><TableCell className="font-medium">NPR {npr(sale.total)}</TableCell><TableCell className="hidden sm:table-cell text-muted-foreground">NPR {npr(sale.vatAmount)}</TableCell><TableCell><Badge className={cn('capitalize', getStatusBadgeClasses(sale.status))}>{sale.status}</Badge></TableCell><TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{sale.paymentMethod}</TableCell><TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(sale.date)}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSale(sale)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* ==================== PROFIT & LOSS TAB ==================== */}
        <TabsContent value="pnl" className="mt-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">NPR {npr(plSummary.totalRevenue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total COGS</p>
                  <p className="text-2xl font-bold">NPR {npr(plSummary.totalCOGS)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                  <BarChart3 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Profit</p>
                  <p className="text-2xl font-bold">NPR {npr(plSummary.grossProfit)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">NPR {npr(plSummary.netProfit)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Revenue vs COGS vs Net Profit</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<NprTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="costOfGoods" name="COGS" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netProfit" name="Net Profit" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* P&L Table */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Monthly Breakdown</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">COGS</TableHead>
                      <TableHead className="text-right">Gross Profit</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Expenses</TableHead>
                      <TableHead className="text-right">Net Profit</TableHead>
                      <TableHead className="text-right">Margin %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plData.map((d) => {
                      const marginNum = parseFloat(d.margin);
                      return (
                        <TableRow key={d.month} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{d.label}</TableCell>
                          <TableCell className="text-right">NPR {npr(d.revenue)}</TableCell>
                          <TableCell className="text-right text-red-600 dark:text-red-400">NPR {npr(d.costOfGoods)}</TableCell>
                          <TableCell className="text-right font-medium">NPR {npr(d.grossProfit)}</TableCell>
                          <TableCell className="hidden md:table-cell text-right text-muted-foreground">NPR {npr(d.expenses)}</TableCell>
                          <TableCell className={cn('text-right font-medium', d.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(d.netProfit)}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={cn(marginNum >= 20 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : marginNum >= 10 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
                              {d.margin}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Totals row */}
                    <TableRow className="border-t-2 font-semibold bg-muted/30">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">NPR {npr(plSummary.totalRevenue)}</TableCell>
                      <TableCell className="text-right text-red-600 dark:text-red-400">NPR {npr(plSummary.totalCOGS)}</TableCell>
                      <TableCell className="text-right">NPR {npr(plSummary.grossProfit)}</TableCell>
                      <TableCell className="hidden md:table-cell text-right text-muted-foreground">NPR {npr(plData.reduce((s, d) => s + d.expenses, 0))}</TableCell>
                      <TableCell className={cn('text-right', plSummary.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(plSummary.netProfit)}</TableCell>
                      <TableCell className="text-right">{plSummary.totalRevenue > 0 ? ((plSummary.netProfit / plSummary.totalRevenue) * 100).toFixed(1) : 0}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== INVENTORY REPORT TAB ==================== */}
        <TabsContent value="inventory" className="mt-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{invSummary.totalProducts}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold">NPR {npr(invSummary.totalStockValue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold">{invSummary.lowStockItems}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                  <Archive className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dead Stock</p>
                  <p className="text-2xl font-bold">{invSummary.deadStock}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Stock Value by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      label={renderPieLabel}
                      labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                    >
                      {invPieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`NPR ${npr(value)}`, '']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Inventory by Category</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Products Count</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right">Low Stock Count</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvData.map((r, i) => {
                      const isAttention = r.lowStock > 0;
                      return (
                        <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{r.category}</TableCell>
                          <TableCell className="text-right">{r.totalProducts}</TableCell>
                          <TableCell className="text-right font-medium">NPR {npr(r.totalValue)}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={r.lowStock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}>
                              {r.lowStock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={isAttention ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}>
                              {isAttention ? 'Attention Needed' : 'Healthy'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Totals row */}
                    <TableRow className="border-t-2 font-semibold bg-muted/30">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{invSummary.totalProducts}</TableCell>
                      <TableCell className="text-right">NPR {npr(invSummary.totalStockValue)}</TableCell>
                      <TableCell className="text-right">{invSummary.lowStockItems}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== VAT REPORT TAB ==================== */}
        <TabsContent value="vat" className="mt-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total VAT Collected</p>
                  <p className="text-2xl font-bold">NPR {npr(vatSummary.totalCollected)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total VAT Paid</p>
                  <p className="text-2xl font-bold">NPR {npr(vatSummary.totalPaid)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net VAT Payable</p>
                  <p className={cn('text-2xl font-bold', vatSummary.netPayable >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(vatSummary.netPayable)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                  <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filing Period</p>
                  <p className="text-lg font-bold">{vatSummary.filingPeriod}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Chart */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">VAT Collected vs VAT Paid</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vatData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<NprTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="vatCollected" name="VAT Collected" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="vatPaid" name="VAT Paid" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* VAT Table */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">VAT Monthly Details</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Taxable Amount</TableHead>
                      <TableHead className="text-right">VAT Collected (13%)</TableHead>
                      <TableHead className="text-right">VAT Paid</TableHead>
                      <TableHead className="text-right">Net Payable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatData.map((d) => (
                      <TableRow key={d.month} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{d.label}</TableCell>
                        <TableCell className="text-right">NPR {npr(d.taxableAmount)}</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-medium">NPR {npr(d.vatCollected)}</TableCell>
                        <TableCell className="text-right text-red-600 dark:text-red-400">NPR {npr(d.vatPaid)}</TableCell>
                        <TableCell className={cn('text-right font-medium', d.netPayable >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(d.netPayable)}</TableCell>
                      </TableRow>
                    ))}
                    {/* Totals row */}
                    <TableRow className="border-t-2 font-semibold bg-muted/30">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">NPR {npr(vatData.reduce((s, d) => s + d.taxableAmount, 0))}</TableCell>
                      <TableCell className="text-right text-emerald-600 dark:text-emerald-400">NPR {npr(vatSummary.totalCollected)}</TableCell>
                      <TableCell className="text-right text-red-600 dark:text-red-400">NPR {npr(vatSummary.totalPaid)}</TableCell>
                      <TableCell className={cn('text-right', vatSummary.netPayable >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>NPR {npr(vatSummary.netPayable)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
