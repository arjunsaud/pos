'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Users, UserPlus, Search, Mail, Phone, MapPin, Hash, Calendar, TrendingUp, Star, MoreHorizontal, Pencil, Trash2, Eye,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockCustomers } from '@/lib/mock-data';
import { npr, formatDateTime, formatDate, getInitials, getStatusBadgeClasses } from '@/lib/helpers';
import { toast } from 'sonner';
import type { Customer } from '@/lib/types';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

type SortField = 'name' | 'totalSpent' | 'totalPurchases' | 'lastVisit';
type SortDir = 'asc' | 'desc';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('totalSpent');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', pan: '', address: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = customers.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q) || c.pan.includes(q)
    );
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'totalSpent') cmp = a.totalSpent - b.totalSpent;
      else if (sortField === 'totalPurchases') cmp = a.totalPurchases - b.totalPurchases;
      else if (sortField === 'lastVisit') cmp = a.lastVisit.localeCompare(b.lastVisit);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [customers, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpend = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const openAdd = () => {
    setEditingCustomer(null);
    setForm({ name: '', email: '', phone: '', pan: '', address: '' });
    setDialogOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, pan: c.pan, address: c.address });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    if (editingCustomer) {
      setCustomers(prev => prev.map(c =>
        c.id === editingCustomer.id
          ? { ...c, ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), pan: form.pan.trim(), address: form.address.trim() }
          : c
      ));
      toast.success('Customer updated');
    } else {
      const newCustomer: Customer = {
        id: `c-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pan: form.pan.trim(),
        address: form.address.trim(),
        totalPurchases: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString(),
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      setCustomers(prev => [newCustomer, ...prev]);
      toast.success('Customer added');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    toast.success('Customer deleted');
  };

  const toggleActive = (id: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
    toast.success('Status updated');
  };

  const sortIcon = (field: SortField) => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕';

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage your customer database">
        <Button onClick={openAdd} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} />
        <StatCard title="Active Customers" value={activeCustomers} icon={Star} iconClassName="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-emerald-600 dark:text-emerald-400" />
        <StatCard title="Total Revenue" value={`NPR ${npr(totalRevenue)}`} icon={TrendingUp} iconClassName="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" />
        <StatCard title="Avg. Spend" value={`NPR ${npr(avgSpend)}`} icon={Calendar} iconClassName="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">All Customers</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, PAN..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px] cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Customer <span className="ml-1 text-[10px] opacity-50">{sortIcon('name')}</span>
                </TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">PAN</TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort('totalPurchases')}>
                  Purchases <span className="ml-1 text-[10px] opacity-50">{sortIcon('totalPurchases')}</span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort('totalSpent')}>
                  Total Spent <span className="ml-1 text-[10px] opacity-50">{sortIcon('totalSpent')}</span>
                </TableHead>
                <TableHead className="hidden sm:table-cell cursor-pointer select-none" onClick={() => handleSort('lastVisit')}>
                  Last Visit <span className="ml-1 text-[10px] opacity-50">{sortIcon('lastVisit')}</span>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="group cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => { setViewingCustomer(customer); setDetailOpen(true); }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(customer.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{customer.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{customer.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm font-mono">{customer.pan || '—'}</TableCell>
                    <TableCell className="text-center text-sm">{customer.totalPurchases}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">NPR {npr(customer.totalSpent)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{formatDateTime(customer.lastVisit)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn('text-xs', customer.isActive ? getStatusBadgeClasses('active') : getStatusBadgeClasses('inactive'))}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingCustomer(customer); setDetailOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEdit(customer); }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleActive(customer.id); }}>
                            {customer.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Customer name" />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+977-98XXXXXXXX" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input value={form.pan} onChange={e => setForm(f => ({ ...f, pan: e.target.value }))} placeholder="XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Area, City" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingCustomer ? 'Save Changes' : 'Add Customer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              {/* Header with avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {getInitials(viewingCustomer.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold truncate">{viewingCustomer.name}</h3>
                  <Badge variant="secondary" className={cn('mt-1', viewingCustomer.isActive ? getStatusBadgeClasses('active') : getStatusBadgeClasses('inactive'))}>
                    {viewingCustomer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Contact info grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 rounded-lg border p-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Email</p>
                    <p className="text-sm truncate">{viewingCustomer.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border p-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Phone</p>
                    <p className="text-sm">{viewingCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border p-3">
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">PAN</p>
                    <p className="text-sm font-mono">{viewingCustomer.pan || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border p-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Address</p>
                    <p className="text-sm truncate">{viewingCustomer.address || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="text-lg font-bold">{viewingCustomer.totalPurchases}</p>
                  <p className="text-[11px] text-muted-foreground">Purchases</p>
                </div>
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="text-lg font-bold">NPR {npr(viewingCustomer.totalSpent)}</p>
                  <p className="text-[11px] text-muted-foreground">Total Spent</p>
                </div>
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="text-lg font-bold">NPR {npr(viewingCustomer.totalPurchases > 0 ? Math.round(viewingCustomer.totalSpent / viewingCustomer.totalPurchases) : 0)}</p>
                  <p className="text-[11px] text-muted-foreground">Avg. Order</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                <span>Customer since: {formatDate(viewingCustomer.createdAt)}</span>
                <span>Last visit: {formatDateTime(viewingCustomer.lastVisit)}</span>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { openEdit(viewingCustomer); setDetailOpen(false); }}>Edit</Button>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
