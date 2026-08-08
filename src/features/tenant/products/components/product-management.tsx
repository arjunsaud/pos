'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, AlertTriangle, Download, X } from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { npr } from '@/lib/helpers';

interface ProductForm {
  name: string;
  sku: string;
  price: string;
  costPrice: string;
  category: string;
  stock: string;
  minStock: string;
  unit: string;
  isActive: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  sku: '',
  price: '',
  costPrice: '',
  category: '',
  stock: '',
  minStock: '',
  unit: 'Pcs',
  isActive: true,
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([...mockProducts]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      costPrice: String(product.costPrice),
      category: product.category,
      stock: String(product.stock),
      minStock: String(product.minStock),
      unit: product.unit,
      isActive: product.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku || !form.price) {
      toast.error('Please fill in required fields (Name, SKU, Price)');
      return;
    }
    if (editId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                name: form.name,
                sku: form.sku,
                price: Number(form.price),
                costPrice: Number(form.costPrice) || 0,
                category: form.category,
                stock: Number(form.stock) || 0,
                minStock: Number(form.minStock) || 0,
                unit: form.unit,
                isActive: form.isActive,
              }
            : p
        )
      );
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = {
        id: `p-new-${Date.now()}`,
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        costPrice: Number(form.costPrice) || 0,
        category: form.category,
        stock: Number(form.stock) || 0,
        minStock: Number(form.minStock) || 0,
        unit: form.unit,
        isActive: form.isActive,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success('Product added successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    toast.success('Product deleted successfully');
    setDeleteId(null);
  };

  const allPageIds = paged.map((p) => p.id);
  const allPageSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allPageIds])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    toast.success(`${selectedIds.length} product(s) deleted successfully`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
    const headers = ['Name', 'SKU', 'Price', 'Cost Price', 'Category', 'Stock', 'Unit', 'Active'];
    const rows = selectedProducts.map((p) => [
      p.name,
      p.sku,
      String(p.price),
      String(p.costPrice),
      p.category,
      String(p.stock),
      p.unit,
      p.isActive ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-products.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('selected-products.csv exported');
  };

  const clearSelection = () => setSelectedIds([]);

  const exportCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const rows = filtered.map(p => [
      p.name,
      p.sku,
      p.category,
      npr(p.price),
      String(p.stock),
      p.isActive ? 'Active' : 'Inactive',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Products">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </PageHeader>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <Badge variant="secondary" className="font-semibold">
            {selectedIds.length} selected
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteId('bulk')}
          >
            <Trash2 className="h-4 w-4" /> Delete Selected
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportSelected}>
            <Download className="h-4 w-4" /> Export Selected
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="transition-colors hover:bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all on this page"
                  />
                </TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((product) => {
                const isLow = product.stock > 0 && product.stock <= product.minStock;
                const isOut = product.stock <= 0;
                return (
                  <TableRow key={product.id} data-state={selectedIds.includes(product.id) ? 'selected' : undefined} className="transition-colors hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-right">NPR {npr(product.price)}</TableCell>
                    <TableCell className="text-right">NPR {npr(product.costPrice)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          'font-medium',
                          isOut && 'text-red-600',
                          isLow && 'text-amber-600'
                        )}
                      >
                        {product.stock}
                        {isLow && (
                          <AlertTriangle className="ml-1 inline h-3 w-3 text-amber-500" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => toggleActive(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Update product details' : 'Fill in the product information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>SKU *</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Cost Price</Label>
                <Input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Min Stock</Label>
                <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Add'} Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteId === 'bulk' ? `Delete ${selectedIds.length} Product(s)` : 'Delete Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteId === 'bulk'
                ? `Are you sure you want to delete ${selectedIds.length} selected product(s)? This action cannot be undone.`
                : 'Are you sure you want to delete this product? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteId === 'bulk' ? handleBulkDelete : handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteId === 'bulk' ? 'Delete All' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
