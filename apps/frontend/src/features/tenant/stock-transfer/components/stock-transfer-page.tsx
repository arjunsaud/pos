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
  ArrowLeftRight,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Truck,
  MapPin,
  X,
  Minus,
  Clock,
  PackageCheck,
} from 'lucide-react';
import { useStockTransfers, useOutlets, useProducts } from '@/hooks/use-api-data';
import { useAuthStore } from '@/features/auth/store';
import { npr, formatDate } from '@/lib/helpers';
import { toast } from 'sonner';
import type { StockTransfer, StockTransferItem, TransferStatus } from '@/lib/types';

// ---------- Helpers ----------

const ITEMS_PER_PAGE = 10;

function getTransferStatusBadgeClasses(status: TransferStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400';
    case 'in-transit':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getTransferStatusLabel(status: TransferStatus): string {
  switch (status) {
    case 'in-transit':
      return 'In Transit';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// ---------- Types for create form ----------

interface CreateFormItem {
  productId: string;
  quantity: number;
}

// ---------- Component ----------

export default function StockTransferPage() {
  const mockStockTransfers = useStockTransfers().items;
  const mockOutlets = useOutlets().items;
  const mockProducts = useProducts().items;
  const tenantId = useAuthStore((s) => s.user?.tenantId || '');

  const [transfers, setTransfers] = useState<StockTransfer[]>(mockStockTransfers);

  useEffect(() => {
    setTransfers(mockStockTransfers);
  }, [mockStockTransfers]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('transfers');

  // View dialog
  const [viewTransfer, setViewTransfer] = useState<StockTransfer | null>(null);

  // Complete dialog
  const [completeTransfer, setCompleteTransfer] = useState<StockTransfer | null>(null);

  // Create form state
  const [createFromOutletId, setCreateFromOutletId] = useState('');
  const [createToOutletId, setCreateToOutletId] = useState('');
  const [createItems, setCreateItems] = useState<CreateFormItem[]>([]);
  const [createProductSearch, setCreateProductSearch] = useState('');
  const [createReason, setCreateReason] = useState('');
  const [createNotes, setCreateNotes] = useState('');

  // ---------- Tenant outlets ----------

  const tenantOutlets = useMemo(
    () => mockOutlets.filter((o) => (!tenantId || o.tenantId === tenantId) && o.status === 'active'),
    [mockOutlets, tenantId],
  );

  const createToOutlets = useMemo(
    () => tenantOutlets.filter((o) => o.id !== createFromOutletId),
    [tenantOutlets, createFromOutletId],
  );

  // ---------- Computed stats ----------

  const stats = useMemo(() => {
    const totalTransfers = transfers.length;
    const pending = transfers.filter((t) => t.status === 'pending').length;
    const inTransit = transfers.filter((t) => t.status === 'in-transit').length;
    const completed = transfers.filter((t) => t.status === 'completed').length;
    return { totalTransfers, pending, inTransit, completed };
  }, [transfers]);

  // ---------- Filtering ----------

  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      const matchesSearch =
        t.transferNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.fromOutletName.toLowerCase().includes(search.toLowerCase()) ||
        t.toOutletName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transfers, search, statusFilter]);

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

  const totalItems = useMemo(
    () => createItems.reduce((sum, item) => sum + item.quantity, 0),
    [createItems],
  );

  const resetCreateForm = useCallback(() => {
    setCreateFromOutletId('');
    setCreateToOutletId('');
    setCreateItems([]);
    setCreateProductSearch('');
    setCreateReason('');
    setCreateNotes('');
  }, []);

  const handleAddItem = useCallback(
    (productId: string) => {
      setCreateItems((prev) => [...prev, { productId, quantity: 1 }]);
      setCreateProductSearch('');
    },
    [],
  );

  const handleCreateTransfer = useCallback(() => {
    if (!createFromOutletId) {
      toast.error('Please select a source outlet');
      return;
    }
    if (!createToOutletId) {
      toast.error('Please select a destination outlet');
      return;
    }
    if (createItems.length === 0) {
      toast.error('Add at least one item');
      return;
    }
    if (!createReason.trim()) {
      toast.error('Please provide a reason for the transfer');
      return;
    }

    const fromOutlet = mockOutlets.find((o) => o.id === createFromOutletId);
    const toOutlet = mockOutlets.find((o) => o.id === createToOutletId);
    if (!fromOutlet || !toOutlet) return;

    const nextNum = String(transfers.length + 1).padStart(3, '0');
    const transferItems: StockTransferItem[] = createItems.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
      };
    });

    const newTransfer: StockTransfer = {
      id: `st-new-${Date.now()}`,
      transferNumber: `TRF-2024-${nextNum}`,
      fromOutletId: createFromOutletId,
      fromOutletName: fromOutlet.name,
      toOutletId: createToOutletId,
      toOutletName: toOutlet.name,
      items: transferItems,
      status: 'pending',
      reason: createReason.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: 'Admin',
      notes: createNotes.trim() || undefined,
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    resetCreateForm();
    setActiveTab('transfers');
    toast.success(`Transfer ${newTransfer.transferNumber} created successfully`);
  }, [createFromOutletId, createToOutletId, createItems, createReason, createNotes, transfers.length, resetCreateForm]);

  // ---------- Complete transfer ----------

  const handleCompleteTransfer = useCallback(() => {
    if (!completeTransfer) return;
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === completeTransfer.id
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString().slice(0, 10) }
          : t,
      ),
    );
    toast.success(`Transfer ${completeTransfer.transferNumber} marked as completed`);
    setCompleteTransfer(null);
  }, [completeTransfer]);

  // ---------- Cancel transfer ----------

  const handleCancelTransfer = useCallback(
    (transfer: StockTransfer) => {
      if (transfer.status !== 'pending') {
        toast.error('Only pending transfers can be cancelled');
        return;
      }
      setTransfers((prev) =>
        prev.map((t) => (t.id === transfer.id ? { ...t, status: 'cancelled' as const } : t)),
      );
      setViewTransfer(null);
      toast.success(`Transfer ${transfer.transferNumber} has been cancelled`);
    },
    [],
  );

  // ---------- Export CSV ----------

  const handleExportCSV = useCallback(() => {
    const headers = [
      'Transfer #',
      'From Outlet',
      'To Outlet',
      'Items Count',
      'Total Units',
      'Status',
      'Reason',
      'Created Date',
      'Completed Date',
      'Created By',
    ];
    const rows = filtered.map((t) => [
      t.transferNumber,
      t.fromOutletName,
      t.toOutletName,
      t.items.length,
      t.items.reduce((sum, i) => sum + i.quantity, 0),
      t.status,
      t.reason,
      t.createdAt,
      t.completedAt || '',
      t.createdBy,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock-transfers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  }, [filtered]);

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Transfers" description="Manage stock transfers between outlets">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transfers"
          value={stats.totalTransfers}
          icon={ArrowLeftRight}
          description="All transfers"
          borderColor="border-l-emerald-500"
          iconClassName="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Awaiting dispatch"
          borderColor="border-l-gray-400"
          iconClassName="bg-gray-100 dark:bg-gray-800/50"
          iconColor="text-gray-600 dark:text-gray-400"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          description="On the way"
          borderColor="border-l-blue-500"
          iconClassName="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          description="Delivered"
          borderColor="border-l-purple-500"
          iconClassName="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transfers">Transfers List</TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-1" /> Create Transfer
          </TabsTrigger>
        </TabsList>

        {/* ====== TRANSFERS LIST TAB ====== */}
        <TabsContent value="transfers" className="mt-4 space-y-4">
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
                      placeholder="Transfer #, outlet name..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
                      <TableHead>Transfer #</TableHead>
                      <TableHead>From Outlet</TableHead>
                      <TableHead>To Outlet</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          No stock transfers found.
                        </TableCell>
                      </TableRow>
                    )}
                    {paged.map((transfer) => (
                      <TableRow key={transfer.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[140px]" title={transfer.fromOutletName}>
                              {transfer.fromOutletName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[140px]" title={transfer.toOutletName}>
                              {transfer.toOutletName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{transfer.items.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getTransferStatusBadgeClasses(transfer.status)}
                            variant="secondary"
                          >
                            {getTransferStatusLabel(transfer.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                        <TableCell>{transfer.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View details"
                              onClick={() => setViewTransfer(transfer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transfer.status === 'in-transit' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:text-emerald-600"
                                title="Complete transfer"
                                onClick={() => setCompleteTransfer(transfer)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {transfer.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                title="Cancel transfer"
                                onClick={() => handleCancelTransfer(transfer)}
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

        {/* ====== CREATE TRANSFER TAB ====== */}
        <TabsContent value="create" className="mt-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* From / To Outlets */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>From Outlet *</Label>
                    <Select value={createFromOutletId} onValueChange={(val) => { setCreateFromOutletId(val); setCreateToOutletId(''); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantOutlets.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>To Outlet *</Label>
                    <Select value={createToOutletId} onValueChange={setCreateToOutletId} disabled={!createFromOutletId}>
                      <SelectTrigger>
                        <SelectValue placeholder={createFromOutletId ? 'Select destination' : 'Select source first'} />
                      </SelectTrigger>
                      <SelectContent>
                        {createToOutlets.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Reason */}
                <div className="grid gap-2">
                  <Label>Reason *</Label>
                  <Input
                    placeholder="e.g., Restocking branch, seasonal demand..."
                    value={createReason}
                    onChange={(e) => setCreateReason(e.target.value)}
                  />
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
                            <span className="text-sm text-muted-foreground">Stock: {p.stock} {p.unit}</span>
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
                    <Label>Transfer Items ({createItems.length} products, {totalItems} units)</Label>
                    <div className="rounded-md border">
                      <ScrollArea className="max-h-64">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
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
                                  <TableCell className="text-muted-foreground">{product.stock} {product.unit}</TableCell>
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
                                                i.productId === item.productId
                                                  ? { ...i, quantity: i.quantity - 1 }
                                                  : i,
                                              ),
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
                                              i.productId === item.productId
                                                ? { ...i, quantity: i.quantity + 1 }
                                                : i,
                                            ),
                                          );
                                        }}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
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
                    placeholder="Any additional notes for this transfer..."
                    value={createNotes}
                    onChange={(e) => setCreateNotes(e.target.value)}
                  />
                </div>

                {/* Summary */}
                {createItems.length > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Products</span>
                      <span className="font-medium">{createItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Units</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    {createFromOutletId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-medium">{tenantOutlets.find((o) => o.id === createFromOutletId)?.name}</span>
                      </div>
                    )}
                    {createToOutletId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To</span>
                        <span className="font-medium">{tenantOutlets.find((o) => o.id === createToOutletId)?.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetCreateForm}>
                    Reset
                  </Button>
                  <Button
                    onClick={handleCreateTransfer}
                    disabled={!createFromOutletId || !createToOutletId || createItems.length === 0 || !createReason.trim()}
                  >
                    <ArrowLeftRight className="h-4 w-4" /> Create Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ====== VIEW TRANSFER DIALOG ====== */}
      <Dialog open={!!viewTransfer} onOpenChange={(open) => !open && setViewTransfer(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              {viewTransfer?.transferNumber}
            </DialogTitle>
            <DialogDescription>Full transfer details</DialogDescription>
          </DialogHeader>
          {viewTransfer && (
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
              {/* Status */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    className={getTransferStatusBadgeClasses(viewTransfer.status)}
                    variant="secondary"
                  >
                    {getTransferStatusLabel(viewTransfer.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Reason: {viewTransfer.reason}
                  </span>
                </div>
              </div>

              {/* Outlet & Date Info */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> From Outlet
                  </span>
                  <div className="font-medium mt-0.5">{viewTransfer.fromOutletName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> To Outlet
                  </span>
                  <div className="font-medium mt-0.5">{viewTransfer.toOutletName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Created Date</span>
                  <div className="font-medium">{formatDate(viewTransfer.createdAt)}</div>
                </div>
                {viewTransfer.completedAt && (
                  <div>
                    <span className="text-muted-foreground">Completed Date</span>
                    <div className="font-medium">{formatDate(viewTransfer.completedAt)}</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Created By</span>
                  <div className="font-medium">{viewTransfer.createdBy}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Units</span>
                  <div className="font-medium">
                    {viewTransfer.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </div>
                </div>
                {viewTransfer.notes && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Notes</span>
                    <div className="font-medium">{viewTransfer.notes}</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Items Table */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Transfer Items</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewTransfer.items.map((item) => {
                        const product = mockProducts.find((p) => p.id === item.productId);
                        const unitPrice = product?.costPrice ?? 0;
                        return (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                            <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                            <TableCell className="text-right">NPR {npr(unitPrice)}</TableCell>
                            <TableCell className="text-right font-medium">NPR {npr(unitPrice * item.quantity)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total Value */}
              <div className="ml-auto w-64 space-y-1.5 text-sm">
                <div className="flex justify-between text-base font-bold">
                  <span>Estimated Value</span>
                  <span>
                    NPR {npr(
                      viewTransfer.items.reduce((sum, item) => {
                        const product = mockProducts.find((p) => p.id === item.productId);
                        return sum + (product?.costPrice ?? 0) * item.quantity;
                      }, 0),
                    )}
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {viewTransfer.status === 'in-transit' && (
                  <Button onClick={() => { setViewTransfer(null); setCompleteTransfer(viewTransfer); }}>
                    <PackageCheck className="h-4 w-4" /> Complete Transfer
                  </Button>
                )}
                {viewTransfer.status === 'pending' && (
                  <Button variant="destructive" onClick={() => handleCancelTransfer(viewTransfer)}>
                    <XCircle className="h-4 w-4" /> Cancel Transfer
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== COMPLETE TRANSFER DIALOG ====== */}
      <Dialog open={!!completeTransfer} onOpenChange={(open) => !open && setCompleteTransfer(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Complete Transfer
            </DialogTitle>
            <DialogDescription>
              Confirm that this transfer has been received at the destination outlet.
            </DialogDescription>
          </DialogHeader>
          {completeTransfer && (
            <div className="space-y-4">
              {/* Transfer Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer #</span>
                  <span className="font-medium">{completeTransfer.transferNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> From
                  </span>
                  <span className="font-medium">{completeTransfer.fromOutletName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> To
                  </span>
                  <span className="font-medium">{completeTransfer.toOutletName}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Items</span>
                  <span>{completeTransfer.items.length} products, {completeTransfer.items.reduce((sum, i) => sum + i.quantity, 0)} units</span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completeTransfer.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCompleteTransfer(null)}>
                  Cancel
                </Button>
                <Button onClick={handleCompleteTransfer}>
                  <CheckCircle className="h-4 w-4" /> Confirm Completion
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
