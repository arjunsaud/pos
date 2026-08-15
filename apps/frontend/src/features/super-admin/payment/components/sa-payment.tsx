'use client';

import { useState, useEffect } from 'react';
import type { AdminPaymentMethod, PaymentReceipt } from '@/lib/types';
import { usePaymentMethods, usePaymentReceipts } from '@/hooks/use-api-data';
import { nprFull, formatDate } from '@/lib/helpers';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/shared/page-header';
import { toast } from 'sonner';

import {
  Wallet,
  Zap,
  Landmark,
  QrCode,
  CreditCard,
  Clock,
  CheckCircle2,
  Banknote,
  Eye,
  Check,
  X,
  FileText,
} from 'lucide-react';

// ---------- Icon helper ----------
function getMethodIcon(type: AdminPaymentMethod['type']) {
  switch (type) {
    case 'esewa':
      return <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
    case 'khalti':
      return <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
    case 'bank':
      return <Landmark className="h-6 w-6 text-sky-600 dark:text-sky-400" />;
    case 'qr':
      return <QrCode className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
  }
}

// ---------- Status badge ----------
function getReceiptStatusClasses(status: PaymentReceipt['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    esewa: 'eSewa',
    khalti: 'Khalti',
    bank: 'Bank Transfer',
    qr: 'QR Code',
  };
  return labels[method] || method;
}

// ---------- QR Code Placeholder ----------
function QRPlaceholder() {
  return (
    <div className="mx-auto mt-4 flex h-36 w-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30">
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => (
          <div
            key={i}
            className={
              i % 3 === 0 || i % 7 === 0
                ? 'h-1 w-1 rounded-[1px] bg-foreground/70'
                : 'h-1 w-1 rounded-[1px] bg-foreground/15'
            }
          />
        ))}
      </div>
      <QrCode className="mt-2 h-4 w-4 text-muted-foreground" />
      <span className="mt-0.5 text-[10px] text-muted-foreground">Scan to pay</span>
    </div>
  );
}

// ---------- Main Component ----------
export default function SAPayment() {
  const mockAdminPaymentMethods = usePaymentMethods().items;
  const mockPaymentReceipts = usePaymentReceipts().items;

  const [paymentMethods, setPaymentMethods] = useState<AdminPaymentMethod[]>(
    mockAdminPaymentMethods,
  );
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockPaymentReceipts);
  useEffect(() => {
    setReceipts(mockPaymentReceipts);
  }, [mockPaymentReceipts]);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionNotes, setActionNotes] = useState('');

  // Summary stats
  const activeMethods = paymentMethods.filter((m) => m.enabled).length;
  const pendingReceipts = receipts.filter((r) => r.status === 'pending').length;
  const approvedReceipts = receipts.filter((r) => r.status === 'approved').length;
  const totalCollected = receipts
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  // Handlers
  const handleToggleMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m,
      ),
    );
    const method = paymentMethods.find((m) => m.id === id);
    toast.success(
      `${method?.name} payment method ${method?.enabled ? 'disabled' : 'enabled'}`,
    );
  };

  const handleViewReceipt = (receipt: PaymentReceipt) => {
    setSelectedReceipt(receipt);
    setViewDialogOpen(true);
  };

  const handleOpenAction = (receipt: PaymentReceipt, type: 'approve' | 'reject') => {
    setSelectedReceipt(receipt);
    setActionType(type);
    setActionNotes('');
    setActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReceipt) return;
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === selectedReceipt.id
          ? {
              ...r,
              status: actionType === 'approve' ? 'approved' : 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Super Admin',
              notes: actionNotes || undefined,
            }
          : r,
      ),
    );
    toast.success(
      `Receipt ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`,
    );
    setActionDialogOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment"
        description="Manage payment methods and review tenant payment receipts"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Methods</p>
              <p className="text-2xl font-bold">{activeMethods}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Receipts</p>
              <p className="text-2xl font-bold">{pendingReceipts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Receipts</p>
              <p className="text-2xl font-bold">{approvedReceipts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
              <Banknote className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">NPR {nprFull(totalCollected)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payment-methods">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="payment-receipts">Payment Receipts</TabsTrigger>
        </TabsList>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{method.name}</CardTitle>
                        <CardDescription className="mt-0.5">
                          {method.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={() => handleToggleMethod(method.id)}
                      aria-label={`Toggle ${method.name}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-lg border bg-muted/40 px-4 py-3 font-mono text-sm text-muted-foreground">
                    {method.accountDetails}
                  </div>
                  {method.type === 'qr' && <QRPlaceholder />}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Receipts Tab */}
        <TabsContent value="payment-receipts" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Tenant</th>
                      <th className="px-4 py-3 font-medium">Package</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Payment Method</th>
                      <th className="px-4 py-3 font-medium">Receipt File</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map((receipt) => (
                      <tr
                        key={receipt.id}
                        className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{receipt.tenantName}</td>
                        <td className="px-4 py-3">{receipt.packageName}</td>
                        <td className="px-4 py-3">
                          NPR {nprFull(receipt.amount)}
                        </td>
                        <td className="px-4 py-3">
                          {getPaymentMethodLabel(receipt.paymentMethod)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            {receipt.receiptFile}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={getReceiptStatusClasses(receipt.status)}
                          >
                            {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(receipt.uploadedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewReceipt(receipt)}
                              aria-label="View receipt"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {receipt.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenAction(receipt, 'approve')}
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                                  aria-label="Approve receipt"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenAction(receipt, 'reject')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  aria-label="Reject receipt"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Receipt Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              Payment receipt information from the tenant
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tenant</Label>
                  <p className="font-medium">{selectedReceipt.tenantName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium">NPR {nprFull(selectedReceipt.amount)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Package</Label>
                  <p className="font-medium">{selectedReceipt.packageName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Payment Method</Label>
                  <p className="font-medium">
                    {getPaymentMethodLabel(selectedReceipt.paymentMethod)}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant="secondary"
                    className={getReceiptStatusClasses(selectedReceipt.status)}
                  >
                    {selectedReceipt.status.charAt(0).toUpperCase() + selectedReceipt.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Uploaded Date</Label>
                  <p className="font-medium">{formatDate(selectedReceipt.uploadedAt)}</p>
                </div>
              </div>
              {selectedReceipt.receiptFile && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Receipt File</Label>
                  <p className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {selectedReceipt.receiptFile}
                  </p>
                </div>
              )}
              {selectedReceipt.notes && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                    {selectedReceipt.notes}
                  </p>
                </div>
              )}
              {selectedReceipt.reviewedAt && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Reviewed</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedReceipt.reviewedAt)} by {selectedReceipt.reviewedBy}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Receipt
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Confirm approval for ${selectedReceipt?.tenantName}'s payment of NPR ${selectedReceipt ? nprFull(selectedReceipt.amount) : '0'}.`
                : `Provide a reason for rejecting ${selectedReceipt?.tenantName}'s payment receipt.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action-notes">
                {actionType === 'approve' ? 'Notes (optional)' : 'Rejection Reason'}
              </Label>
              <Textarea
                id="action-notes"
                placeholder={
                  actionType === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Explain why this receipt is being rejected...'
                }
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                onClick={handleConfirmAction}
                className={
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : ''
                }
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}