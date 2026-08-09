'use client';

import { useMemo } from 'react';
import { Store, Package, DollarSign, Users, CreditCard, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { npr, nprFull, formatDate, getStatusBadgeClasses, getPlanBadgeClasses, getStockBadgeClasses, getStockStatus } from '@/lib/helpers';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockProducts, mockInventory, mockSales, mockTenantStaff, mockSubscriptions, mockPackages } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

export default function SATenantOverview() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const plan = useMemo(() => mockPackages.find(p => p.name === tenant?.plan), [tenant?.plan]);
  const activeSub = useMemo(() => mockSubscriptions.find(s => s.tenantId === tenant?.id && s.status === 'active'), [tenant?.id]);
  const recentSales = useMemo(() => [...mockSales].reverse().slice(0, 5), []);
  const lowStockItems = useMemo(() => mockInventory.filter(i => i.currentStock <= i.minStock), []);

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Tenant Overview" description="Key metrics and information for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-2xl font-bold">{npr(tenant.productCount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">{npr(tenant.monthlyRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
              <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Staff</p>
              <p className="text-2xl font-bold">{mockTenantStaff.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Subscription</p>
              <p className="text-2xl font-bold">{activeSub ? activeSub.packageName : 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Info Card */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tenant Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{tenant.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{tenant.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{tenant.phone}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Domain</p>
              <p className="font-medium">{tenant.domain}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-medium">{tenant.ownerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <Badge className={cn('capitalize', getPlanBadgeClasses(tenant.plan))}>{tenant.plan}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className={getStatusBadgeClasses(tenant.status)}>
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(tenant.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Products</p>
              <p className="font-medium">{tenant.productCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              <p className="font-medium">{nprFull(tenant.monthlyRevenue)}</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Plan Details</p>
              {plan && (
                <p className="text-sm mt-1">
                  Analytics: {plan.analytics.charAt(0).toUpperCase() + plan.analytics.slice(1)} · Support: {plan.support.charAt(0).toUpperCase() + plan.support.slice(1)}{plan.paymentGateway ? ' · Payment Gateway' : ''}{plan.billing ? ' · Billing' : ''}{plan.receipt ? ' · Receipt' : ''}{plan.export ? ' · Export' : ''}{plan.advanceInventory ? ' · Advanced Inventory' : ''}{plan.pos ? ' · POS' : ''}{plan.multipleOutlets ? ' · Multiple Outlets' : ''}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales + Low Stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map(sale => (
                    <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{sale.invoiceNumber}</TableCell>
                      <TableCell className="max-w-[120px] truncate">{sale.customerName}</TableCell>
                      <TableCell className="hidden sm:table-cell">{sale.paymentMethod}</TableCell>
                      <TableCell className="text-right font-medium">{nprFull(sale.total)}</TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize', getStatusBadgeClasses(sale.status))}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No low stock items</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden sm:table-cell">SKU</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map(item => (
                      <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium max-w-[150px] truncate">{item.productName}</TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs">{item.sku}</TableCell>
                        <TableCell className="text-right">{item.currentStock} / {item.minStock}</TableCell>
                        <TableCell>
                          <Badge className={getStockBadgeClasses(item.currentStock, item.minStock)}>
                            {getStockStatus(item.currentStock, item.minStock)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
