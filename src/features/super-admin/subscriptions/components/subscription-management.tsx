'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  CreditCard,
  Package,
  Star,
  Crown,
  Zap,
  Building2,
  BarChart3,
  Headphones,
  Receipt,
  FileDown,
  Warehouse,
  ShoppingCart,
  MapPin,
} from 'lucide-react';
import { mockPackages } from '@/lib/mock-data';
import type { SubscriptionPackage } from '@/lib/types';
import { nprFull } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const CARD_COLORS = [
  'border-slate-300 dark:border-slate-600',
  'border-blue-400 dark:border-blue-500',
  'border-purple-400 dark:border-purple-500',
  'border-amber-400 dark:border-amber-500',
];

const CARD_ACCENTS = [
  { bg: 'bg-slate-100 dark:bg-slate-800/50', text: 'text-slate-600 dark:text-slate-300' },
  { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
];

const PLAN_ICONS = [Package, Zap, Crown, Star];

interface FeatureRow {
  key: keyof SubscriptionPackage;
  label: string;
  icon: React.ElementType;
}

const FEATURE_ROWS: FeatureRow[] = [
  { key: 'paymentGateway', label: 'Payment Gateway', icon: CreditCard },
  { key: 'billing', label: 'Billing', icon: Receipt },
  { key: 'receipt', label: 'Receipt', icon: Receipt },
  { key: 'export', label: 'Export Data', icon: FileDown },
  { key: 'advanceInventory', label: 'Advance Inventory', icon: Warehouse },
  { key: 'pos', label: 'POS', icon: ShoppingCart },
  { key: 'multipleOutlets', label: 'Multiple Outlets', icon: MapPin },
];

// ------------------------------------------------------------------
// Form type
// ------------------------------------------------------------------

interface PackageFormData {
  name: string;
  price: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  maxProducts: string;
  maxStaff: string;
  analytics: 'basic' | 'standard' | 'advanced';
  support: 'basic' | 'quick' | 'priority' | 'dedicated';
  paymentGateway: boolean;
  billing: boolean;
  receipt: boolean;
  export: boolean;
  advanceInventory: boolean;
  pos: boolean;
  multipleOutlets: boolean;
  popular: boolean;
}

const EMPTY_FORM: PackageFormData = {
  name: '',
  price: '',
  interval: 'monthly',
  status: 'active',
  maxProducts: '200',
  maxStaff: '5',
  analytics: 'basic',
  support: 'basic',
  paymentGateway: false,
  billing: false,
  receipt: false,
  export: false,
  advanceInventory: false,
  pos: false,
  multipleOutlets: false,
  popular: false,
};

function packageToForm(pkg: SubscriptionPackage): PackageFormData {
  return {
    name: pkg.name,
    price: String(pkg.price),
    interval: pkg.interval,
    status: pkg.status,
    maxProducts: String(pkg.maxProducts),
    maxStaff: String(pkg.maxStaff),
    analytics: pkg.analytics,
    support: pkg.support,
    paymentGateway: pkg.paymentGateway,
    billing: pkg.billing,
    receipt: pkg.receipt,
    export: pkg.export,
    advanceInventory: pkg.advanceInventory,
    pos: pkg.pos,
    multipleOutlets: pkg.multipleOutlets,
    popular: pkg.popular ?? false,
  };
}

function formToPackage(form: PackageFormData, id?: string): SubscriptionPackage {
  const now = new Date().toISOString().slice(0, 10);
  return {
    id: id ?? `pkg-${Date.now()}`,
    name: form.name,
    price: Number(form.price) || 0,
    interval: form.interval,
    status: form.status,
    maxProducts: Number(form.maxProducts) || 200,
    maxStaff: Number(form.maxStaff) || 5,
    analytics: form.analytics,
    support: form.support,
    paymentGateway: form.paymentGateway,
    billing: form.billing,
    receipt: form.receipt,
    export: form.export,
    advanceInventory: form.advanceInventory,
    pos: form.pos,
    multipleOutlets: form.multipleOutlets,
    popular: form.popular || undefined,
    createdAt: now,
    updatedAt: now,
  };
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function FeatureCell({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <Check className="mx-auto h-4 w-4 text-emerald-500" />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  );
}

function PackageCard({
  pkg,
  index,
  onEdit,
  onView,
  onDelete,
}: {
  pkg: SubscriptionPackage;
  index: number;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const PlanIcon = PLAN_ICONS[index % PLAN_ICONS.length];
  const isInactive = pkg.status === 'inactive';

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-[1.01]',
        color,
        pkg.popular && 'ring-2 ring-primary shadow-lg',
        isInactive && 'opacity-60',
      )}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2 pt-6">
        <div className="flex items-center justify-center gap-2">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', accent.bg)}>
            <PlanIcon className={cn('h-4 w-4', accent.text)} />
          </div>
          <CardTitle className="text-lg">{pkg.name}</CardTitle>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold tracking-tight">NPR {nprFull(pkg.price)}</span>
          <span className="text-sm text-muted-foreground">/{pkg.interval === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        <Badge
          className={cn(
            'mt-2 capitalize border-0',
            pkg.status === 'active'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          )}
        >
          {pkg.status}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Limits */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/50 p-2 text-center">
            <p className="text-xs text-muted-foreground">Products</p>
            <p className="font-semibold">{pkg.maxProducts.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2 text-center">
            <p className="text-xs text-muted-foreground">Staff</p>
            <p className="font-semibold">{pkg.maxStaff}</p>
          </div>
        </div>

        {/* Analytics & Support */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Analytics:</span>
            <span className="text-xs font-medium capitalize">{pkg.analytics}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Headphones className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Support:</span>
            <span className="text-xs font-medium capitalize">{pkg.support}</span>
          </div>
        </div>

        {/* Features checklist */}
        <div className="space-y-2 border-t pt-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Features</p>
          <div className="grid gap-1.5">
            {FEATURE_ROWS.map((feat) => {
              const enabled = pkg[feat.key] as boolean;
              const FeatIcon = feat.icon;
              return (
                <div key={feat.key} className="flex items-center gap-2 text-sm">
                  {enabled ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
                  )}
                  <FeatIcon className={cn('h-3.5 w-3.5', enabled ? 'text-foreground' : 'text-muted-foreground/40')} />
                  <span className={cn(enabled ? 'text-foreground' : 'text-muted-foreground/60')}>{feat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t pt-3 mt-auto">
          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onView}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------------
// Feature comparison table
// ------------------------------------------------------------------

function FeatureComparisonTable({ packages }: { packages: SubscriptionPackage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Feature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="min-w-[180px]">Feature</TableHead>
                {packages.map((pkg) => (
                  <TableHead key={pkg.id} className="text-center min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{pkg.name}</span>
                      {pkg.popular && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                          <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Price row */}
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">Price</TableCell>
                {packages.map((pkg) => (
                  <TableCell key={pkg.id} className="text-center font-semibold">
                    NPR {nprFull(pkg.price)}/{pkg.interval === 'monthly' ? 'mo' : 'yr'}
                  </TableCell>
                ))}
              </TableRow>

              {/* Limits */}
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">Max Products</TableCell>
                {packages.map((pkg) => (
                  <TableCell key={pkg.id} className="text-center">
                    {pkg.maxProducts.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">Max Staff</TableCell>
                {packages.map((pkg) => (
                  <TableCell key={pkg.id} className="text-center">
                    {pkg.maxStaff}
                  </TableCell>
                ))}
              </TableRow>

              {/* Analytics */}
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" /> Analytics
                </TableCell>
                {packages.map((pkg) => (
                  <TableCell key={pkg.id} className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        pkg.analytics === 'basic' && 'bg-slate-50 dark:bg-slate-800/50',
                        pkg.analytics === 'standard' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                        pkg.analytics === 'advanced' && 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                      )}
                    >
                      {pkg.analytics}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>

              {/* Support */}
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-muted-foreground" /> Support
                </TableCell>
                {packages.map((pkg) => (
                  <TableCell key={pkg.id} className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        pkg.support === 'basic' && 'bg-slate-50 dark:bg-slate-800/50',
                        pkg.support === 'quick' && 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 border-sky-200 dark:border-sky-800',
                        pkg.support === 'priority' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                        pkg.support === 'dedicated' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                      )}
                    >
                      {pkg.support}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>

              {/* Feature toggles */}
              {FEATURE_ROWS.map((feat) => {
                const FeatIcon = feat.icon;
                return (
                  <TableRow key={feat.key} className="hover:bg-muted/50">
                    <TableCell className="font-medium flex items-center gap-2">
                      <FeatIcon className="h-4 w-4 text-muted-foreground" /> {feat.label}
                    </TableCell>
                    {packages.map((pkg) => (
                      <TableCell key={pkg.id} className="text-center">
                        <FeatureCell enabled={pkg[feat.key] as boolean} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------------
// Package Form Dialog (Create / Edit)
// ------------------------------------------------------------------

function PackageFormDialog({
  open,
  onOpenChange,
  editId,
  form,
  setForm,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editId: string | null;
  form: PackageFormData;
  setForm: React.Dispatch<React.SetStateAction<PackageFormData>>;
  onSave: () => void;
}) {
  const toggleFeature = (key: keyof PackageFormData) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? 'Edit Package' : 'Create Package'}</DialogTitle>
          <DialogDescription>
            {editId
              ? 'Update the package configuration and features.'
              : 'Define a new subscription package with pricing and features.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="pkg-name"
                placeholder="e.g. Plan 1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-price">Price (NPR) <span className="text-red-500">*</span></Label>
              <Input
                id="pkg-price"
                type="number"
                min="0"
                placeholder="999"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-interval">Interval</Label>
              <Select
                value={form.interval}
                onValueChange={(v) => setForm((f) => ({ ...f, interval: v as 'monthly' | 'yearly' }))}
              >
                <SelectTrigger id="pkg-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-products">Max Products</Label>
              <Select
                value={form.maxProducts}
                onValueChange={(v) => setForm((f) => ({ ...f, maxProducts: v }))}
              >
                <SelectTrigger id="pkg-products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="2000">2,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-staff">Max Staff</Label>
              <Select
                value={form.maxStaff}
                onValueChange={(v) => setForm((f) => ({ ...f, maxStaff: v }))}
              >
                <SelectTrigger id="pkg-staff">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Analytics & Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-analytics">Analytics Level</Label>
              <Select
                value={form.analytics}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, analytics: v as 'basic' | 'standard' | 'advanced' }))
                }
              >
                <SelectTrigger id="pkg-analytics">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkg-support">Support Level</Label>
              <Select
                value={form.support}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, support: v as 'basic' | 'quick' | 'priority' | 'dedicated' }))
                }
              >
                <SelectTrigger id="pkg-support">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="quick">Quick</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dedicated">Dedicated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium">Features</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { key: 'paymentGateway' as const, label: 'Payment Gateway', icon: CreditCard },
                { key: 'billing' as const, label: 'Billing', icon: Receipt },
                { key: 'receipt' as const, label: 'Receipt', icon: Receipt },
                { key: 'export' as const, label: 'Export Data', icon: FileDown },
                { key: 'advanceInventory' as const, label: 'Advance Inventory', icon: Warehouse },
                { key: 'pos' as const, label: 'POS', icon: ShoppingCart },
                { key: 'multipleOutlets' as const, label: 'Multiple Outlets', icon: MapPin },
              ]).map((feat) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={feat.key}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FeatIcon className="h-4 w-4 text-muted-foreground" />
                      <Label className="cursor-pointer text-sm" htmlFor={`toggle-${feat.key}`}>
                        {feat.label}
                      </Label>
                    </div>
                    <Switch
                      id={`toggle-${feat.key}`}
                      checked={form[feat.key] as boolean}
                      onCheckedChange={() => toggleFeature(feat.key)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status & Popular */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="pkg-status" className="text-sm">Status</Label>
                <p className="text-xs text-muted-foreground">Active packages are available to tenants</p>
              </div>
              <Switch
                id="pkg-status"
                checked={form.status === 'active'}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, status: v ? 'active' : 'inactive' }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="pkg-popular" className="text-sm">Popular</Label>
                <p className="text-xs text-muted-foreground">Highlight as recommended plan</p>
              </div>
              <Switch
                id="pkg-popular"
                checked={form.popular}
                onCheckedChange={(v) => setForm((f) => ({ ...f, popular: v }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>{editId ? 'Update Package' : 'Create Package'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------------
// View Details Dialog
// ------------------------------------------------------------------

function ViewPackageDialog({
  open,
  onOpenChange,
  pkg,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pkg: SubscriptionPackage | null;
}) {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {pkg.name}
            <Badge
              className={cn(
                'capitalize border-0',
                pkg.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              )}
            >
              {pkg.status}
            </Badge>
            {pkg.popular && (
              <Badge className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                Popular
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Package details and feature breakdown.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Pricing */}
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold tracking-tight mt-1">
              NPR {nprFull(pkg.price)}
              <span className="text-sm font-normal text-muted-foreground">
                /{pkg.interval === 'monthly' ? 'month' : 'year'}
              </span>
            </p>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Max Products</p>
              <p className="text-lg font-semibold">{pkg.maxProducts.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Max Staff</p>
              <p className="text-lg font-semibold">{pkg.maxStaff}</p>
            </div>
          </div>

          {/* Analytics & Support */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Analytics</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'capitalize',
                  pkg.analytics === 'basic' && 'bg-slate-50 dark:bg-slate-800/50',
                  pkg.analytics === 'standard' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                  pkg.analytics === 'advanced' && 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                )}
              >
                {pkg.analytics}
              </Badge>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Headphones className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Support</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'capitalize',
                  pkg.support === 'basic' && 'bg-slate-50 dark:bg-slate-800/50',
                  pkg.support === 'quick' && 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 border-sky-200 dark:border-sky-800',
                  pkg.support === 'priority' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                  pkg.support === 'dedicated' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                )}
              >
                {pkg.support}
              </Badge>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Features</p>
            <div className="grid gap-2">
              {FEATURE_ROWS.map((feat) => {
                const enabled = pkg[feat.key] as boolean;
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={feat.key}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg border p-2.5 text-sm transition-colors',
                      enabled ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/40' : 'bg-muted/30 border-muted',
                    )}
                  >
                    {enabled ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <X className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    )}
                    <FeatIcon className={cn('h-4 w-4', enabled ? 'text-foreground' : 'text-muted-foreground/50')} />
                    <span className={cn(enabled ? 'font-medium' : 'text-muted-foreground/70')}>
                      {feat.label}
                    </span>
                    <span className={cn('ml-auto text-xs', enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground/50')}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t pt-3">
            <div>
              <span className="font-medium text-foreground/70">Created: </span>
              {pkg.createdAt}
            </div>
            <div>
              <span className="font-medium text-foreground/70">Updated: </span>
              {pkg.updatedAt}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function SubscriptionManagement() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([...mockPackages]);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageFormData>(EMPTY_FORM);
  const [viewPkg, setViewPkg] = useState<SubscriptionPackage | null>(null);
  const [deletePkg, setDeletePkg] = useState<SubscriptionPackage | null>(null);

  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.status === 'active').length;
    return { total, active };
  }, [packages]);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (pkg: SubscriptionPackage) => {
    setEditId(pkg.id);
    setForm(packageToForm(pkg));
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast.error('Package name and price are required.');
      return;
    }

    if (editId) {
      setPackages((prev) =>
        prev.map((p) => (p.id === editId ? { ...formToPackage(form, editId), createdAt: p.createdAt } : p)),
      );
      toast.success(`"${form.name}" updated successfully.`);
    } else {
      const newPkg = formToPackage(form);
      setPackages((prev) => [...prev, newPkg]);
      toast.success(`"${form.name}" created successfully.`);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deletePkg) return;
    setPackages((prev) => prev.filter((p) => p.id !== deletePkg.id));
    toast.success(`"${deletePkg.name}" deleted successfully.`);
    setDeletePkg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Subscription Packages" description="Create and manage subscription plans available to tenants">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Package
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Packages"
          value={stats.total}
          icon={Package}
          borderColor="border-l-blue-500"
        />
        <StatCard
          title="Active Packages"
          value={stats.active}
          icon={Zap}
          borderColor="border-l-emerald-500"
        />
      </div>

      {/* Package Cards Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Plans Overview</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg, i) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={i}
              onEdit={() => openEdit(pkg)}
              onView={() => setViewPkg(pkg)}
              onDelete={() => setDeletePkg(pkg)}
            />
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <FeatureComparisonTable packages={packages} />

      {/* Create / Edit Dialog */}
      <PackageFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editId={editId}
        form={form}
        setForm={setForm}
        onSave={handleSave}
      />

      {/* View Details Dialog */}
      <ViewPackageDialog
        open={!!viewPkg}
        onOpenChange={(v) => !v && setViewPkg(null)}
        pkg={viewPkg}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePkg} onOpenChange={(v) => !v && setDeletePkg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>&quot;{deletePkg?.name}&quot;</strong>? This will
              remove the package definition. Tenants currently on this plan will not be affected
              immediately, but no new tenants can subscribe to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
