'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Search,
  Eye,
  ToggleLeft,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  CircleDollarSign,
  CalendarCheck,
  Globe,
  Phone,
  Mail,
  Package,
  Crown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockTenants } from '@/lib/mock-data';
import type { Tenant, TenantStatus } from '@/lib/types';
import { npr, nprFull, getStatusBadgeClasses, getPlanBadgeClasses, formatRelativeTime, formatDate } from '@/lib/helpers';

const planColors: Record<string, { border: string; bg: string; text: string }> = {
  'Plan 1': { border: 'border-slate-200 dark:border-slate-700', bg: 'bg-slate-50 dark:bg-slate-900/30', text: 'text-slate-600 dark:text-slate-400' },
  'Plan 2': { border: 'border-primary/30 dark:border-primary/20', bg: 'bg-primary/5 dark:bg-primary/10', text: 'text-primary dark:text-primary' },
  'Plan 3': { border: 'border-purple-200 dark:border-purple-800/50', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400' },
  'Plan 4': { border: 'border-amber-200 dark:border-amber-800/50', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' },
};

// Mock activity per tenant for detail dialog
const mockTenantActivity = [
  { action: 'New sale completed', time: '2024-06-15T17:30:00', type: 'success' as const },
  { action: 'Product inventory updated', time: '2024-06-15T14:20:00', type: 'info' as const },
  { action: 'Staff member added', time: '2024-06-14T11:00:00', type: 'info' as const },
  { action: 'Monthly subscription renewed', time: '2024-06-13T09:00:00', type: 'success' as const },
  { action: 'Low stock alert triggered', time: '2024-06-12T16:45:00', type: 'warning' as const },
];

const activityDotColor: Record<string, string> = {
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

type StatusFilter = 'all' | 'active' | 'inactive';

const ITEMS_PER_PAGE = 5;

type TenantSortField = 'name' | 'plan' | 'status' | 'products';

export default function TenantManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [sortField, setSortField] = useState<TenantSortField>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Add form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formPlan, setFormPlan] = useState('Plan 1');

  // Local tenant list for toggle/delete
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);

  const filteredTenants = useMemo(() => {
    let result = tenants.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    const planOrder: Record<string, number> = { 'Plan 1': 0, 'Plan 2': 1, 'Plan 3': 2, 'Plan 4': 3 };
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'plan') cmp = planOrder[a.plan] - planOrder[b.plan];
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      else cmp = a.productCount - b.productCount;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [tenants, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const pagedTenants = filteredTenants.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleSort = (field: TenantSortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };
  const sortIcon = (field: TenantSortField) => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕';

  const handleAddTenant = () => {
    const newTenant: Tenant = {
      id: `t${Date.now()}`,
      name: formName,
      email: formEmail,
      phone: formPhone,
      domain: formDomain,
      plan: formPlan,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      ownerName: formName,
      productCount: 0,
      monthlyRevenue: 0,
    };
    setTenants(prev => [newTenant, ...prev]);
    toast.success('Tenant added successfully (mock)');
    setAddOpen(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormDomain('');
    setFormPlan('Plan 1');
  };

  const handleToggleStatus = (tenant: Tenant) => {
    const newStatus: TenantStatus =
      tenant.status === 'active' ? 'inactive' : 'active';
    setTenants((prev) =>
      prev.map((t) => (t.id === tenant.id ? { ...t, status: newStatus } : t))
    );
    toast.success(`${tenant.name} ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
  };

  const handleDelete = (tenant: Tenant) => {
    setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
    toast.success(`${tenant.name} deleted (mock)`);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tenant Management">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Fill in the details to register a new tenant on the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="tenant-name">Name</Label>
                <Input
                  id="tenant-name"
                  placeholder="Store name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-email">Email</Label>
                <Input
                  id="tenant-email"
                  type="email"
                  placeholder="admin@store.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-phone">Phone</Label>
                <Input
                  id="tenant-phone"
                  placeholder="+977-98XXXXXXXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-domain">Domain</Label>
                <Input
                  id="tenant-domain"
                  placeholder="store.posnepal.com"
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-plan">Plan</Label>
                <Select value={formPlan} onValueChange={setFormPlan}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plan 1">Plan 1</SelectItem>
                    <SelectItem value="Plan 2">Plan 2</SelectItem>
                    <SelectItem value="Plan 3">Plan 3</SelectItem>
                    <SelectItem value="Plan 4">Plan 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTenant}>Add Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-semibold">{tenants.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Tenants</p>
                <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{tenants.filter(t => t.status === 'active').length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Monthly Revenue</p>
                <p className="text-2xl font-semibold">NPR {npr(tenants.reduce((s, t) => s + t.monthlyRevenue, 0))}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Revenue / Tenant</p>
                <p className="text-2xl font-semibold">NPR {npr(tenants.reduce((s, t) => s + t.monthlyRevenue, 0) / tenants.length)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as StatusFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(filter);
                setPage(0);
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tenant Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="transition-colors hover:bg-muted/50">
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>Name <span className="ml-1 text-[10px] opacity-60">{sortIcon('name')}</span></TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('plan')}>Plan <span className="ml-1 text-[10px] opacity-60">{sortIcon('plan')}</span></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>Status <span className="ml-1 text-[10px] opacity-60">{sortIcon('status')}</span></TableHead>
                <TableHead className="hidden sm:table-cell cursor-pointer select-none" onClick={() => handleSort('products')}>Products <span className="ml-1 text-[10px] opacity-60">{sortIcon('products')}</span></TableHead>
                <TableHead className="hidden sm:table-cell">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedTenants.length === 0 ? (
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No tenants found.
                  </TableCell>
                </TableRow>
              ) : (
                pagedTenants.map((tenant) => (
                  <TableRow key={tenant.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {tenant.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeClasses(tenant.status)}
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {tenant.productCount}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      NPR {npr(tenant.monthlyRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(tenant)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(tenant)}
                        >
                          <ToggleLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(tenant)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filteredTenants.length)} of{' '}
            {filteredTenants.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              Tenant Details
            </DialogTitle>
            <DialogDescription>Full information and recent activity.</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="grid gap-5 py-2">
              {/* Tenant Header Card */}
              <div className={cn("rounded-lg border p-4", planColors[selectedTenant.plan]?.bg, planColors[selectedTenant.plan]?.border)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white bg-primary">
                      {selectedTenant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-base">{selectedTenant.name}</p>
                      <p className="text-xs text-muted-foreground">Owned by {selectedTenant.ownerName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={getPlanBadgeClasses(selectedTenant.plan)} variant="secondary">
                          {selectedTenant.plan.charAt(0).toUpperCase() + selectedTenant.plan.slice(1)} Plan
                        </Badge>
                        <Badge className={getStatusBadgeClasses(selectedTenant.status)}>
                          {selectedTenant.status.charAt(0).toUpperCase() + selectedTenant.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {selectedTenant.plan === 'Plan 4' && (
                    <Crown className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> Email
                  </div>
                  <p className="mt-1 text-sm font-medium truncate">{selectedTenant.email}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> Phone
                  </div>
                  <p className="mt-1 text-sm font-medium">{selectedTenant.phone}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> Domain
                  </div>
                  <p className="mt-1 text-sm font-medium truncate">{selectedTenant.domain}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarCheck className="h-3 w-3" /> Created
                  </div>
                  <p className="mt-1 text-sm font-medium">{formatDate(selectedTenant.createdAt)}</p>
                </div>
              </div>

              {/* Business Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Package className="h-3 w-3" /> Products
                  </div>
                  <p className="mt-1 text-xl font-semibold">{selectedTenant.productCount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CircleDollarSign className="h-3 w-3" /> Monthly Revenue
                  </div>
                  <p className="mt-1 text-xl font-semibold">NPR {npr(selectedTenant.monthlyRevenue)}</p>
                </div>
              </div>

              {/* Revenue Progress Bar */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Revenue Contribution</span>
                  <span className="font-medium">
                    {tenants.length > 0 ? Math.round((selectedTenant.monthlyRevenue / tenants.reduce((s, t) => s + t.monthlyRevenue, 0)) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{
                      width: `${tenants.length > 0 ? (selectedTenant.monthlyRevenue / tenants.reduce((s, t) => s + t.monthlyRevenue, 0)) * 100 : 0}%`,
                      minWidth: selectedTenant.monthlyRevenue > 0 ? '2%' : '0%',
                    }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  NPR {nprFull(selectedTenant.monthlyRevenue)} of NPR {nprFull(tenants.reduce((s, t) => s + t.monthlyRevenue, 0))} total platform revenue
                </p>
              </div>

              <Separator />

              {/* Recent Activity Timeline */}
              <div>
                <p className="mb-3 text-sm font-medium">Recent Activity</p>
                <div className="relative space-y-0">
                  {mockTenantActivity.map((activity, i) => (
                    <div key={i} className="flex gap-3 pb-4 last:pb-0">
                      {/* Timeline line + dot */}
                      <div className="flex flex-col items-center">
                        <div className={"mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 " + activityDotColor[activity.type]} />
                        {i < mockTenantActivity.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 -mt-0.5">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(activity.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <Separator />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    toast.info('Subscription management (mock)');
                  }}
                >
                  <Crown className="mr-1.5 h-3 w-3" />
                  Manage Plan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    toast.info('Login as tenant (mock)');
                  }}
                >
                  <Users className="mr-1.5 h-3 w-3" />
                  Login as Tenant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
