'use client';

import { useState, useMemo } from 'react';
import { Store, Search, Truck, UserCheck, FileCheck, Receipt, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, getStatusBadgeClasses } from '@/lib/helpers';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockVendors } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Vendor } from '@/lib/types';

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

export default function SATenantVendors() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filtered = useMemo(() => {
    return mockVendors.filter(v => {
      const matchSearch = !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const summary = useMemo(() => ({
    total: mockVendors.length,
    active: mockVendors.filter(v => v.status === 'active').length,
    withPAN: mockVendors.filter(v => v.pan).length,
    withVAT: mockVendors.filter(v => v.vatNumber).length,
  }), []);

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Vendors" description="Vendor management for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Vendors', value: summary.total, icon: Truck, color: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-600 dark:text-sky-400' },
          { label: 'Active', value: summary.active, icon: UserCheck, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'With PAN', value: summary.withPAN, icon: FileCheck, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'With VAT', value: summary.withVAT, icon: Receipt, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
        ].map(s => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn('rounded-lg p-3', s.color)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or contact..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
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

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact Person</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">PAN</TableHead>
                  <TableHead className="hidden lg:table-cell">VAT</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Products</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No vendors found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map(vendor => (
                    <TableRow key={vendor.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{vendor.contactPerson}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[160px] truncate">{vendor.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{vendor.phone}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{vendor.pan}</TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">{vendor.vatNumber}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{vendor.city}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClasses(vendor.status)}>{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right font-medium">{vendor.productCount}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{formatDate(vendor.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedVendor(vendor)}>
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

      {/* Vendor Detail Dialog */}
      <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {selectedVendor.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{selectedVendor.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeClasses(selectedVendor.status)}>{selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedVendor.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PAN Number</p>
                    <p className="font-mono font-medium">{selectedVendor.pan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">VAT Number</p>
                    <p className="font-mono font-medium">{selectedVendor.vatNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedVendor.address}, {selectedVendor.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Products Supplied</p>
                    <p className="text-xl font-bold">{selectedVendor.productCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedVendor.createdAt)}</p>
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
