'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import {
  mockSalesReportData,
  mockInventoryReportData,
  mockVATReportData,
} from '@/lib/mock-data';
import { npr } from '@/lib/helpers';
import type { ChartConfig } from '@/components/ui/chart';

const salesChartConfig: ChartConfig = {
  sales: { label: 'Sales (NPR)', color: 'hsl(var(--chart-1))' },
};

const inventoryChartConfig: ChartConfig = {
  totalValue: { label: 'Stock Value (NPR)', color: 'hsl(var(--chart-2))' },
};

const vatChartConfig: ChartConfig = {
  vatCollected: { label: 'VAT Collected', color: 'hsl(var(--chart-1))' },
  vatPaid: { label: 'VAT Paid', color: 'hsl(var(--chart-3))' },
};

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter sales report data by date range (mock filter - slice)
  const filteredSalesData = useMemo(() => {
    if (!dateFrom && !dateTo) return mockSalesReportData;
    const sorted = [...mockSalesReportData].sort((a, b) => a.date.localeCompare(b.date));
    const fromIdx = dateFrom ? sorted.findIndex((d) => d.date >= dateFrom) : 0;
    const toIdx = dateTo ? sorted.findLastIndex((d) => d.date <= dateTo) : sorted.length - 1;
    if (fromIdx < 0 || toIdx < 0 || fromIdx > toIdx) return [];
    return sorted.slice(fromIdx, toIdx + 1);
  }, [dateFrom, dateTo]);

  // Sales Report calculations
  const salesData = filteredSalesData.map((d) => ({
    date: d.date.slice(5),
    sales: d.sales,
  }));
  const totalRevenue = filteredSalesData.reduce((sum, d) => sum + d.sales, 0);
  const avgDailySales = filteredSalesData.length > 0 ? Math.round(totalRevenue / filteredSalesData.length) : 0;
  const totalOrders = filteredSalesData.reduce((sum, d) => sum + d.orders, 0);
  const bestDay = filteredSalesData.reduce(
    (best, d) => (d.sales > best.sales ? d : best),
    { date: '—', sales: 0, orders: 0 }
  );

  // VAT Report calculations
  const vatTableData = mockVATReportData.map((d) => ({
    ...d,
    netVAT: d.vatCollected - d.vatPaid,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" />

      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="mb-1.5">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="vat">VAT Report</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={`NPR ${npr(totalRevenue)}`} icon={DollarSign} />
            <StatCard title="Avg Daily Sales" value={`NPR ${npr(avgDailySales)}`} icon={TrendingUp} />
            <StatCard title="Total Orders" value={npr(totalOrders)} icon={ShoppingCart} />
            <StatCard
              title="Best Day"
              value={`NPR ${npr(bestDay.sales)}`}
              icon={Calendar}
              description={bestDay.date}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
                <BarChart data={mockInventoryReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalValue" fill="var(--color-totalValue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-center">Low Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventoryReportData.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-center">{row.totalProducts}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.totalValue)}</TableCell>
                      <TableCell className="text-center">
                        {row.lowStock > 0 ? (
                          <span className="text-amber-600 font-medium">{row.lowStock}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Report */}
        <TabsContent value="vat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VAT Collected vs VAT Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={vatChartConfig} className="h-[300px] w-full">
                <BarChart data={mockVATReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="vatCollected" fill="var(--color-vatCollected)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vatPaid" fill="var(--color-vatPaid)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Taxable Amount</TableHead>
                    <TableHead className="text-right">VAT Collected</TableHead>
                    <TableHead className="text-right">VAT Paid</TableHead>
                    <TableHead className="text-right">Net VAT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vatTableData.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.taxableAmount)}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.vatCollected)}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.vatPaid)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        NPR {npr(row.netVAT)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
