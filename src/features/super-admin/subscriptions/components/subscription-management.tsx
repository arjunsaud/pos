'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Star, Plus, Pencil, Trash2, CreditCard, Clock, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { mockPlans, mockTenants, mockSubscriptions } from '@/lib/mock-data';
import type { Subscription, PlanType, SubscriptionStatus, SubscriptionPlan } from '@/lib/types';
import { cn } from '@/lib/utils';
import { nprFull } from '@/lib/helpers';

const planBadgeVariant: Record<PlanType, 'secondary' | 'default' | 'outline'> = {
  basic: 'secondary',
  pro: 'default',
  enterprise: 'outline',
};

const subStatusBadgeClasses: Record<SubscriptionStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  trial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusFilters: { label: string; value: SubscriptionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Trial', value: 'trial' },
];

interface SubscriptionFormData {
  tenantId: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

const emptyForm: SubscriptionFormData = {
  tenantId: '',
  planId: '',
  startDate: '',
  endDate: '',
  autoRenew: false,
};

function PlanCard({ plan, isPro }: { plan: SubscriptionPlan; isPro: boolean }) {
  const planLabel = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);
  const currentPlan = plan.name === 'pro';
  const isBasic = plan.name === 'basic';

  const handleAction = () => {
    if (isBasic) {
      toast.info('Upgrade to Pro plan requested (mock)');
    } else if (plan.name === 'enterprise') {
      toast.info('Downgrade request submitted (mock)');
    }
  };

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-shadow hover:shadow-md',
        isPro && 'border-primary shadow-lg scale-[1.02]'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="gap-1">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-xl">{planLabel}</CardTitle>
        <CardDescription className="sr-only">{planLabel} plan details</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            NPR {nprFull(plan.price)}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="grid gap-2 text-sm">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-1 text-xs text-muted-foreground border-t pt-4">
          <p>Max Products: {plan.maxProducts >= 99999 ? 'Unlimited' : plan.maxProducts}</p>
          <p>Max Staff: {plan.maxStaff >= 99999 ? 'Unlimited' : plan.maxStaff}</p>
        </div>
        <Button
          className="w-full"
          variant={currentPlan ? 'outline' : 'default'}
          disabled={currentPlan}
          onClick={handleAction}
        >
          {currentPlan ? 'Current Plan' : isBasic ? 'Upgrade' : 'Downgrade'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [deletingSub, setDeletingSub] = useState<Subscription | null>(null);
  const [form, setForm] = useState<SubscriptionFormData>(emptyForm);

  // Filtered subscriptions
  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchSearch = s.tenantName.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [subscriptions, statusFilter, search]);

  // Summary stats
  const totalSubs = subscriptions.length;
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;
  const totalRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const expiringSoon = subscriptions.filter((s) => {
    if (s.status !== 'active') return false;
    const end = new Date(s.endDate);
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff <= thirtyDays;
  }).length;

  // Form helpers
  const resetForm = () => setForm(emptyForm);

  const handleOpenAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setForm({
      tenantId: sub.tenantId,
      planId: sub.planId,
      startDate: sub.startDate,
      endDate: sub.endDate,
      autoRenew: sub.autoRenew,
    });
    setEditOpen(true);
  };

  const handleOpenDelete = (sub: Subscription) => {
    setDeletingSub(sub);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    const plan = mockPlans.find((p) => p.id === form.planId);
    if (!tenant || !plan || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      startDate: form.startDate,
      endDate: form.endDate,
      amount: plan.price,
      currency: 'NPR',
      autoRenew: form.autoRenew,
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    toast.success(`Subscription added for ${tenant.name}`);
    setAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingSub) return;
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    const plan = mockPlans.find((p) => p.id === form.planId);
    if (!tenant || !plan || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === editingSub.id
          ? {
              ...s,
              tenantId: tenant.id,
              tenantName: tenant.name,
              planId: plan.id,
              planName: plan.name,
              amount: plan.price,
              startDate: form.startDate,
              endDate: form.endDate,
              autoRenew: form.autoRenew,
            }
          : s
      )
    );
    toast.success(`Subscription updated for ${tenant.name}`);
    setEditOpen(false);
    setEditingSub(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deletingSub) return;
    setSubscriptions((prev) => prev.filter((s) => s.id !== deletingSub.id));
    toast.success(`Subscription deleted for ${deletingSub.tenantName}`);
    setDeleteOpen(false);
    setDeletingSub(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription Management" description="Manage tenant subscriptions and plan details">
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Subscriptions" value={totalSubs} icon={CreditCard} />
        <StatCard title="Active" value={activeSubs} icon={Users} borderColor="border-l-emerald-500" />
        <StatCard title="Monthly Revenue" value={`NPR ${nprFull(totalRevenue)}`} icon={Clock} borderColor="border-l-amber-500" />
        <StatCard title="Expiring Soon" value={expiringSoon} icon={AlertTriangle} borderColor="border-l-red-500" />
      </div>

      {/* Plan Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Plan Pricing</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {mockPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isPro={plan.name === 'pro'} />
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={statusFilter === f.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <Input
              placeholder="Search tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Start Date</TableHead>
                  <TableHead className="hidden md:table-cell">End Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Auto-Renew</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((sub) => (
                    <TableRow key={sub.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{sub.tenantName}</TableCell>
                      <TableCell>
                        <Badge variant={planBadgeVariant[sub.planName]}>
                          {sub.planName.charAt(0).toUpperCase() + sub.planName.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border-0', subStatusBadgeClasses[sub.status])}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{sub.startDate}</TableCell>
                      <TableCell className="hidden md:table-cell">{sub.endDate}</TableCell>
                      <TableCell>NPR {nprFull(sub.amount)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={sub.autoRenew ? 'default' : 'secondary'}>
                          {sub.autoRenew ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenEdit(sub)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleOpenDelete(sub)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Subscription Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
            <DialogDescription>Create a new subscription for a tenant.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="add-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-plan">Plan</Label>
              <Select value={form.planId} onValueChange={(v) => setForm((f) => ({ ...f, planId: v }))}>
                <SelectTrigger id="add-plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {mockPlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name.charAt(0).toUpperCase() + p.name.slice(1)} — NPR {nprFull(p.price)}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-start">Start Date</Label>
                <Input id="add-start" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-end">End Date</Label>
                <Input id="add-end" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="add-autorenew">Auto-Renew</Label>
              <Switch id="add-autorenew" checked={form.autoRenew} onCheckedChange={(v) => setForm((f) => ({ ...f, autoRenew: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAdd}>Add Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Update subscription for {editingSub?.tenantName}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="edit-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-plan">Plan</Label>
              <Select value={form.planId} onValueChange={(v) => setForm((f) => ({ ...f, planId: v }))}>
                <SelectTrigger id="edit-plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {mockPlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name.charAt(0).toUpperCase() + p.name.slice(1)} — NPR {nprFull(p.price)}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input id="edit-start" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end">End Date</Label>
                <Input id="edit-end" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="edit-autorenew">Auto-Renew</Label>
              <Switch id="edit-autorenew" checked={form.autoRenew} onCheckedChange={(v) => setForm((f) => ({ ...f, autoRenew: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setEditingSub(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the subscription for {deletingSub?.tenantName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteOpen(false); setDeletingSub(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
