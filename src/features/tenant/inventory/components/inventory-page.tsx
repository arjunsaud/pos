'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Package, DollarSign, AlertTriangle, Plus, Search, Download } from 'lucide-react';
import { mockInventory, mockStockMovements, mockProducts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { npr, getStockBadgeClasses, getStockStatus } from '@/lib/helpers';
import { toast } from 'sonner';
import type { StockMovement } from '@/lib/types';

type InventorySortField = 'name' | 'category' | 'stock' | 'price';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ productId: '', type: 'in' as 'in' | 'out', quantity: '', reason: '' });
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<InventorySortField>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const totalProducts = mockProducts.length;
  const totalStockValue = mockProducts.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockItems = mockInventory.filter((item) => item.currentStock <= item.minStock).length;

  const productMap = useMemo(() => {
    const map = new Map<string, { category: string; price: number; costPrice: number }>();
    mockProducts.forEach(p => map.set(p.id, { category: p.category, price: p.price, costPrice: p.costPrice }));
    return map;
  }, []);

  const filteredInventory = useMemo(() => {
    const enriched = mockInventory.map(item => {
      const product = productMap.get(item.productId);
      return { ...item, category: product?.category ?? '', price: product?.price ?? 0, costPrice: product?.costPrice ?? 0 };
    });
    let result = enriched;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.productName.localeCompare(b.productName);
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortField === 'stock') cmp = a.currentStock - b.currentStock;
      else cmp = a.price - b.price;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [searchQuery, sortField, sortDir, productMap]);

  const maxStock = Math.max(...filteredInventory.map(i => i.currentStock), 1);
  const filteredTotalStockValue = filteredInventory.reduce((sum, i) => sum + i.currentStock * i.costPrice, 0);
  const filteredTotalItems = filteredInventory.reduce((sum, i) => sum + i.currentStock, 0);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const pagedInventory = filteredInventory.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field: InventorySortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };
  const sortIcon = (field: InventorySortField) => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕';

  const exportCSV = () => {
    const headers = ['Product Name', 'Category', 'Current Stock', 'Reorder Level', 'Price', 'Status'];
    const rows = filteredInventory.map(item => [
      item.productName,
      item.category,
      String(item.currentStock),
      String(item.minStock),
      npr(item.price),
      getStockStatus(item.currentStock, item.minStock),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inventory-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleStockAdjust = () => {
    if (!adjustForm.productId || !adjustForm.quantity || Number(adjustForm.quantity) <= 0) {
      toast.error('Please fill all fields');
      return;
    }
    const product = mockProducts.find(p => p.id === adjustForm.productId);
    toast.success(`Stock ${adjustForm.type === 'in' ? 'added' : 'removed'}: ${Number(adjustForm.quantity)} units of ${product?.name}`);
    setAdjustForm({ productId: '', type: 'in', quantity: '', reason: '' });
    setAdjustOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor and manage stock levels">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button className="gap-2" onClick={() => setAdjustOpen(true)}>
          <Plus className="h-4 w-4" /> Stock Adjustment
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={totalProducts} icon={Package} />
        <StatCard title="Total Stock Value" value={`NPR ${npr(totalStockValue)}`} icon={DollarSign} />
        <StatCard title="Low Stock Items" value={lowStockItems} icon={AlertTriangle} iconClassName="bg-amber-100 dark:bg-amber-900/30" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Stock</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Current Stock Levels</CardTitle>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search product or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>Product <span className="ml-1 text-[10px] opacity-60">{sortIcon('name')}</span></TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('category')}>Category <span className="ml-1 text-[10px] opacity-60">{sortIcon('category')}</span></TableHead>
                      <TableHead className="text-center cursor-pointer select-none min-w-[100px]" onClick={() => handleSort('stock')}>Stock <span className="ml-1 text-[10px] opacity-60">{sortIcon('stock')}</span></TableHead>
                      <TableHead className="text-right cursor-pointer select-none hidden sm:table-cell" onClick={() => handleSort('price')}>Price <span className="ml-1 text-[10px] opacity-60">{sortIcon('price')}</span></TableHead>
                      <TableHead className="text-center hidden md:table-cell">Min Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedInventory.map((item) => (
                      <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-center">
                          <span className={cn('font-bold', item.currentStock <= 0 && 'text-red-600 dark:text-red-400', item.currentStock > 0 && item.currentStock <= item.minStock && 'text-amber-600 dark:text-amber-400')}>
                            {item.currentStock}
                          </span>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                            <div
                              className={cn(
                                'h-1.5 rounded-full transition-all',
                                getStockStatus(item.currentStock, item.minStock) === 'In Stock' && 'bg-emerald-500',
                                getStockStatus(item.currentStock, item.minStock) === 'Low Stock' && 'bg-amber-500',
                                getStockStatus(item.currentStock, item.minStock) === 'Out of Stock' && 'bg-red-500',
                              )}
                              style={{ width: `${Math.max((item.currentStock / maxStock) * 100, item.currentStock > 0 ? 2 : 0)}%` }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">NPR {npr(item.price)}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{item.minStock}</TableCell>
                        <TableCell>
                          <Badge className={getStockBadgeClasses(item.currentStock, item.minStock)} variant="secondary">
                            {getStockStatus(item.currentStock, item.minStock)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell">
                          {new Date(item.lastUpdated).toLocaleDateString('en-GB')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Total Stock Value</TableCell>
                      <TableCell className="text-center font-bold">{filteredTotalItems.toLocaleString()} units</TableCell>
                      <TableCell colSpan={4} className="font-bold">NPR {npr(filteredTotalStockValue)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <div className="flex items-center justify-between pt-4 px-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredInventory.length > 0 ? ((page - 1) * ITEMS_PER_PAGE) + 1 : 0}-{Math.min(page * ITEMS_PER_PAGE, filteredInventory.length)} of {filteredInventory.length}
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

        <TabsContent value="movements">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="hidden sm:table-cell">Reason</TableHead>
                      <TableHead>By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStockMovements.map((mov) => (
                      <TableRow key={mov.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="text-muted-foreground text-xs">{new Date(mov.date).toLocaleDateString('en-GB')}</TableCell>
                        <TableCell className="font-medium">{mov.productName}</TableCell>
                        <TableCell>
                          <Badge className={cn(mov.type === 'in' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')} variant="secondary">
                            {mov.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{mov.quantity}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-xs hidden sm:table-cell">{mov.reason}</TableCell>
                        <TableCell className="text-xs">{mov.performedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={adjustForm.productId} onValueChange={(v) => setAdjustForm(f => ({ ...f, productId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {mockProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={adjustForm.type === 'in' ? 'default' : 'outline'} onClick={() => setAdjustForm(f => ({ ...f, type: 'in' }))} className={cn(adjustForm.type === 'in' && 'bg-emerald-600 hover:bg-emerald-700')}>
                  Stock In
                </Button>
                <Button variant={adjustForm.type === 'out' ? 'default' : 'outline'} onClick={() => setAdjustForm(f => ({ ...f, type: 'out' }))} className={cn(adjustForm.type === 'out' && 'bg-red-600 hover:bg-red-700')}>
                  Stock Out
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="1" placeholder="Enter quantity" value={adjustForm.quantity} onChange={(e) => setAdjustForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input placeholder="e.g., New stock received, Sold to customer" value={adjustForm.reason} onChange={(e) => setAdjustForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button onClick={handleStockAdjust}>Confirm Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
