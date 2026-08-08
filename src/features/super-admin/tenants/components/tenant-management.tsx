'use client';

import { useState } from 'react';
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
import {
  Plus,
  Search,
  Eye,
  ToggleLeft,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockTenants } from '@/lib/mock-data';
import type { Tenant, PlanType, TenantStatus } from '@/lib/types';
import { npr, getStatusBadgeClasses } from '@/lib/helpers';

const planBadgeVariant: Record<PlanType, 'secondary' | 'default' | 'outline'> = {
  basic: 'secondary',
  pro: 'default',
  enterprise: 'outline',
};

type StatusFilter = 'all' | 'active' | 'inactive';

const ITEMS_PER_PAGE = 5;

export default function TenantManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Add form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formPlan, setFormPlan] = useState<PlanType>('basic');

  // Local tenant list for toggle/delete
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const pagedTenants = filteredTenants.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

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
    setFormPlan('basic');
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
                <Select value={formPlan} onValueChange={(v: PlanType) => setFormPlan(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
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
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Products</TableHead>
                <TableHead className="hidden sm:table-cell">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedTenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No tenants found.
                  </TableCell>
                </TableRow>
              ) : (
                pagedTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {tenant.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={planBadgeVariant[tenant.plan]}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>Full information for the tenant.</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{selectedTenant.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="text-sm font-medium">{selectedTenant.ownerName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedTenant.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedTenant.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Domain</p>
                  <p className="text-sm font-medium">{selectedTenant.domain}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <Badge variant={planBadgeVariant[selectedTenant.plan]}>
                    {selectedTenant.plan.charAt(0).toUpperCase() + selectedTenant.plan.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    className={getStatusBadgeClasses(selectedTenant.status)}
                  >
                    {selectedTenant.status.charAt(0).toUpperCase() + selectedTenant.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{selectedTenant.createdAt}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Products</p>
                  <p className="text-sm font-medium">{selectedTenant.productCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                  <p className="text-sm font-medium">
                    NPR {npr(selectedTenant.monthlyRevenue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
