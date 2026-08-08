'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, DollarSign, AlertTriangle } from 'lucide-react';
import { mockInventory, mockStockMovements, mockProducts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);

const getStockStatus = (current: number, min: number) => {
  if (current <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
  if (current <= min) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' };
  return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' };
};

export default function InventoryPage() {
  const totalProducts = mockInventory.length;
  const totalStockValue = mockProducts.reduce(
    (sum, p) => sum + p.stock * p.costPrice,
    0
  );
  const lowStockItems = mockInventory.filter(
    (item) => item.currentStock <= item.minStock
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor and manage stock levels" />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={totalProducts} icon={Package} />
        <StatCard
          title="Total Stock Value"
          value={`NPR ${npr(totalStockValue)}`}
          icon={DollarSign}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          iconClassName="bg-amber-100"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Stock</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Current Stock</TableHead>
                    <TableHead className="text-center">Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventory.map((item) => {
                    const status = getStockStatus(item.currentStock, item.minStock);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              'font-medium',
                              item.currentStock <= 0 && 'text-red-600',
                              item.currentStock > 0 &&
                                item.currentStock <= item.minStock &&
                                'text-amber-600'
                            )}
                          >
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{item.minStock}</TableCell>
                        <TableCell>
                          <Badge className={status.color} variant="secondary">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(item.lastUpdated).toLocaleDateString('en-GB')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStockMovements.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(mov.date).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell className="font-medium">{mov.productName}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            mov.type === 'in'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          )}
                          variant="secondary"
                        >
                          {mov.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{mov.quantity}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{mov.reason}</TableCell>
                      <TableCell>{mov.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
