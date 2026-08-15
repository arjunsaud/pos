'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Plus,
  Eye,
  PackageCheck,
  XCircle,
  Download,
  Search,
  FileText,
  Truck,
  Minus,
  X,
  CircleDot,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { usePurchases, useVendors, useProducts } from '@/hooks/use-api-data';
import { npr, nprFull, formatDate } from '@/lib/helpers';
import { toast } from 'sonner';
import type { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '@/lib/types';

// ---------- Helpers ----------

function getStatusBadgeClasses(status: PurchaseOrderStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400';
    case 'sent':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'partial':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'received':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusLabel(status: PurchaseOrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const VIT_RATE = 0.13;
const ITEMS_PER_PAGE = 10;

// ---------- Types for create form ----------

interface CreateFormItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

// ---------- Component ----------

export default function PurchaseManagement() {
  const mockPurchaseOrders = usePurchases().items;
  const mockVendors = useVendors().items;
  const mockProducts = useProducts().items;

  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  useEffect(() => {

    setOrders(mockPurchaseOrders);

  }, [mockPurchaseOrders]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('orders');

  // View dialog
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);

  // Receive dialog
  const [receiveOrder, setReceiveOrder] = useState<PurchaseOrder | null>(null);
  const [receiveItems, setReceiveItems] = useState<Record<string, number>>({});

  // Create form state
  const [createVendorId, setCreateVendorId] = useState('');
  const [createItems, setCreateItems] = useState<CreateFormItem[]>([]);
  const [createProductSearch, setCreateProductSearch] = useState('');
  const [createNotes, setCreateNotes] = useState('');
  const [createExpectedDate, setCreateExpectedDate] = useState('');

  // ---------- Computed stats ----------

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'draft' || o.status === 'sent').length;
    const inTransit = orders.filter((o) => o.status === 'sent' || o.status === 'partial').length;
    const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
    return { totalOrders, pendingOrders, inTransit, totalValue };
  }, [orders]);

  // ---------- Filtering ----------

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page on filter change
  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleStatusFilterChange = (val: string) => { setStatusFilter(val); setPage(1); };

  // ---------- Create form helpers ----------

  const filteredCreateProducts = useMemo(() => {
    const addedIds = new Set(createItems.map((i) => i.productId));
    return mockProducts.filter(
      (p) =>
        p.isActive &&
        !addedIds.has(p.id) &&
        (p.name.toLowerCase().includes(createProductSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(createProductSearch.toLowerCase())),
    );
  }, [createProductSearch, createItems]);

  const createSubtotal = useMemo(
    () => createItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [createItems],
  );
  const createVat = createSubtotal * VIT_RATE;
  const createTotal = createSubtotal + createVat;

  const resetCreateForm = useCallback(() => {
    setCreateVendorId('');
    setCreateItems([]);
    setCreateProductSearch('');
    setCreateNotes('');
    setCreateExpectedDate('');
  }, []);

  const handleAddItem = useCallback(
    (productId: string) => {
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) return;
      setCreateItems((prev) => [
        ...prev,
        { productId, quantity: 1, unitPrice: product.costPrice },
      ]);
      setCreateProductSearch('');
    },
    [],
  );

  const handleCreateOrder = useCallback(() => {
    if (!createVendorId) {
      toast.error('Please select a vendor');
      return;
    }
    if (createItems.length === 0) {
      toast.error('Add at least one item');
      return;
    }
    const vendor = mockVendors.find((v) => v.id === createVendorId);
    if (!vendor) return;

    const nextNum = String(orders.length + 1).padStart(3, '0');
    const orderItems: PurchaseOrderItem[] = createItems.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        receivedQty: 0,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      };
    });

    const newOrder: PurchaseOrder = {
      id: `po-new-${Date.now()}`,
      orderNumber: `PO-2024-${nextNum}`,
      vendorId: createVendorId,
      vendorName: vendor.name,
      items: orderItems,
      subtotal: createSubtotal,
      vatAmount: createVat,
      total: createTotal,
      status: 'draft',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDate: createExpectedDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      notes: createNotes.trim() || undefined,
      createdBy: 'Admin',
    };

    setOrders((prev) => [newOrder, ...prev]);
    resetCreateForm();
    setActiveTab('orders');
    toast.success('Purchase order saved as draft');
  }, [createVendorId, createItems, orders.length, createSubtotal, createVat, createTotal, createNotes, createExpectedDate, resetCreateForm]);

  // ---------- Cancel order ----------

  const handleCancelOrder = useCallback(
    (order: PurchaseOrder) => {
      if (order.status !== 'draft' && order.status !== 'sent') {
        toast.error('Only draft or sent orders can be cancelled');
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'cancelled' as const } : o)),
      );
      setViewOrder(null);
      toast.success(`Order ${order.orderNumber} has been cancelled`);
    },
    [],
  );

  // ---------- Receive order ----------

  const openReceiveDialog = useCallback((order: PurchaseOrder) => {
    const initial: Record<string, number> = {};
    order.items.forEach((item) => {
      initial[item.productId] = Math.max(0, item.quantity - item.receivedQty);
    });
    setReceiveItems(initial);
    setReceiveOrder(order);
  }, []);

  const handleReceiveOrder = useCallback(() => {
    if (!receiveOrder) return;
    const hasAnyReceive = Object.values(receiveItems).some((qty) => qty > 0);
    if (!hasAnyReceive) {
      toast.error('Please enter at least one item quantity to receive');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== receiveOrder.id) return o;
        const updatedItems = o.items.map((item) => {
          const newReceived = receiveItems[item.productId] || 0;
          return { ...item, receivedQty: item.receivedQty + newReceived };
        });
        const allReceived = updatedItems.every((item) => item.receivedQty >= item.quantity);
        return {
          ...o,
          items: updatedItems,
          status: (allReceived ? 'received' : 'partial') as PurchaseOrderStatus,
          receivedDate: allReceived ? new Date().toISOString().slice(0, 10) : o.receivedDate,
        };
      }),
    );
    setReceiveOrder(null);
    toast.success('Items received successfully');
  }, [receiveOrder, receiveItems]);

  // ---------- Export CSV ----------

  const handleExportCSV = useCallback(() => {
    const headers = ['Order #', 'Vendor', 'Items', 'Status', 'Subtotal (NPR)', 'VAT (NPR)', 'Total (NPR)', 'Order Date', 'Expected Date', 'Created By'];
    const rows = filtered.map((o) => [
      o.orderNumber,
      o.vendorName,
      o.items.length,
      o.status,
      o.subtotal.toFixed(2),
      o.vatAmount.toFixed(2),
      o.total.toFixed(2),
      o.orderDate,
      o.expectedDate,
      o.createdBy,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchase-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  }, [filtered]);

  // ---------- Status timeline ----------

  const getStatusTimeline = (order: PurchaseOrder) => {
    const steps: { key: string; label: string; icon: React.ReactNode; done: boolean; active: boolean }[] = [
      { key: 'draft', label: 'Draft', icon: <FileText className="h-4 w-4" />, done: true, active: order.status === 'draft' },
      { key: 'sent', label: 'Sent to Vendor', icon: <Truck className="h-4 w-4" />, done: ['sent', 'partial', 'received'].includes(order.status), active: order.status === 'sent' },
      { key: 'partial', label: 'Partially Received', icon: <PackageCheck className="h-4 w-4" />, done: ['partial', 'received'].includes(order.status), active: order.status === 'partial' },
      { key: 'received', label: 'Fully Received', icon: <CheckCircle2 className="h-4 w-4" />, done: order.status === 'received', active: order.status === 'received' },
    ];
    if (order.status === 'cancelled') {
      return [{ key: 'cancelled', label: 'Cancelled', icon: <XCircle className="h-4 w-4" />, done: true, active: true }];
    }
    return steps;
  };

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="Manage purchase orders from suppliers and vendors">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description="All purchase orders"
          borderColor="border-l-emerald-500"
          iconClassName="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          description="Draft & sent"
          borderColor="border-l-amber-500"
          iconClassName="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          description="Sent & partial"
          borderColor="border-l-blue-500"
          iconClassName="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Value"
          value={`NPR ${npr(stats.totalValue)}`}
          icon={FileText}
          description="Across all orders"
          borderColor="border-l-purple-500"
          iconClassName="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">Orders List</TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-1" /> Create Order
          </TabsTrigger>
        </TabsList>

        {/* ====== ORDERS LIST TAB ====== */}
        <TabsContent value="orders" className="mt-4 space-y-4">
          {/* Search & Filter */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1" style={{ minWidth: '180px' }}>
                  <Label className="mb-1.5">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Order # or vendor..."
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5">Status</Label>
                  <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No purchase orders found.
                        </TableCell>
                      </TableRow>
                    )}
                    {paged.map((order) => (
                      <TableRow key={order.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.vendorName}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{order.items.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClasses(order.status)} variant="secondary">
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">NPR {npr(order.total)}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View details"
                              onClick={() => setViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(order.status === 'sent' || order.status === 'partial') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Receive items"
                                onClick={() => openReceiveDialog(order)}
                              >
                                <PackageCheck className="h-4 w-4" />
                              </Button>
                            )}
                            {(order.status === 'draft' || order.status === 'sent') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                title="Cancel order"
                                onClick={() => handleCancelOrder(order)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t pt-4 px-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
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
                    {page} / {totalPages}
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
        </TabsContent>

        {/* ====== CREATE ORDER TAB ====== */}
        <TabsContent value="create" className="mt-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Vendor & Date */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Vendor *</Label>
                    <Select value={createVendorId} onValueChange={setCreateVendorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVendors
                          .filter((v) => v.status === 'active')
                          .map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Expected Delivery Date</Label>
                    <Input
                      type="date"
                      value={createExpectedDate}
                      onChange={(e) => setCreateExpectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Product Search & Selection */}
                <div className="grid gap-2">
                  <Label>Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search by name or SKU..."
                      value={createProductSearch}
                      onChange={(e) => setCreateProductSearch(e.target.value)}
                    />
                  </div>
                  {createProductSearch && filteredCreateProducts.length > 0 && (
                    <ScrollArea className="max-h-48 rounded-md border">
                      <div className="p-2 grid gap-1">
                        {filteredCreateProducts.slice(0, 8).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-left"
                            onClick={() => handleAddItem(p.id)}
                          >
                            <div>
                              <span className="font-medium">{p.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{p.sku}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Cost: NPR {npr(p.costPrice)}</span>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {createProductSearch && filteredCreateProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">No products found.</p>
                  )}
                </div>

                {/* Selected Items */}
                {createItems.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Order Items</Label>
                    <div className="rounded-md border">
                      <ScrollArea className="max-h-64">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
                              <TableHead className="text-right">Unit Price</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="w-10"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {createItems.map((item) => {
                              const product = mockProducts.find((p) => p.id === item.productId)!;
                              return (
                                <TableRow key={item.productId}>
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => {
                                          if (item.quantity > 1) {
                                            setCreateItems((prev) =>
                                              prev.map((i) =>
                                                i.productId === item.productId ? { ...i, quantity: i.quantity - 1 } : i
                                              )
                                            );
                                          }
                                        }}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => {
                                          setCreateItems((prev) =>
                                            prev.map((i) =>
                                              i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
                                            )
                                          );
                                        }}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                                  <TableCell className="text-right font-medium">NPR {npr(item.quantity * item.unitPrice)}</TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setCreateItems((prev) => prev.filter((i) => i.productId !== item.productId));
                                      }}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Notes */}
                <div className="grid gap-2">
                  <Label>Notes (optional)</Label>
                  <Input
                    placeholder="Any additional notes..."
                    value={createNotes}
                    onChange={(e) => setCreateNotes(e.target.value)}
                  />
                </div>

                {/* Totals Summary */}
                {createItems.length > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>NPR {npr(createSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (13%)</span>
                      <span>NPR {nprFull(createVat)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>NPR {nprFull(createTotal)}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetCreateForm}>
                    Reset
                  </Button>
                  <Button onClick={handleCreateOrder} disabled={!createVendorId || createItems.length === 0}>
                    Save as Draft
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ====== VIEW ORDER DIALOG ====== */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>Full order details</DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
              {/* Status Timeline */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {getStatusTimeline(viewOrder).map((step, idx, arr) => (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                            step.done
                              ? step.active
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${
                            step.active ? 'text-foreground' : step.done ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className={`h-0.5 w-6 rounded ${
                            step.done && arr[idx + 1].done
                              ? 'bg-emerald-400 dark:bg-emerald-600'
                              : 'bg-muted-foreground/30'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Vendor</span>
                  <div className="font-medium">{viewOrder.vendorName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5">
                    <Badge className={getStatusBadgeClasses(viewOrder.status)} variant="secondary">
                      {getStatusLabel(viewOrder.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Date</span>
                  <div className="font-medium">{formatDate(viewOrder.orderDate)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Delivery</span>
                  <div className="font-medium">{formatDate(viewOrder.expectedDate)}</div>
                </div>
                {viewOrder.receivedDate && (
                  <div>
                    <span className="text-muted-foreground">Received Date</span>
                    <div className="font-medium">{formatDate(viewOrder.receivedDate)}</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Created By</span>
                  <div className="font-medium">{viewOrder.createdBy}</div>
                </div>
                {viewOrder.notes && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Notes</span>
                    <div className="font-medium">{viewOrder.notes}</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Items Table */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-center">Ordered</TableHead>
                        <TableHead className="text-center">Received</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                item.receivedQty >= item.quantity
                                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                  : item.receivedQty > 0
                                    ? 'text-amber-600 dark:text-amber-400 font-medium'
                                    : 'text-muted-foreground'
                              }
                            >
                              {item.receivedQty}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-medium">NPR {npr(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals */}
              <div className="ml-auto w-64 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>NPR {npr(viewOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (13%)</span>
                  <span>NPR {nprFull(viewOrder.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>NPR {nprFull(viewOrder.total)}</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {(viewOrder.status === 'sent' || viewOrder.status === 'partial') && (
                  <Button onClick={() => { setViewOrder(null); openReceiveDialog(viewOrder); }}>
                    <PackageCheck className="h-4 w-4" /> Receive Items
                  </Button>
                )}
                {(viewOrder.status === 'draft' || viewOrder.status === 'sent') && (
                  <Button variant="destructive" onClick={() => handleCancelOrder(viewOrder)}>
                    <XCircle className="h-4 w-4" /> Cancel Order
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== RECEIVE ORDER DIALOG ====== */}
      <Dialog open={!!receiveOrder} onOpenChange={(open) => !open && setReceiveOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              Receive Order
            </DialogTitle>
            <DialogDescription>
              {receiveOrder?.orderNumber} — {receiveOrder?.vendorName}
            </DialogDescription>
          </DialogHeader>
          {receiveOrder && (
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
              <p className="text-sm text-muted-foreground">
                Enter the quantity received for each item. Remaining quantities are pre-filled.
              </p>
              <div className="space-y-3">
                {receiveOrder.items.map((item) => {
                  const remaining = item.quantity - item.receivedQty;
                  return (
                    <div key={item.productId} className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{item.productName}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{item.sku}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Remaining: {remaining}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap w-16">Received:</Label>
                        <Input
                          type="number"
                          min={0}
                          max={remaining}
                          value={receiveItems[item.productId] ?? 0}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(remaining, parseInt(e.target.value) || 0));
                            setReceiveItems((prev) => ({ ...prev, [item.productId]: val }));
                          }}
                          className="w-28"
                        />
                        <span className="text-xs text-muted-foreground">
                          of {item.quantity} ordered ({item.receivedQty} already received)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReceiveOrder(null)}>
                  Cancel
                </Button>
                <Button onClick={handleReceiveOrder}>
                  <CheckCircle2 className="h-4 w-4" /> Confirm Receipt
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
