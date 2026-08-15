import { useEffect, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { apiRequest, listResource, num, str } from '../lib/api';
import { printSale } from '../lib/print';
import type { DesktopUser } from '../lib/types';

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
    <div className="card">
      <h3>{title}</h3>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.label}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={str(row, 'id', '_id') || String(index)}>
              {columns.map((col) => {
                const value = col.money ? formatNpr(num(row, ...col.key)) : str(row, ...col.key) || '—';
                return <td key={col.label}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BillingScreen({ user }: { user: DesktopUser }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void rowsFrom('/v1/user/sale').then(setRows);
  }, []);
  return (
    <div className="card">
      <h3>Billing</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const invoice = str(row, 'invoiceNumber');
            return (
              <tr key={str(row, 'id', '_id')}>
                <td>{invoice}</td>
                <td>{str(row, 'customerName') || 'Walk-in'}</td>
                <td>{formatNpr(num(row, 'total'))}</td>
                <td>{str(row, 'status')}</td>
                <td>
                  <button
                    className="ghost"
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
                  </button>
                  <button
                    className="ghost"
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
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
    <div className="card" style={{ maxWidth: 480 }}>
      <h3>Settings</h3>
      <p className="sub">Signed in as {user.email}</p>
      <div className="row">
        <div>
          <strong>Two-factor authentication</strong>
          <div className="sub" style={{ margin: 0 }}>
            {enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
        <button className="ghost" onClick={() => void challenge(!enabled)}>
          {enabled ? 'Disable' : 'Enable'}
        </button>
      </div>
      {action ? (
        <div className="field" style={{ marginTop: 12 }}>
          <label>Verification code</label>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className="primary" style={{ marginTop: 8 }} onClick={() => void confirm()}>
            Confirm
          </button>
        </div>
      ) : null}
      <p className="error">{message}</p>
    </div>
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}
