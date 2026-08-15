import { useEffect, useRef, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { apiUpload, listResource, num, str } from '../lib/api';

export function ProductsScreen() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    void listResource('/v1/user/product').then(setRows).catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<{ created?: number; skipped?: number }>(
        '/v1/user/product/import',
        formData,
      );
      setMessage(`${result.created ?? 0} imported, ${result.skipped ?? 0} skipped`);
      load();
    } catch {
      setMessage('Could not import products');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h3>Products</h3>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(event) => void importFile(event.target.files?.[0])}
          />
          <button className="ghost" type="button" onClick={() => inputRef.current?.click()}>
            Import Excel/CSV
          </button>
        </div>
      </div>
      {message ? <p className="muted">{message}</p> : null}
      <table className="table">
        <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={str(row, 'id', '_id')}>
              <td>{str(row, 'name')}</td>
              <td>{str(row, 'sku')}</td>
              <td>{formatNpr(num(row, 'price', 'sellingPrice'))}</td>
              <td>{num(row, 'stock', 'quantity')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InventoryScreen() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void listResource('/v1/user/inventory').then(setRows).catch(() => {
      void listResource('/v1/user/product').then(setRows);
    });
  }, []);
  return (
    <div className="card">
      <h3>Inventory</h3>
      <table className="table">
        <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Min</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={str(row, 'id', '_id', 'productId')}>
              <td>{str(row, 'productName', 'name')}</td>
              <td>{str(row, 'sku')}</td>
              <td>{num(row, 'currentStock', 'stock', 'quantity')}</td>
              <td>{num(row, 'minStock')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SalesScreen() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void listResource('/v1/user/sale').then(setRows).catch(() => undefined);
  }, []);
  return (
    <div className="card">
      <h3>Sales</h3>
      <table className="table">
        <thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Method</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={str(row, 'id', '_id')}>
              <td>{str(row, 'invoiceNumber')}</td>
              <td>{str(row, 'customerName') || 'Walk-in'}</td>
              <td>{formatNpr(num(row, 'total'))}</td>
              <td>{str(row, 'paymentMethod')}</td>
              <td>{str(row, 'status')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
