'use client';

import { useState, useMemo } from 'react';
import { Store, Search, Package, AlertTriangle, Eye } from 'lucide-react';
import { nprFull, formatDate, getStatusBadgeClasses, getStockBadgeClasses, getStockStatus } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { ProductImportButton } from '@/components/shared/product-import-button';
import { useTenantSelectorStore } from '@/features/auth/store';
import { useTenants, useProducts, useCategories } from '@/hooks/use-api-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { apiPaths } from '@/lib/api';
import type { Product } from '@/lib/types';

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

export default function SATenantProducts() {
  const tenants = useTenants().items;
  const { items: products, refetch } = useProducts();
  const { items: categoryRows, refetch: refetchCategories } = useCategories();

  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = tenants.find(t => t.id === selectedTenantId);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryOptions = useMemo(
    () => ['all', ...categoryRows.map((c) => c.name)],
    [categoryRows],
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && p.isActive) ||
        (statusFilter === 'inactive' && !p.isActive);
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const summary = useMemo(() => {
    const active = products.filter(p => p.isActive).length;
    const totalValue = products.reduce((a, p) => a + p.price * p.stock, 0);
    const lowStock = products.filter(p => p.stock <= p.minStock).length;
    return { total: products.length, active, totalValue, lowStock };
  }, [products]);

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Product catalog for this tenant">
        <ProductImportButton
          path={`${apiPaths.admin.product}/import`}
          tenantId={tenant.id}
          requireTenant
          onImported={() => {
            void refetch();
            void refetchCategories();
          }}
        />
      </PageHeader>
      <TenantBanner name={tenant.name} />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Products', value: summary.total, icon: Package, color: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-600 dark:text-sky-400' },
          { label: 'Active', value: summary.active, icon: Package, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Value', value: nprFull(summary.totalValue), icon: Package, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'Low Stock', value: summary.lowStock, icon: AlertTriangle, color: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
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
          <Input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {categoryOptions.map(c => <option key={c} value={c} className="capitalize">{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Cost</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Min Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Unit</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Vendor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No products found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map(product => (
                    <TableRow key={product.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium max-w-[150px] truncate">{product.name}</TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                      <TableCell className="text-right font-medium">{nprFull(product.price)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-right">{nprFull(product.costPrice)}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={getStockBadgeClasses(product.stock, product.minStock)}>{product.stock}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right text-muted-foreground">{product.minStock}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.unit}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getStatusBadgeClasses(product.isActive ? 'active' : 'inactive')}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[120px] truncate text-muted-foreground">{product.vendorName}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedProduct(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">SKU</p>
                    <p className="font-mono font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Selling Price</p>
                    <p className="font-medium">{nprFull(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cost Price</p>
                    <p className="font-medium">{nprFull(selectedProduct.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <Badge className={getStockBadgeClasses(selectedProduct.stock, selectedProduct.minStock)}>
                      {selectedProduct.stock} ({getStockStatus(selectedProduct.stock, selectedProduct.minStock)})
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min Stock</p>
                    <p className="font-medium">{selectedProduct.minStock}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit</p>
                    <p className="font-medium">{selectedProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeClasses(selectedProduct.isActive ? 'active' : 'inactive')}>
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendor</p>
                    <p className="font-medium">{selectedProduct.vendorName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedProduct.createdAt)}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Value (at price)</p>
                    <p className="font-bold">{nprFull(selectedProduct.price * selectedProduct.stock)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value (at cost)</p>
                    <p className="font-bold">{nprFull(selectedProduct.costPrice * selectedProduct.stock)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
