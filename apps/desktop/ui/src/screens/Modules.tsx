import { useEffect, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { apiRequest, asRecord, listResource, num, str } from '@/lib/api';
import { printSale } from '@/lib/print';
import type { DesktopUser } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function rowsFrom(path: string) {
  return listResource(path).catch(() => [] as Record<string, unknown>[]);
}

export function ResourceTable({
  title,
  path,
  columns,
}: {
  title: string;
  path: string;
  columns: Array<{ key: string[]; label: string; money?: boolean }>;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void rowsFrom(path).then(setRows);
  }, [path]);

  return (
    <div className="space-y-4">
      <PageHeader title={title} description={`${rows.length} records`} />
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.label}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={str(row, 'id', '_id') || String(index)}>
                    {columns.map((col) => {
                      const value = col.money ? formatNpr(num(row, ...col.key)) : str(row, ...col.key) || '—';
                      return <TableCell key={col.label}>{value}</TableCell>;
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function BillingScreen({ user }: { user: DesktopUser }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void rowsFrom('/v1/user/sale').then(setRows);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Billing" description="Invoices and receipts" />
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const invoice = str(row, 'invoiceNumber');
                return (
                  <TableRow key={str(row, 'id', '_id')}>
                    <TableCell className="font-medium">{invoice}</TableCell>
                    <TableCell>{str(row, 'customerName') || 'Walk-in'}</TableCell>
                    <TableCell>{formatNpr(num(row, 'total'))}</TableCell>
                    <TableCell className="capitalize">{str(row, 'status')}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          void printSale(
                            'invoice',
                            {
                              invoiceNumber: invoice,
                              items: [],
                              subtotal: num(row, 'subtotal'),
                              discount: num(row, 'discount'),
                              vat: num(row, 'vatAmount', 'vat'),
                              total: num(row, 'total'),
                              paymentMethod: str(row, 'paymentMethod'),
                              customerName: str(row, 'customerName'),
                              cashier: user.name,
                            },
                            user.tenantName || 'Store',
                          )
                        }
                      >
                        Invoice
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          void printSale(
                            'receipt',
                            {
                              invoiceNumber: invoice,
                              items: [],
                              subtotal: num(row, 'subtotal'),
                              discount: num(row, 'discount'),
                              vat: num(row, 'vatAmount', 'vat'),
                              total: num(row, 'total'),
                              paymentMethod: str(row, 'paymentMethod'),
                              customerName: str(row, 'customerName'),
                              cashier: user.name,
                            },
                            user.tenantName || 'Store',
                          )
                        }
                      >
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsScreen({ user }: { user: DesktopUser }) {
  const [enabled, setEnabled] = useState(false);
  const [otp, setOtp] = useState('');
  const [action, setAction] = useState<'enable' | 'disable' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void apiRequest<Record<string, unknown>>('/v1/user/auth/profile')
      .then((profile) => setEnabled(Boolean(profile.twoFactorEnabled)))
      .catch(() => undefined);
  }, []);

  const challenge = async (next: boolean) => {
    const nextAction = next ? 'enable' : 'disable';
    try {
      await apiRequest('/v1/user/auth/2fa/challenge', {
        method: 'POST',
        body: { action: nextAction },
      });
      setAction(nextAction);
      setMessage(`Code sent to ${user.email}`);
    } catch {
      setMessage('Could not start 2FA');
    }
  };

  const confirm = async () => {
    if (!action) return;
    try {
      const result = asRecord(
        await apiRequest('/v1/user/auth/2fa/confirm', {
          method: 'POST',
          body: { action, otp },
        }),
      );
      setEnabled(Boolean(result.twoFactorEnabled));
      setAction(null);
      setOtp('');
      setMessage(result.twoFactorEnabled ? '2FA enabled' : '2FA disabled');
    } catch {
      setMessage('Invalid code');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" description={`Signed in as ${user.email}`} />
      <Card className="max-w-lg gap-4 py-5">
        <CardContent className="space-y-4 px-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">{enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <Button variant="outline" onClick={() => void challenge(!enabled)}>
              {enabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
          {action ? (
            <div className="space-y-2">
              <Label>Verification code</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button onClick={() => void confirm()}>Confirm</Button>
            </div>
          ) : null}
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
