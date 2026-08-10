'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  Building2,
  UserCheck,
  FileText,
  ShieldCheck,
  Users,
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  CreditCard,
  TrendingUp,
  Banknote,
  Wallet,
  CircleDollarSign,
} from 'lucide-react';
import { mockVendors, mockPurchaseOrders } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Vendor, PurchaseOrder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getStatusBadgeClasses, formatDate, npr } from '@/lib/helpers';

// ---------- Avatar color palette based on name ----------
const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-violet-500',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ---------- PO Status badge ----------
function getPOStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'received':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'sent':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'partial':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'draft':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// ---------- Mock payment generator ----------
interface VendorPayment {
  id: string;
  paymentNumber: string;
  amount: number;
  method: 'Bank' | 'Cash' | 'eSewa';
  date: string;
  status: 'completed' | 'pending';
}

function generateMockPayments(vendorId: string, vendorPOs: PurchaseOrder[]): VendorPayment[] {
  const receivedPOs = vendorPOs.filter(
    (po) => po.status === 'received' || po.status === 'partial'
  );
  if (receivedPOs.length === 0) return [];

  const totalReceivedValue = receivedPOs.reduce((sum, po) => sum + po.total, 0);
  const methods: Array<'Bank' | 'Cash' | 'eSewa'> = ['Bank', 'Cash', 'eSewa'];

  // Generate 2-3 payments totalling ~70% of received order value
  const targetPaid = Math.round(totalReceivedValue * 0.7);
  const paymentCount = Math.min(receivedPOs.length, 3);
  const payments: VendorPayment[] = [];

  for (let i = 0; i < paymentCount; i++) {
    const po = receivedPOs[i];
    const method = methods[i % methods.length];
    const isLast = i === paymentCount - 1;
    const previousTotal = payments.reduce((s, p) => s + p.amount, 0);
    const amount = isLast ? targetPaid - previousTotal : Math.round(targetPaid / paymentCount);

    payments.push({
      id: `pay-${vendorId}-${i + 1}`,
      paymentNumber: `PAY-${vendorId.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      amount: Math.max(0, amount),
      method,
      date: po.receivedDate || po.orderDate,
      status: isLast ? 'pending' : 'completed',
    });
  }

  return payments;
}

// ---------- Form ----------
interface VendorForm {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  pan: string;
  vatNumber: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
}

const emptyForm: VendorForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  pan: '',
  vatNumber: '',
  address: '',
  city: '',
  status: 'active',
};

// ---------- Component ----------
export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([...mockVendors]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<VendorForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);
  const ITEMS_PER_PAGE = 8;

  // ---------- Summary stats ----------
  const stats = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((v) => v.status === 'active').length;
    const totalOrdersValue = mockPurchaseOrders.reduce((sum, po) => sum + po.total, 0);

    // Outstanding = sum of received/partial POs * 0.3 (70% paid)
    const payablePOs = mockPurchaseOrders.filter(
      (po) => po.status === 'received' || po.status === 'partial'
    );
    const totalReceivedValue = payablePOs.reduce((sum, po) => sum + po.total, 0);
    const totalPaid = Math.round(totalReceivedValue * 0.7);
    const outstanding = totalReceivedValue - totalPaid;

    return { total, active, totalOrdersValue, outstanding };
  }, [vendors]);

  // ---------- Filtered + Paginated ----------
  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch =
        v.name.toLowerCase().includes(q) ||
        v.contactPerson.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // ---------- Vendor view data ----------
  const vendorPOs = useMemo(() => {
    if (!viewVendor) return [];
    return mockPurchaseOrders.filter((po) => po.vendorId === viewVendor.id);
  }, [viewVendor]);

  const vendorPayments = useMemo(() => {
    if (!viewVendor) return [];
    return generateMockPayments(viewVendor.id, vendorPOs);
  }, [viewVendor, vendorPOs]);

  const vendorPaymentStats = useMemo(() => {
    const receivedPOs = vendorPOs.filter(
      (po) => po.status === 'received' || po.status === 'partial'
    );
    const totalOrdered = vendorPOs.reduce((s, po) => s + po.total, 0);
    const totalReceivedValue = receivedPOs.reduce((s, po) => s + po.total, 0);
    const totalPaid = vendorPayments
      .filter((p) => p.status === 'completed')
      .reduce((s, p) => s + p.amount, 0);
    const outstanding = totalReceivedValue - totalPaid;
    return { totalOrdered, totalReceivedValue, totalPaid, outstanding };
  }, [vendorPOs, vendorPayments]);

  // ---------- CRUD handlers ----------
  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (vendor: Vendor) => {
    setEditId(vendor.id);
    setForm({
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      pan: vendor.pan,
      vatNumber: vendor.vatNumber,
      address: vendor.address,
      city: vendor.city,
      status: vendor.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.contactPerson) {
      toast.error('Please fill in required fields (Name, Contact Person)');
      return;
    }
    if (editId) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === editId
            ? {
                ...v,
                name: form.name,
                contactPerson: form.contactPerson,
                email: form.email,
                phone: form.phone,
                pan: form.pan,
                vatNumber: form.vatNumber,
                address: form.address,
                city: form.city,
                status: form.status,
              }
            : v
        )
      );
      toast.success('Vendor updated successfully');
    } else {
      const newVendor: Vendor = {
        id: `v-new-${Date.now()}`,
        name: form.name,
        contactPerson: form.contactPerson,
        email: form.email,
        phone: form.phone,
        pan: form.pan,
        vatNumber: form.vatNumber,
        address: form.address,
        city: form.city,
        status: form.status,
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setVendors((prev) => [newVendor, ...prev]);
      toast.success('Vendor added successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setVendors((prev) => prev.filter((v) => v.id !== deleteId));
    toast.success('Vendor deleted successfully');
    setDeleteId(null);
  };

  // ---------- CSV Export ----------
  const exportCSV = () => {
    const headers = [
      'Name',
      'Contact Person',
      'Email',
      'Phone',
      'PAN',
      'VAT Number',
      'City',
      'Status',
      'Products',
      'Created',
    ];
    const rows = filtered.map((v) => [
      v.name,
      v.contactPerson,
      v.email,
      v.phone,
      v.pan,
      v.vatNumber,
      v.city,
      v.status,
      String(v.productCount),
      v.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vendors">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
      </PageHeader>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Vendors</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders Value</p>
              <p className="text-2xl font-bold">NPR {npr(stats.totalOrdersValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <TrendingUp className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding Payments</p>
              <p className="text-2xl font-bold">NPR {npr(stats.outstanding)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, contact, email..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                  <TableHead>Vendor</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact Person</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">PAN</TableHead>
                  <TableHead className="hidden lg:table-cell">VAT Number</TableHead>
                  <TableHead className="hidden lg:table-cell">City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((vendor) => (
                    <TableRow
                      key={vendor.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      {/* Vendor Name + Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
                              getAvatarColor(vendor.name)
                            )}
                          >
                            {vendor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{vendor.name}</p>
                            <p className="truncate text-xs text-muted-foreground sm:hidden">
                              {vendor.contactPerson}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Person */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {vendor.contactPerson}
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                        {vendor.email}
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="hidden md:table-cell">{vendor.phone}</TableCell>

                      {/* PAN */}
                      <TableCell className="hidden font-mono text-sm lg:table-cell">
                        {vendor.pan}
                      </TableCell>

                      {/* VAT Number */}
                      <TableCell className="hidden font-mono text-sm lg:table-cell">
                        {vendor.vatNumber}
                      </TableCell>

                      {/* City */}
                      <TableCell className="hidden lg:table-cell">{vendor.city}</TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={cn(
                            'capitalize',
                            getStatusBadgeClasses(vendor.status)
                          )}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>

                      {/* Products */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{vendor.productCount}</span>
                        </div>
                      </TableCell>

                      {/* Created */}
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {formatDate(vendor.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewVendor(vendor)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(vendor)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => setDeleteId(vendor.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-4 px-4">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              {filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}-
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== View Vendor Dialog ========== */}
      <Dialog open={!!viewVendor} onOpenChange={(open) => !open && setViewVendor(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {viewVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
                      getAvatarColor(viewVendor.name)
                    )}
                  >
                    {viewVendor.name.charAt(0).toUpperCase()}
                  </div>
                  {viewVendor.name}
                </DialogTitle>
                <DialogDescription>
                  Vendor details, purchase orders & payment tracking
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Purchase Orders</span>
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">Payments</span>
                  </TabsTrigger>
                </TabsList>

                {/* ---- Details Tab ---- */}
                <TabsContent value="details">
                  <div className="grid gap-4 sm:grid-cols-2 mt-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Person</p>
                        <p className="text-sm font-medium mt-1">{viewVendor.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium mt-1">{viewVendor.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium mt-1">{viewVendor.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                        <Badge className={cn('capitalize mt-1', getStatusBadgeClasses(viewVendor.status))}>
                          {viewVendor.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">PAN</p>
                        <p className="text-sm font-mono font-medium mt-1">{viewVendor.pan}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">VAT Number</p>
                        <p className="text-sm font-mono font-medium mt-1">{viewVendor.vatNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</p>
                        <p className="text-sm font-medium mt-1">{viewVendor.address}, {viewVendor.city}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Products Supplied</p>
                        <p className="text-sm font-medium mt-1">{viewVendor.productCount} items</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ---- Purchase Orders Tab ---- */}
                <TabsContent value="orders">
                  {vendorPOs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FileText className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No purchase orders for this vendor.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead className="text-center hidden sm:table-cell">Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vendorPOs.map((po) => (
                            <TableRow key={po.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{po.orderNumber}</TableCell>
                              <TableCell className="text-center hidden sm:table-cell">
                                {po.items.length}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={cn('capitalize', getPOStatusBadgeClasses(po.status))}
                                >
                                  {po.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                NPR {npr(po.total)}
                              </TableCell>
                              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                                {formatDate(po.orderDate)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setViewOrder(po)}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* ---- Payments Tab ---- */}
                <TabsContent value="payments">
                  {vendorPOs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <CreditCard className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No orders or payments for this vendor.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-2">
                      {/* Payment Summary Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <Card>
                          <CardContent className="p-3 text-center">
                            <CircleDollarSign className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                            <p className="text-xs text-muted-foreground">Total Ordered</p>
                            <p className="text-sm font-bold mt-0.5">NPR {npr(vendorPaymentStats.totalOrdered)}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                            <p className="text-xs text-muted-foreground">Total Paid</p>
                            <p className="text-sm font-bold mt-0.5">NPR {npr(vendorPaymentStats.totalPaid)}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-rose-500" />
                            <p className="text-xs text-muted-foreground">Outstanding</p>
                            <p className="text-sm font-bold mt-0.5">NPR {npr(vendorPaymentStats.outstanding)}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Payments Table */}
                      {vendorPayments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No payments recorded yet.
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Payment #</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="hidden sm:table-cell">Method</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {vendorPayments.map((p) => (
                                <TableRow key={p.id} className="hover:bg-muted/50">
                                  <TableCell className="font-medium font-mono text-sm">
                                    {p.paymentNumber}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    NPR {npr(p.amount)}
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <div className="flex items-center gap-1.5">
                                      {p.method === 'Bank' && <Banknote className="h-3.5 w-3.5 text-muted-foreground" />}
                                      {p.method === 'Cash' && <Wallet className="h-3.5 w-3.5 text-muted-foreground" />}
                                      {p.method === 'eSewa' && <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />}
                                      {p.method}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                                    {formatDate(p.date)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={cn('capitalize', getStatusBadgeClasses(p.status))}
                                    >
                                      {p.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ========== Order Detail Dialog ========== */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {viewOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {viewOrder.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Purchase order for {viewOrder.vendorName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {/* Order meta */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn('capitalize', getPOStatusBadgeClasses(viewOrder.status))}>
                    {viewOrder.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Ordered: {formatDate(viewOrder.orderDate)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Expected: {formatDate(viewOrder.expectedDate)}
                  </span>
                  {viewOrder.receivedDate && (
                    <span className="text-sm text-muted-foreground">
                      Received: {formatDate(viewOrder.receivedDate)}
                    </span>
                  )}
                </div>

                {viewOrder.notes && (
                  <p className="text-sm text-muted-foreground italic">{viewOrder.notes}</p>
                )}

                {/* Items table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Received</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            {item.receivedQty}/{item.quantity}
                          </TableCell>
                          <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-medium">
                            NPR {npr(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full max-w-[200px] space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>NPR {npr(viewOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT</span>
                      <span>NPR {npr(viewOrder.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-bold">
                      <span>Total</span>
                      <span>NPR {npr(viewOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
            <DialogDescription>
              {editId
                ? 'Update vendor details'
                : 'Fill in the vendor information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Vendor name"
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.contactPerson}
                  onChange={(e) =>
                    setForm({ ...form, contactPerson: e.target.value })
                  }
                  placeholder="Contact name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@vendor.com.np"
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+977-98XXXXXXXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>PAN</Label>
                <Input
                  value={form.pan}
                  onChange={(e) => setForm({ ...form, pan: e.target.value })}
                  placeholder="301234567"
                />
              </div>
              <div className="grid gap-2">
                <Label>VAT Number</Label>
                <Input
                  value={form.vatNumber}
                  onChange={(e) =>
                    setForm({ ...form, vatNumber: e.target.value })
                  }
                  placeholder="VAT-301234567"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as 'active' | 'inactive' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 text-gray-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editId ? 'Update' : 'Add'} Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vendor? This action cannot
              be undone.
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
