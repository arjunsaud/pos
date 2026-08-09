'use client';

import { useMemo } from 'react';
import { Store, DollarSign, ShoppingCart, TrendingUp, Receipt } from 'lucide-react';
import { nprFull, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockSalesReportData, mockInventoryReportData, mockVATReportData, mockSales } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function TenantBanner({ name }: { name: string }) {
  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
      <Store className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">Viewing data for: <span className="font-bold text-primary">{name}</span></span>
    </div>
  );
}

function NoTenantSelected() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Store className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-semibold">No Tenant Selected</h3>
      <p className="mt-1 text-sm text-muted-foreground">Please select a tenant from the sidebar dropdown to view their data.</p>
    </div>
  );
}

export default function SATenantReports() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const stats = useMemo(() => {
    const totalRevenue = mockSalesReportData.reduce((a, d) => a + d.sales, 0);
    const totalOrders = mockSalesReportData.reduce((a, d) => a + d.orders, 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalVAT = mockSales.filter(s => s.status === 'completed').reduce((a, s) => a + s.vatAmount, 0);
    return { totalRevenue, totalOrders, avgOrder, totalVAT };
  }, []);

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Data summaries for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: nprFull(stats.totalRevenue), icon: DollarSign, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-600 dark:text-sky-400' },
          { label: 'Avg Order Value', value: nprFull(stats.avgOrder), icon: TrendingUp, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'VAT Collected', value: nprFull(stats.totalVAT), icon: Receipt, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
        ].map(s => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn('rounded-lg p-3', s.color)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Summary</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Summary</TabsTrigger>
          <TabsTrigger value="vat">VAT Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Sales (NPR)</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Avg per Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSalesReportData.map(d => (
                      <TableRow key={d.date} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{formatDate(d.date)}</TableCell>
                        <TableCell className="text-right">{nprFull(d.sales)}</TableCell>
                        <TableCell className="text-right">{d.orders}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{nprFull(d.orders > 0 ? d.sales / d.orders : 0)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{nprFull(stats.totalRevenue)}</TableCell>
                      <TableCell className="text-right">{stats.totalOrders}</TableCell>
                      <TableCell className="text-right">{nprFull(stats.avgOrder)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="text-right">Total Value (NPR)</TableHead>
                      <TableHead className="text-right">Low Stock Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryReportData.map(d => (
                      <TableRow key={d.category} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{d.category}</TableCell>
                        <TableCell className="text-right">{d.totalProducts}</TableCell>
                        <TableCell className="text-right">{nprFull(d.totalValue)}</TableCell>
                        <TableCell className="text-right">
                          {d.lowStock > 0 && <span className="text-amber-600 font-medium">{d.lowStock}</span>}
                          {d.lowStock === 0 && <span className="text-emerald-600">0</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{mockInventoryReportData.reduce((a, d) => a + d.totalProducts, 0)}</TableCell>
                      <TableCell className="text-right">{nprFull(mockInventoryReportData.reduce((a, d) => a + d.totalValue, 0))}</TableCell>
                      <TableCell className="text-right">{mockInventoryReportData.reduce((a, d) => a + d.lowStock, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vat" className="mt-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Taxable Amount (NPR)</TableHead>
                      <TableHead className="text-right">VAT Collected (NPR)</TableHead>
                      <TableHead className="text-right">VAT Paid (NPR)</TableHead>
                      <TableHead className="text-right">Net VAT (NPR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVATReportData.map(d => {
                      const net = d.vatCollected - d.vatPaid;
                      return (
                        <TableRow key={d.month} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">{d.month}</TableCell>
                          <TableCell className="text-right">{nprFull(d.taxableAmount)}</TableCell>
                          <TableCell className="text-right">{nprFull(d.vatCollected)}</TableCell>
                          <TableCell className="text-right">{nprFull(d.vatPaid)}</TableCell>
                          <TableCell className={cn('text-right font-medium', net >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                            {net >= 0 ? '+' : ''}{nprFull(net)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{nprFull(mockVATReportData.reduce((a, d) => a + d.taxableAmount, 0))}</TableCell>
                      <TableCell className="text-right">{nprFull(mockVATReportData.reduce((a, d) => a + d.vatCollected, 0))}</TableCell>
                      <TableCell className="text-right">{nprFull(mockVATReportData.reduce((a, d) => a + d.vatPaid, 0))}</TableCell>
                      <TableCell className="text-right">
                        {nprFull(mockVATReportData.reduce((a, d) => a + d.vatCollected - d.vatPaid, 0))}
                      </TableCell>
                    </TableRow>
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
