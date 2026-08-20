import { useEffect, useRef, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { Upload } from 'lucide-react';
import { apiUpload, listResource, num, str } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="space-y-4">
      <PageHeader title="Products" description={`${rows.length} products`}>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          onChange={(event) => void importFile(event.target.files?.[0])}
        />
        <Button variant="outline" className="gap-2" onClick={() => inputRef.current?.click()}>
          <Upload className="size-4" />
          Import Excel/CSV
        </Button>
      </PageHeader>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={str(row, 'id', '_id')}>
                  <TableCell className="font-medium">{str(row, 'name')}</TableCell>
                  <TableCell>{str(row, 'sku')}</TableCell>
                  <TableCell>{formatNpr(num(row, 'price', 'sellingPrice'))}</TableCell>
                  <TableCell>{num(row, 'stock', 'quantity')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
    <div className="space-y-4">
      <PageHeader title="Inventory" description="Stock levels" />
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={str(row, 'id', '_id', 'productId')}>
                  <TableCell className="font-medium">{str(row, 'productName', 'name')}</TableCell>
                  <TableCell>{str(row, 'sku')}</TableCell>
                  <TableCell>{num(row, 'currentStock', 'stock', 'quantity')}</TableCell>
                  <TableCell>{num(row, 'minStock')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function SalesScreen() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    void listResource('/v1/user/sale').then(setRows).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Sales & Reports" description={`${rows.length} sales`} />
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={str(row, 'id', '_id')}>
                  <TableCell className="font-medium">{str(row, 'invoiceNumber')}</TableCell>
                  <TableCell>{str(row, 'customerName') || 'Walk-in'}</TableCell>
                  <TableCell>{formatNpr(num(row, 'total'))}</TableCell>
                  <TableCell className="capitalize">{str(row, 'paymentMethod')}</TableCell>
                  <TableCell className="capitalize">{str(row, 'status')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
