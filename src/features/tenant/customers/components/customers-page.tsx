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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, UserPlus, Search, Mail, Phone, MapPin, Hash, Calendar, TrendingUp, Star, MoreHorizontal, Pencil, Trash2, Eye, Download, ShoppingBag,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { mockCustomers } from '@/lib/mock-data';
import { npr, nprFull, formatDateTime, formatDate, getInitials, getStatusBadgeClasses } from '@/lib/helpers';
import { toast } from 'sonner';
import type { Customer } from '@/lib/types';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

const AVATAR_COLORS = [
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
  { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
  { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
];

function getAvatarColor(name: string) {
  const char = name.trim().charAt(0).toUpperCase();
  const code = char.charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function getPaymentMethodColor(method: string): string {
  switch (method) {
    case 'Cash': return 'bg-emerald-500';
    case 'Card': return 'bg-blue-500';
    case 'eSewa': return 'bg-green-500';
    case 'Khalti': return 'bg-purple-500';
    default: return 'bg-gray-400';
  }
}

const PAYMENT_METHODS = ['Cash', 'Card', 'eSewa', 'Khalti'];
const ORDER_STATUSES: Array<'completed' | 'pending' | 'refunded'> = ['completed', 'completed', 'completed', 'completed', 'pending'];

function generateSpendingTrend(totalSpent: number) {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const base = totalSpent / 6;
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const factor = 0.5 + Math.random() * 1.0;
    return {
      month: months[d.getMonth()],
      amount: Math.round(base * factor),
    };
  });
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateMockOrders(customer: Customer) {
  const statuses = ORDER_STATUSES;
  const seed = simpleHash(customer.id);
  const baseDate = new Date(customer.lastVisit);
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (i + 1) * Math.floor(3 + (seed % 10)));
    const itemCount = 1 + ((seed * (i + 1)) % 5);
    const total = Math.round((customer.totalSpent / Math.max(customer.totalPurchases, 1)) * (0.5 + ((seed * (i + 2)) % 10) / 10) * 100) / 100;
    const payment = PAYMENT_METHODS[(seed + i) % PAYMENT_METHODS.length];
    const status = customer.totalPurchases > 0 ? statuses[i] : 'pending';
    const invNum = `INV-${String(1000 + ((seed + i * 7) % 9000))}`;
    return { invoiceNumber: invNum, date: date.toISOString(), items: itemCount, total, paymentMethod: payment, status };
  });
}

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
  const maxTotalSpent = Math.max(...customers.map(c => c.totalSpent), 1);

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

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'PAN', 'Address', 'Total Purchases', 'Total Spent', 'Last Visit', 'Status'];
    const rows = filtered.map(c => [
      c.name,
      c.email,
      c.phone,
      c.pan,
      c.address,
      String(c.totalPurchases),
      npr(c.totalSpent),
      formatDateTime(c.lastVisit),
      c.isActive ? 'Active' : 'Inactive',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'customers-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage your customer database">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={openAdd} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} className="border-l-4 border-l-blue-500 dark:border-l-blue-400" />
        <StatCard title="Active Customers" value={activeCustomers} icon={Star} iconClassName="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-emerald-600 dark:text-emerald-400" className="border-l-4 border-l-emerald-500 dark:border-l-emerald-400" />
        <StatCard title="Total Revenue" value={`NPR ${npr(totalRevenue)}`} icon={TrendingUp} iconClassName="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" className="border-l-4 border-l-purple-500 dark:border-l-purple-400" />
        <StatCard title="Avg. Spend" value={`NPR ${npr(avgSpend)}`} icon={Calendar} iconClassName="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" className="border-l-4 border-l-amber-500 dark:border-l-amber-400" />
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
                        {(() => {
                          const avatarColor = getAvatarColor(customer.name);
                          return (
                            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', avatarColor.bg, avatarColor.text)}>
                              {getInitials(customer.name)}
                            </div>
                          );
                        })()}
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{customer.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{customer.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm font-mono">{customer.pan || '—'}</TableCell>
                    <TableCell className="text-center text-sm">{customer.totalPurchases}</TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm font-semibold">NPR {npr(customer.totalSpent)}</div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500"
                          style={{ width: `${Math.max((customer.totalSpent / maxTotalSpent) * 100, customer.totalSpent > 0 ? 2 : 0)}%` }}
                        />
                      </div>
                    </TableCell>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (() => {
            const avatarColor = getAvatarColor(viewingCustomer.name);
            const avgOrder = viewingCustomer.totalPurchases > 0 ? Math.round(viewingCustomer.totalSpent / viewingCustomer.totalPurchases) : 0;
            const spendingTrend = generateSpendingTrend(viewingCustomer.totalSpent);
            const mockOrders = generateMockOrders(viewingCustomer);
            return (
              <Tabs defaultValue="overview" className="w-full">
                {/* Header section with gradient background */}
                <div className="bg-gradient-to-b from-muted/30 to-transparent -mx-6 -mt-2 px-6 pt-2 pb-4 rounded-t-lg">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold', avatarColor.bg, avatarColor.text)}>
                      {getInitials(viewingCustomer.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold truncate">{viewingCustomer.name}</h3>
                      <Badge variant="secondary" className={cn('mt-1', viewingCustomer.isActive ? getStatusBadgeClasses('active') : getStatusBadgeClasses('inactive'))}>
                        {viewingCustomer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Stat cards with colored backgrounds */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{viewingCustomer.totalPurchases}</p>
                      <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Purchases</p>
                    </div>
                    <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-400">NPR {npr(viewingCustomer.totalSpent)}</p>
                      <p className="text-[11px] text-purple-600/70 dark:text-purple-400/70">Total Spent</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400">NPR {npr(avgOrder)}</p>
                      <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70">Avg. Order</p>
                    </div>
                  </div>
                </div>

                <TabsList className="mt-2 w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">Purchase History</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-3">
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

                  {/* Spending trend sparkline */}
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Spending Trend</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Last 6 months</span>
                    </div>
                    <div className="h-[60px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendingTrend} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                          <defs>
                            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#spendingGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>Customer since: {formatDate(viewingCustomer.createdAt)}</span>
                    <span>Last visit: {formatDateTime(viewingCustomer.lastVisit)}</span>
                  </div>
                </TabsContent>

                {/* Purchase History Tab */}
                <TabsContent value="history" className="mt-3">
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Invoice #</TableHead>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-center text-xs">Items</TableHead>
                          <TableHead className="text-xs">Payment</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-right text-xs">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockOrders.map((order, idx) => (
                          <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                            <TableCell className="text-xs font-mono font-medium">{order.invoiceNumber}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(order.date)}</TableCell>
                            <TableCell className="text-center text-xs">{order.items}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className={cn('inline-block h-[3px] w-[3px] rounded-full', getPaymentMethodColor(order.paymentMethod))} />
                                <span className="text-xs">{order.paymentMethod}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={cn('text-[10px]', getStatusBadgeClasses(order.status))}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs font-semibold">NPR {nprFull(order.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 text-center">
                    Showing 5 most recent of {viewingCustomer.totalPurchases} total purchases
                  </p>
                </TabsContent>

                {/* Action buttons */}
                <div className="flex justify-between pt-2 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { toast.info('Email compose would open here'); }}>
                      <Mail className="h-3.5 w-3.5" /> Send Email
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { toast.info('POS would open with this customer pre-selected'); }}>
                      <ShoppingBag className="h-3.5 w-3.5" /> New Sale
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { openEdit(viewingCustomer); setDetailOpen(false); }}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDetailOpen(false)}>Close</Button>
                  </div>
                </div>
              </Tabs>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
