'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Tags,
  TrendingUp,
  Milk,
  Coffee,
  Cookie,
  Wheat,
  Flame,
  Sparkles,
  SprayCan,
  Snowflake,
  type LucideIcon,
} from 'lucide-react';
import { useCategories } from '@/hooks/use-api-data';
import { useAuthStore } from '@/features/auth/store';
import { toast } from 'sonner';
import type { Category } from '@/lib/types';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

// Category icon & color map
const CATEGORY_STYLES: Record<string, { icon: LucideIcon; bg: string; iconColor: string }> = {
  'Dairy & Eggs':      { icon: Milk,      bg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  'Beverages':         { icon: Coffee,    bg: 'bg-amber-100 dark:bg-amber-900/30',   iconColor: 'text-amber-600 dark:text-amber-400' },
  'Snacks & Chips':    { icon: Cookie,    bg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
  'Rice & Grains':     { icon: Wheat,     bg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
  'Cooking Essentials':{ icon: Flame,     bg: 'bg-red-100 dark:bg-red-900/30',       iconColor: 'text-red-600 dark:text-red-400' },
  'Personal Care':     { icon: Sparkles,  bg: 'bg-pink-100 dark:bg-pink-900/30',     iconColor: 'text-pink-600 dark:text-pink-400' },
  'Cleaning Products': { icon: SprayCan,  bg: 'bg-cyan-100 dark:bg-cyan-900/30',     iconColor: 'text-cyan-600 dark:text-cyan-400' },
  'Frozen Foods':      { icon: Snowflake, bg: 'bg-blue-100 dark:bg-blue-900/30',     iconColor: 'text-blue-600 dark:text-blue-400' },
};

const DEFAULT_STYLE = { icon: Package, bg: 'bg-muted', iconColor: 'text-muted-foreground' };

export default function CategoriesPage() {
  const { items: mockCategories, create, update, remove } = useCategories();
  const tenantId = useAuthStore((s) => s.user?.tenantId || '');

  const [categories, setCategories] = useState<Category[]>([...mockCategories]);
  useEffect(() => {
    setCategories(mockCategories);
  }, [mockCategories]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [categories, search]);

  const maxProducts = useMemo(
    () => Math.max(...categories.map(c => c.productCount), 1),
    [categories]
  );

  const totalProducts = useMemo(
    () => categories.reduce((sum, c) => sum + c.productCount, 0),
    [categories]
  );

  const mostPopular = useMemo(
    () => categories.reduce((best, c) => c.productCount > best.productCount ? c : best, categories[0]),
    [categories]
  );

  const openAdd = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      if (editId) {
        await update(editId, { name: name.trim(), description: description.trim() });
        toast.success('Category updated successfully');
      } else {
        await create({
          tenantId,
          name: name.trim(),
          description: description.trim(),
          productCount: 0,
        });
        toast.success('Category added successfully');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success('Category deleted successfully');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Categories">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Tags className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Popular</p>
              <p className="text-lg font-bold truncate max-w-[180px]">{mostPopular?.name || '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {filteredCategories.length === 0 ? (
        search.trim() ? (
          <p className="text-center text-muted-foreground">No categories found</p>
        ) : (
          <EmptyState
            icon={Package}
            title="No categories yet"
            description="Create your first category to start organizing products."
            action={{ label: 'Add Category', onClick: openAdd }}
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => {
            const style = CATEGORY_STYLES[cat.name] || DEFAULT_STYLE;
            const Icon = style.icon;
            const barWidth = (cat.productCount / maxProducts) * 100;
            return (
              <Card key={cat.id} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 space-y-0">
                      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', style.bg)}>
                        <Icon className={cn('h-6 w-6', style.iconColor)} />
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold">{cat.name}</span>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {cat.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(cat)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(cat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{cat.productCount} products</span>
                      <span>{new Date(cat.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Update category details' : 'Fill in category information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
