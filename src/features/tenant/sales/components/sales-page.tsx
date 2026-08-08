'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockSales } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';
import { cn } from '@/lib/utils';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB');
const ITEMS_PER_PAGE = 5;

const statusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700';
    case 'refunded': return 'bg-red-100 text-red-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    default: return '';
  }
};

export default function SalesPage() {
  const [sales] = useState<Sale[]>(mockSales);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || s.paymentMethod === paymentFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const saleDate = s.date.slice(0, 10);
      const matchesFrom = !dateFrom || saleDate >= dateFrom;
      const matchesTo = !dateTo || saleDate <= dateTo;
      return matchesSearch && matchesPayment && matchesStatus && matchesFrom && matchesTo;
    });
  }, [sales, search, dateFrom, dateTo, paymentFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalSales = filtered.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Sales History">
        <Button variant="outline" onClick={() => toast.success('Sales data exported')}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <Input
              placeholder="Invoice # or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div>
            <Label className="mb-1.5">From</Label>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label className="mb-1.5">To</Label>
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label className="mb-1.5">Payment</Label>
            <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="eSewa">eSewa</SelectItem>
                <SelectItem value="Khalti">Khalti</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(sale.date)}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell className="text-center">{sale.items.length}</TableCell>
                  <TableCell><Badge variant="outline">{sale.paymentMethod}</Badge></TableCell>
                  <TableCell>
                    <Badge className={statusColor(sale.status)} variant="secondary">
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">NPR {npr(sale.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSale(sale)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="font-medium">Total Sales</TableCell>
                <TableCell className="text-right font-bold">NPR {npr(totalSales)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>{selectedSale?.invoiceNumber}</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>{' '}
                  <span className="font-medium">{selectedSale.customerName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{' '}
                  <span className="font-medium">{new Date(selectedSale.date).toLocaleString('en-GB')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment:</span>{' '}
                  <Badge variant="outline">{selectedSale.paymentMethod}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge className={statusColor(selectedSale.status)} variant="secondary">
                    {selectedSale.status}
                  </Badge>
                </div>
                {selectedSale.customerPAN && (
                  <div>
                    <span className="text-muted-foreground">PAN:</span>{' '}
                    <span className="font-medium">{selectedSale.customerPAN}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Staff:</span>{' '}
                  <span className="font-medium">{selectedSale.staffName}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="font-medium">Items</div>
                {selectedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.productName} x{item.quantity}</span>
                    <span className="font-medium">NPR {npr(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-t pt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>NPR {npr(selectedSale.subtotal)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span>- NPR {npr(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (13%)</span>
                  <span>NPR {npr(selectedSale.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>NPR {npr(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
