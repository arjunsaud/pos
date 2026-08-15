import { useEffect, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { listResource, num, str } from '../lib/api';

export function ProductsScreen() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void listResource('/v1/user/product').then(setRows).catch(() => undefined);
  }, []);
  return (
    <div className="card">
      <h3>Products</h3>
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
