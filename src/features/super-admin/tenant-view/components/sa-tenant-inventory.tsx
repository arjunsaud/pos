'use client';

import { useState, useMemo } from 'react';
import { Store, Search, Warehouse, AlertTriangle, PackageX, Eye } from 'lucide-react';
import { nprFull, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockInventory, mockProducts, mockStockMovements } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { InventoryItem } from '@/lib/types';

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

function getInvStockStatus(current: number, min: number): { label: string; classes: string } {
  if (current < min) return { label: 'Critical', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  if (current < min * 2) return { label: 'Low', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  return { label: 'OK', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
}

type StockLevelFilter = 'all' | 'ok' | 'low' | 'critical';

export default function SATenantInventory() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockLevelFilter>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const movements = useMemo(() => {
    if (!selectedItem) return [];
    return mockStockMovements.filter(m => m.productId === selectedItem.productId);
  }, [selectedItem]);

  const filtered = useMemo(() => {
    return mockInventory.filter(item => {
      const matchSearch = !search ||
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const status = getInvStockStatus(item.currentStock, item.minStock).label.toLowerCase();
      const matchStock = stockFilter === 'all' || status === stockFilter;
      return matchSearch && matchStock;
    });
  }, [search, stockFilter]);

  const summary = useMemo(() => {
    const totalValue = mockInventory.reduce((a, inv) => {
      const prod = mockProducts.find(p => p.id === inv.productId);
      return a + (prod ? prod.price * inv.currentStock : 0);
    }, 0);
    const lowCount = mockInventory.filter(i => {
      const s = getInvStockStatus(i.currentStock, i.minStock).label;
      return s === 'Low';
    }).length;
    const criticalCount = mockInventory.filter(i => {
      const s = getInvStockStatus(i.currentStock, i.minStock).label;
      return s === 'Critical';
    }).length;
    return { total: mockInventory.length, totalValue, lowCount, criticalCount };
  }, []);

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Stock levels and movements for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Items', value: summary.total, icon: Warehouse, color: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-600 dark:text-sky-400' },
          { label: 'Total Value', value: nprFull(summary.totalValue), icon: Warehouse, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Low Stock', value: summary.lowCount, icon: AlertTriangle, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'Critical', value: summary.criticalCount, icon: PackageX, color: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn('rounded-lg p-3', s.color)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search product or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'ok', 'low', 'critical'] as StockLevelFilter[]).map(f => (
            <Button
              key={f}
              variant={stockFilter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStockFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="hidden sm:table-cell">SKU</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No inventory items found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map(item => {
                    const status = getInvStockStatus(item.currentStock, item.minStock);
                    return (
                      <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium max-w-[150px] truncate">{item.productName}</TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs">{item.sku}</TableCell>
                        <TableCell className="text-right font-medium">{item.currentStock}</TableCell>
                        <TableCell className="hidden sm:table-cell text-right text-muted-foreground">{item.minStock}</TableCell>
                        <TableCell>
                          <Badge className={status.classes}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(item.lastUpdated)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedItem(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Movement Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  {selectedItem.productName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">SKU</p>
                    <p className="font-mono font-medium">{selectedItem.sku}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-bold text-lg">{selectedItem.currentStock}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min Stock</p>
                    <p className="font-medium">{selectedItem.minStock}</p>
                  </div>
                </div>

                <h4 className="font-semibold text-sm">Stock Movement History</h4>
                {movements.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No movement history available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="hidden sm:table-cell">Reason</TableHead>
                          <TableHead className="hidden sm:table-cell">By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movements.map(m => (
                          <TableRow key={m.id} className="transition-colors hover:bg-muted/50">
                            <TableCell className="text-xs">{formatDate(m.date)}</TableCell>
                            <TableCell>
                              <Badge className={m.type === 'in'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }>
                                {m.type === 'in' ? 'Stock In' : 'Stock Out'}
                              </Badge>
                            </TableCell>
                            <TableCell className={cn('text-right font-medium', m.type === 'in' ? 'text-emerald-600' : 'text-red-600')}>
                              {m.type === 'in' ? '+' : '-'}{m.quantity}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell max-w-[180px] truncate text-muted-foreground">{m.reason}</TableCell>
                            <TableCell className="hidden sm:table-cell">{m.performedBy}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
