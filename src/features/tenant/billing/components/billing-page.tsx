'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Plus, Eye, Printer } from 'lucide-react';
import { mockSales } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Sale } from '@/lib/types';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

const statusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700';
    case 'refunded': return 'bg-red-100 text-red-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    default: return '';
  }
};

export default function BillingPage() {
  const [sales] = useState<Sale[]>(mockSales);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const saleDate = s.date.slice(0, 10);
      const matchesFrom = !dateFrom || saleDate >= dateFrom;
      const matchesTo = !dateTo || saleDate <= dateTo;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [sales, search, dateFrom, dateTo, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Invoices">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1" style={{ minWidth: '180px' }}>
              <Label className="mb-1.5">Search</Label>
              <Input
                placeholder="Invoice # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
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
                <TableHead>PAN</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">VAT (13%)</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                  <TableCell>{fmtDate(sale.date)}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.customerPAN || '—'}</TableCell>
                  <TableCell className="text-center">{sale.items.length}</TableCell>
                  <TableCell className="text-right">NPR {npr(sale.subtotal)}</TableCell>
                  <TableCell className="text-right">NPR {npr(sale.vatAmount)}</TableCell>
                  <TableCell className="text-right font-semibold">NPR {npr(sale.total)}</TableCell>
                  <TableCell><Badge variant="outline">{sale.paymentMethod}</Badge></TableCell>
                  <TableCell>
                    <Badge className={statusColor(sale.status)} variant="secondary">
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedSale(sale)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice View Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedSale?.invoiceNumber}</DialogTitle>
            <DialogDescription>Invoice details</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              {/* Store Header */}
              <div className="text-center">
                <div className="text-xl font-bold">ABC Store</div>
                <div className="text-sm text-muted-foreground">Kathmandu, Nepal</div>
                <div className="text-sm text-muted-foreground">PAN: 309876543 | Phone: +977-9801234567</div>
              </div>

              {/* Invoice Info */}
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">Customer</div>
                  <div>{selectedSale.customerName}</div>
                  {selectedSale.customerPAN && <div>PAN: {selectedSale.customerPAN}</div>}
                </div>
                <div className="text-right">
                  <div className="font-medium">Invoice #</div>
                  <div>{selectedSale.invoiceNumber}</div>
                  <div className="font-medium mt-1">Date</div>
                  <div>{new Date(selectedSale.date).toLocaleString('en-GB')}</div>
                </div>
              </div>

              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">NPR {npr(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">NPR {npr(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="ml-auto w-64 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>NPR {npr(selectedSale.subtotal)}</span></div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>- NPR {npr(selectedSale.discount)}</span></div>
                )}
                <div className="flex justify-between"><span>VAT (13%)</span><span>NPR {npr(selectedSale.vatAmount)}</span></div>
                <div className="flex justify-between border-t pt-1 text-base font-bold"><span>Grand Total</span><span>NPR {npr(selectedSale.total)}</span></div>
                <div className="mt-1 flex justify-between text-muted-foreground"><span>Payment</span><span>{selectedSale.paymentMethod}</span></div>
              </div>

              <DialogFooter>
                <Button onClick={() => toast.success('Print sent to printer')}>
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog (simplified) */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Fill in the invoice details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input placeholder="Walk-in Customer" />
            </div>
            <div className="grid gap-2">
              <Label>Customer PAN (optional)</Label>
              <Input placeholder="e.g., 301234567" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Invoice created successfully'); setCreateOpen(false); }}>
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
