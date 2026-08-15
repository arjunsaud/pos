'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, UserPlus, Search, Mail, Phone, MapPin, Hash, Calendar,
  TrendingUp, Star, MoreHorizontal, Pencil, Trash2, Eye, Download,
  ShoppingBag, Coins, CreditCard, Plus, Gift, Banknote, AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useCustomers, useSales } from '@/hooks/use-api-data';
import { npr, nprFull, formatDateTime, formatDate, getInitials, getStatusBadgeClasses } from '@/lib/helpers';
import { toast } from 'sonner';
import type { Customer, Sale } from '@/lib/types';
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

type SortField = 'name' | 'totalSpent' | 'totalPurchases' | 'lastVisit';
type SortDir = 'asc' | 'desc';

export default function CustomersPage() {
  const mockCustomers = useCustomers().items;
  const mockSales = useSales().items;

  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  useEffect(() => {

    setCustomers(mockCustomers);

  }, [mockCustomers]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('totalSpent');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', pan: '', address: '', creditLimit: '0' });

  // Loyalty dialog state
  const [loyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);
  const [loyaltyAction, setLoyaltyAction] = useState<'add' | 'redeem'>('add');
  const [loyaltyPoints, setLoyaltyPoints] = useState('');
  const [loyaltyReason, setLoyaltyReason] = useState('');

  // Credit dialogs state
  const [creditPayDialogOpen, setCreditPayDialogOpen] = useState(false);
  const [creditExtendDialogOpen, setCreditExtendDialogOpen] = useState(false);
  const [creditPayAmount, setCreditPayAmount] = useState('');
  const [creditPayMethod, setCreditPayMethod] = useState('Cash');
  const [creditExtendAmount, setCreditExtendAmount] = useState('');

  // Purchase history dialog
  const [purchaseHistoryOpen, setPurchaseHistoryOpen] = useState(false);
  const [purchaseHistoryCustomer, setPurchaseHistoryCustomer] = useState<Customer | null>(null);

  // Main tabs
  const [mainTab, setMainTab] = useState('customers');

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

  // Summary calculations
  const totalCustomers = customers.length;
  const activeCredit = customers.reduce((s, c) => s + c.creditBalance, 0);
  const totalLoyaltyPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalPurchases = customers.reduce((s, c) => s + c.totalPurchases, 0);
  const avgPurchaseValue = totalPurchases > 0 ? Math.round(totalRevenue / totalPurchases) : 0;
  const maxTotalSpent = Math.max(...customers.map(c => c.totalSpent), 1);

  // Credit overview data
  const creditCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers
      .filter(c => c.creditBalance > 0 && (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q)))
      .map(c => {
        const utilization = c.creditLimit > 0 ? Math.round((c.creditBalance / c.creditLimit) * 100) : 0;
        const seed = simpleHash(c.id);
        const overdueDays = c.creditBalance > 0 ? Math.floor((seed % 30) + 1) : 0;
        return { ...c, utilization, overdueDays };
      });
  }, [customers, search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const openAdd = () => {
    setEditingCustomer(null);
    setForm({ name: '', email: '', phone: '', pan: '', address: '', creditLimit: '0' });
    setDialogOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, pan: c.pan, address: c.address, creditLimit: String(c.creditLimit) });
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
          ? { ...c, ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), pan: form.pan.trim(), address: form.address.trim(), creditLimit: Number(form.creditLimit) || 0 }
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
        loyaltyPoints: 0,
        creditBalance: 0,
        creditLimit: Number(form.creditLimit) || 0,
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

  // Loyalty handlers
  const openLoyaltyDialog = (customer: Customer, action: 'add' | 'redeem') => {
    setViewingCustomer(customer);
    setLoyaltyAction(action);
    setLoyaltyPoints('');
    setLoyaltyReason('');
    setLoyaltyDialogOpen(true);
  };

  const handleLoyaltySubmit = () => {
    const pts = parseInt(loyaltyPoints);
    if (!pts || pts <= 0) { toast.error('Enter valid points'); return; }
    if (!viewingCustomer) return;
    if (loyaltyAction === 'redeem' && pts > viewingCustomer.loyaltyPoints) {
      toast.error(`Cannot redeem more than ${viewingCustomer.loyaltyPoints} points`);
      return;
    }
    setCustomers(prev => prev.map(c =>
      c.id === viewingCustomer.id
        ? { ...c, loyaltyPoints: c.loyaltyPoints + (loyaltyAction === 'add' ? pts : -pts) }
        : c
    ));
    toast.success(loyaltyAction === 'add' ? `Added ${pts} loyalty points` : `Redeemed ${pts} loyalty points`);
    setLoyaltyDialogOpen(false);
    setViewingCustomer(prev => prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + (loyaltyAction === 'add' ? pts : -pts) } : null);
  };

  // Credit handlers
  const openCreditPay = (customer: Customer) => {
    setViewingCustomer(customer);
    setCreditPayAmount('');
    setCreditPayMethod('Cash');
    setCreditPayDialogOpen(true);
  };

  const openCreditExtend = (customer: Customer) => {
    setViewingCustomer(customer);
    setCreditExtendAmount('');
    setCreditExtendDialogOpen(true);
  };

  const handleCreditPay = () => {
    const amt = parseFloat(creditPayAmount);
    if (!amt || amt <= 0) { toast.error('Enter valid amount'); return; }
    if (!viewingCustomer) return;
    if (amt > viewingCustomer.creditBalance) {
      toast.error(`Amount cannot exceed credit balance of ${npr(viewingCustomer.creditBalance)}`);
      return;
    }
    setCustomers(prev => prev.map(c =>
      c.id === viewingCustomer.id
        ? { ...c, creditBalance: Math.max(0, c.creditBalance - amt) }
        : c
    ));
    toast.success(`Payment of ${npr(amt)} recorded via ${creditPayMethod}`);
    setCreditPayDialogOpen(false);
    setViewingCustomer(prev => prev ? { ...prev, creditBalance: Math.max(0, prev.creditBalance - amt) } : null);
  };

  const handleCreditExtend = () => {
    const amt = parseFloat(creditExtendAmount);
    if (!amt || amt <= 0) { toast.error('Enter valid amount'); return; }
    if (!viewingCustomer) return;
    setCustomers(prev => prev.map(c =>
      c.id === viewingCustomer.id
        ? { ...c, creditLimit: c.creditLimit + amt }
        : c
    ));
    toast.success(`Credit limit extended by ${npr(amt)}. New limit: ${npr(viewingCustomer.creditLimit + amt)}`);
    setCreditExtendDialogOpen(false);
    setViewingCustomer(prev => prev ? { ...prev, creditLimit: prev.creditLimit + amt } : null);
  };

  // Purchase history handler
  const openPurchaseHistory = (customer: Customer) => {
    setPurchaseHistoryCustomer(customer);
    setPurchaseHistoryOpen(true);
  };

  const customerSales = useMemo(() => {
    if (!purchaseHistoryCustomer) return [];
    return mockSales.filter(s => s.customerName === purchaseHistoryCustomer.name);
  }, [purchaseHistoryCustomer]);

  const sortIcon = (field: SortField) => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕';

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'PAN', 'Address', 'Total Purchases', 'Total Spent', 'Loyalty Points', 'Credit Balance', 'Credit Limit', 'Last Visit', 'Status'];
    const rows = filtered.map(c => [
      c.name, c.email, c.phone, c.pan, c.address,
      String(c.totalPurchases), npr(c.totalSpent), String(c.loyaltyPoints),
      npr(c.creditBalance), npr(c.creditLimit), formatDateTime(c.lastVisit),
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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} className="border-l-4 border-l-blue-500 dark:border-l-blue-400" />
        <StatCard title="Active Credit" value={`NPR ${npr(activeCredit)}`} icon={CreditCard} iconClassName="bg-rose-100 dark:bg-rose-900/30" iconColor="text-rose-600 dark:text-rose-400" className="border-l-4 border-l-rose-500 dark:border-l-rose-400" />
        <StatCard title="Total Loyalty Points" value={totalLoyaltyPoints.toLocaleString()} icon={Gift} iconClassName="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" className="border-l-4 border-l-amber-500 dark:border-l-amber-400" />
        <StatCard title="Avg. Purchase Value" value={`NPR ${npr(avgPurchaseValue)}`} icon={TrendingUp} iconClassName="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-emerald-600 dark:text-emerald-400" className="border-l-4 border-l-emerald-500 dark:border-l-emerald-400" />
      </div>

      {/* Main Tabs: Customer List | Credit Overview */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="customers" className="gap-1.5"><Users className="h-4 w-4" /> Customer List</TabsTrigger>
          <TabsTrigger value="credit" className="gap-1.5"><CreditCard className="h-4 w-4" /> Credit Overview</TabsTrigger>
        </TabsList>

        {/* Customer List Tab */}
        <TabsContent value="customers">
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
                    <TableHead className="hidden lg:table-cell text-center">Points</TableHead>
                    <TableHead className="hidden lg:table-cell text-right">Credit</TableHead>
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
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
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
                              <div className="text-xs text-muted-foreground truncate">{customer.email || '—'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{customer.phone || '—'}</TableCell>
                        <TableCell className="hidden lg:table-cell text-center">
                          {customer.loyaltyPoints > 0 ? (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 gap-1 text-xs">
                              <Coins className="h-3 w-3" /> {customer.loyaltyPoints}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right">
                          {customer.creditBalance > 0 ? (
                            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">{npr(customer.creditBalance)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
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
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{customer.lastVisit ? formatDateTime(customer.lastVisit) : '—'}</TableCell>
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openPurchaseHistory(customer); }}>
                                <ShoppingBag className="mr-2 h-4 w-4" /> Purchase History
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
        </TabsContent>

        {/* Credit Overview Tab */}
        <TabsContent value="credit">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base">Customers with Active Credit</CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
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
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Credit Balance</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Credit Limit</TableHead>
                      <TableHead className="w-[180px]">Utilization</TableHead>
                      <TableHead className="text-center hidden md:table-cell">Overdue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No customers with active credit.
                        </TableCell>
                      </TableRow>
                    ) : (
                      creditCustomers.map((c) => (
                        <TableRow key={c.id} className="transition-colors hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(c.name).bg, getAvatarColor(c.name).text)}>
                                {getInitials(c.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium truncate">{c.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{c.phone}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">NPR {npr(c.creditBalance)}</span>
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell text-sm">
                            NPR {npr(c.creditLimit)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={c.utilization}
                                className={cn(
                                  'h-2 flex-1',
                                  c.utilization >= 80 ? '[&>div]:bg-rose-500' : c.utilization >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                                )}
                              />
                              <span className={cn(
                                'text-xs font-medium w-10 text-right',
                                c.utilization >= 80 ? 'text-rose-600 dark:text-rose-400' : c.utilization >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                              )}>
                                {c.utilization}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {c.overdueDays > 0 ? (
                              <Badge variant="secondary" className={cn(
                                'gap-1 border-0',
                                c.overdueDays > 14 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              )}>
                                <AlertTriangle className="h-3 w-3" />
                                {c.overdueDays}d
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => openCreditPay(c)}>
                                <Banknote className="h-3 w-3" /> Pay
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => openCreditExtend(c)}>
                                <Plus className="h-3 w-3" /> Extend
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Credit summary footer */}
              {creditCustomers.length > 0 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {creditCustomers.length} customer{creditCustomers.length !== 1 ? 's' : ''} with active credit
                  </p>
                  <p className="text-sm font-semibold">
                    Total Outstanding: <span className="text-rose-600 dark:text-rose-400">NPR {npr(creditCustomers.reduce((s, c) => s + c.creditBalance, 0))}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Credit Limit (NPR)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.creditLimit}
                  onChange={e => setForm(f => ({ ...f, creditLimit: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Loyalty Points</Label>
                <Input value={editingCustomer ? String(editingCustomer.loyaltyPoints) : '0'} disabled className="bg-muted" />
                <p className="text-[11px] text-muted-foreground">Points start at 0 for new customers</p>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (() => {
            const avatarColor = getAvatarColor(viewingCustomer.name);
            const avgOrder = viewingCustomer.totalPurchases > 0 ? Math.round(viewingCustomer.totalSpent / viewingCustomer.totalPurchases) : 0;
            const spendingTrend = generateSpendingTrend(viewingCustomer.totalSpent);
            const creditUtil = viewingCustomer.creditLimit > 0 ? Math.round((viewingCustomer.creditBalance / viewingCustomer.creditLimit) * 100) : 0;
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

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{viewingCustomer.totalPurchases}</p>
                      <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Purchases</p>
                    </div>
                    <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-400">NPR {npr(viewingCustomer.totalSpent)}</p>
                      <p className="text-[11px] text-purple-600/70 dark:text-purple-400/70">Total Spent</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                        <Coins className="h-4 w-4" /> {viewingCustomer.loyaltyPoints}
                      </p>
                      <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70">Loyalty Points</p>
                    </div>
                    <div className="rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/20 p-3 text-center transition-shadow hover:shadow-md">
                      <p className="text-lg font-bold text-rose-700 dark:text-rose-400">NPR {npr(viewingCustomer.creditBalance)}</p>
                      <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70">Credit Due</p>
                    </div>
                  </div>
                </div>

                <TabsList className="mt-2 w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="loyalty" className="flex-1 gap-1"><Coins className="h-3.5 w-3.5" /> Loyalty</TabsTrigger>
                  <TabsTrigger value="credit" className="flex-1 gap-1"><CreditCard className="h-3.5 w-3.5" /> Credit</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">Purchases</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-3">
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
                        <p className="text-sm">{viewingCustomer.phone || '—'}</p>
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

                  <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>Customer since: {formatDate(viewingCustomer.createdAt)}</span>
                    <span>Last visit: {viewingCustomer.lastVisit ? formatDateTime(viewingCustomer.lastVisit) : '—'}</span>
                  </div>
                </TabsContent>

                {/* Loyalty Tab */}
                <TabsContent value="loyalty" className="space-y-4 mt-3">
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 text-center">
                    <Gift className="h-10 w-10 mx-auto text-amber-500 mb-3" />
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{viewingCustomer.loyaltyPoints}</p>
                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1">Loyalty Points Balance</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 border-dashed"
                      onClick={() => openLoyaltyDialog(viewingCustomer, 'add')}
                    >
                      <Plus className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium">Add Points</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 border-dashed"
                      onClick={() => openLoyaltyDialog(viewingCustomer, 'redeem')}
                      disabled={viewingCustomer.loyaltyPoints === 0}
                    >
                      <Gift className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">Redeem Points</span>
                    </Button>
                  </div>
                </TabsContent>

                {/* Credit Tab */}
                <TabsContent value="credit" className="space-y-4 mt-3">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Credit Balance</span>
                        <CreditCard className="h-4 w-4 text-rose-500" />
                      </div>
                      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">NPR {npr(viewingCustomer.creditBalance)}</p>
                      <p className="text-xs text-muted-foreground mt-1">of NPR {npr(viewingCustomer.creditLimit)} limit</p>
                    </div>
                    <div className="rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Available Credit</span>
                        <Banknote className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">NPR {npr(viewingCustomer.creditLimit - viewingCustomer.creditBalance)}</p>
                      <p className="text-xs text-muted-foreground mt-1">remaining on credit line</p>
                    </div>
                  </div>

                  {/* Credit utilization bar */}
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Credit Utilization</span>
                      <span className={cn(
                        'text-sm font-semibold',
                        creditUtil >= 80 ? 'text-rose-600 dark:text-rose-400' : creditUtil >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      )}>
                        {creditUtil}%
                      </span>
                    </div>
                    <Progress
                      value={creditUtil}
                      className={cn(
                        'h-3',
                        creditUtil >= 80 ? '[&>div]:bg-rose-500' : creditUtil >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                      )}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      className="gap-2"
                      onClick={() => openCreditPay(viewingCustomer)}
                      disabled={viewingCustomer.creditBalance === 0}
                    >
                      <Banknote className="h-4 w-4" /> Record Payment
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => openCreditExtend(viewingCustomer)}
                    >
                      <Plus className="h-4 w-4" /> Extend Credit Limit
                    </Button>
                  </div>
                </TabsContent>

                {/* Purchase History Tab (from mockSales) */}
                <TabsContent value="history" className="mt-3">
                  {(() => {
                    const sales = mockSales.filter(s => s.customerName === viewingCustomer.name);
                    if (sales.length === 0) {
                      return (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                          <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">No purchase history from mockSales data.</p>
                          <p className="text-xs text-muted-foreground mt-1">Showing {viewingCustomer.totalPurchases} total purchases recorded.</p>
                        </div>
                      );
                    }
                    return (
                      <div className="rounded-xl border overflow-hidden">
                        <div className="max-h-72 overflow-y-auto">
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
                              {sales.map((sale: Sale) => (
                                <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                                  <TableCell className="text-xs font-mono font-medium">{sale.invoiceNumber}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{formatDate(sale.date)}</TableCell>
                                  <TableCell className="text-center text-xs">{sale.items.length}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5">
                                      <span className={cn('inline-block h-[3px] w-[3px] rounded-full', getPaymentMethodColor(sale.paymentMethod))} />
                                      <span className="text-xs">{sale.paymentMethod}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className={cn('text-[10px]', getStatusBadgeClasses(sale.status))}>
                                      {sale.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right text-xs font-semibold">NPR {nprFull(sale.total)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2 text-center">
                          Showing {sales.length} sale{sales.length !== 1 ? 's' : ''} from mockSales for this customer
                        </p>
                      </div>
                    );
                  })()}
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

      {/* Loyalty Points Dialog (Add/Redeem) */}
      <Dialog open={loyaltyDialogOpen} onOpenChange={setLoyaltyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              {loyaltyAction === 'add' ? 'Add Loyalty Points' : 'Redeem Loyalty Points'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {viewingCustomer && (
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(viewingCustomer.name).bg, getAvatarColor(viewingCustomer.name).text)}>
                  {getInitials(viewingCustomer.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{viewingCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">Current balance: <span className="font-semibold text-amber-600 dark:text-amber-400">{viewingCustomer.loyaltyPoints} points</span></p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Points ({loyaltyAction === 'add' ? 'to add' : 'to redeem'}) *</Label>
              <Input
                type="number"
                min="1"
                max={loyaltyAction === 'redeem' ? (viewingCustomer?.loyaltyPoints ?? 0) : undefined}
                value={loyaltyPoints}
                onChange={e => setLoyaltyPoints(e.target.value)}
                placeholder="Enter points"
              />
              {loyaltyAction === 'redeem' && viewingCustomer && (
                <p className="text-[11px] text-muted-foreground">Maximum redeemable: {viewingCustomer.loyaltyPoints} points</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                value={loyaltyReason}
                onChange={e => setLoyaltyReason(e.target.value)}
                placeholder={loyaltyAction === 'add' ? 'e.g., Purchase reward, Birthday bonus' : 'e.g., Discount redemption'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoyaltyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLoyaltySubmit} className={loyaltyAction === 'add' ? '' : 'bg-amber-600 hover:bg-amber-700'}>
              {loyaltyAction === 'add' ? 'Add Points' : 'Redeem Points'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={creditPayDialogOpen} onOpenChange={setCreditPayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-emerald-500" />
              Record Credit Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {viewingCustomer && (
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(viewingCustomer.name).bg, getAvatarColor(viewingCustomer.name).text)}>
                  {getInitials(viewingCustomer.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{viewingCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">Outstanding: <span className="font-semibold text-rose-600 dark:text-rose-400">NPR {npr(viewingCustomer.creditBalance)}</span></p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Payment Amount (NPR) *</Label>
              <Input
                type="number"
                min="1"
                max={viewingCustomer?.creditBalance ?? 0}
                value={creditPayAmount}
                onChange={e => setCreditPayAmount(e.target.value)}
                placeholder="Enter amount"
              />
              {viewingCustomer && (
                <p className="text-[11px] text-muted-foreground">Maximum: NPR {npr(viewingCustomer.creditBalance)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={creditPayMethod} onValueChange={setCreditPayMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="eSewa">eSewa</SelectItem>
                  <SelectItem value="Khalti">Khalti</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditPayDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreditPay}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Credit Dialog */}
      <Dialog open={creditExtendDialogOpen} onOpenChange={setCreditExtendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Extend Credit Limit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {viewingCustomer && (
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(viewingCustomer.name).bg, getAvatarColor(viewingCustomer.name).text)}>
                  {getInitials(viewingCustomer.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{viewingCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">Current limit: <span className="font-semibold">NPR {npr(viewingCustomer.creditLimit)}</span></p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Additional Credit (NPR) *</Label>
              <Input
                type="number"
                min="1"
                value={creditExtendAmount}
                onChange={e => setCreditExtendAmount(e.target.value)}
                placeholder="Enter additional credit amount"
              />
            </div>
            {viewingCustomer && creditExtendAmount && parseFloat(creditExtendAmount) > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <span className="text-muted-foreground">New credit limit will be: </span>
                <span className="font-semibold">NPR {npr(viewingCustomer.creditLimit + (parseFloat(creditExtendAmount) || 0))}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditExtendDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreditExtend}>Extend Limit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase History Dialog (standalone, opened from table actions) */}
      <Dialog open={purchaseHistoryOpen} onOpenChange={setPurchaseHistoryOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Purchase History — {purchaseHistoryCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          {purchaseHistoryCustomer && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">{purchaseHistoryCustomer.totalPurchases}</p>
                  <p className="text-[11px] text-muted-foreground">Total Orders</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">NPR {npr(purchaseHistoryCustomer.totalSpent)}</p>
                  <p className="text-[11px] text-muted-foreground">Total Spent</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">NPR {purchaseHistoryCustomer.totalPurchases > 0 ? npr(Math.round(purchaseHistoryCustomer.totalSpent / purchaseHistoryCustomer.totalPurchases)) : '0'}</p>
                  <p className="text-[11px] text-muted-foreground">Avg. Order</p>
                </div>
              </div>

              {customerSales.length > 0 ? (
                <div className="rounded-xl border overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
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
                        {customerSales.map((sale: Sale) => (
                          <TableRow key={sale.id} className="transition-colors hover:bg-muted/50">
                            <TableCell className="text-xs font-mono font-medium">{sale.invoiceNumber}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(sale.date)}</TableCell>
                            <TableCell className="text-center text-xs">{sale.items.length}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className={cn('inline-block h-[3px] w-[3px] rounded-full', getPaymentMethodColor(sale.paymentMethod))} />
                                <span className="text-xs">{sale.paymentMethod}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={cn('text-[10px]', getStatusBadgeClasses(sale.status))}>
                                {sale.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs font-semibold">NPR {nprFull(sale.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No sales found in mockSales for this customer.</p>
                  <p className="text-xs text-muted-foreground mt-1">This customer has {purchaseHistoryCustomer.totalPurchases} recorded purchases.</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}