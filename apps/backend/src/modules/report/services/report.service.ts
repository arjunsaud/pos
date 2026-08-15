import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/product/repository/repositories/product.repository';
import { PurchaseRepository } from 'src/modules/purchase/repository/repositories/purchase.repository';
import { SaleRepository } from 'src/modules/sale/repository/repositories/sale.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly saleRepo: SaleRepository,
    private readonly productRepo: ProductRepository,
    private readonly purchaseRepo: PurchaseRepository,
  ) {}

  private tenantFilter(tenantId?: string) {
    return tenantId ? { tenantId } : {};
  }

  async getSales(tenantId?: string) {
    const sales = await this.saleRepo.findAll({
      ...this.tenantFilter(tenantId),
      status: 'completed',
    });
    const grouped: Record<string, { date: string; sales: number; orders: number }> = {};
    for (const sale of (sales || []) as any[]) {
      const date = String(sale.createdAt || '').slice(0, 10) || 'unknown';
      if (!grouped[date]) {
        grouped[date] = { date, sales: 0, orders: 0 };
      }
      grouped[date].sales += Number(sale.total || 0);
      grouped[date].orders += 1;
    }
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getInventory(tenantId?: string) {
    const products = await this.productRepo.findAll(this.tenantFilter(tenantId));
    const grouped: Record<
      string,
      { category: string; totalProducts: number; totalValue: number; lowStock: number }
    > = {};
    for (const product of (products || []) as any[]) {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = {
          category,
          totalProducts: 0,
          totalValue: 0,
          lowStock: 0,
        };
      }
      grouped[category].totalProducts += 1;
      grouped[category].totalValue += Number(product.price || 0) * Number(product.stock || 0);
      if (Number(product.stock || 0) <= Number(product.minStock || 0)) {
        grouped[category].lowStock += 1;
      }
    }
    return Object.values(grouped);
  }

  async getVat(tenantId?: string) {
    const sales = await this.saleRepo.findAll({
      ...this.tenantFilter(tenantId),
      status: 'completed',
    });
    const grouped: Record<
      string,
      { month: string; taxableAmount: number; vatCollected: number; vatPaid: number }
    > = {};
    for (const sale of (sales || []) as any[]) {
      const month = String(sale.createdAt || '').slice(0, 7) || 'unknown';
      if (!grouped[month]) {
        grouped[month] = {
          month,
          taxableAmount: 0,
          vatCollected: 0,
          vatPaid: 0,
        };
      }
      grouped[month].taxableAmount += Number(sale.subtotal || 0);
      grouped[month].vatCollected += Number(sale.vatAmount || 0);
    }
    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }

  async getProfitLoss(tenantId?: string) {
    const [sales, purchases] = await Promise.all([
      this.saleRepo.findAll({
        ...this.tenantFilter(tenantId),
        status: 'completed',
      }),
      this.purchaseRepo.findAll(this.tenantFilter(tenantId)),
    ]);
    const grouped: Record<
      string,
      {
        month: string;
        revenue: number;
        costOfGoods: number;
        grossProfit: number;
        expenses: number;
        netProfit: number;
      }
    > = {};

    for (const sale of (sales || []) as any[]) {
      const month = String(sale.createdAt || '').slice(0, 7) || 'unknown';
      if (!grouped[month]) {
        grouped[month] = {
          month,
          revenue: 0,
          costOfGoods: 0,
          grossProfit: 0,
          expenses: 0,
          netProfit: 0,
        };
      }
      grouped[month].revenue += Number(sale.total || 0);
    }

    for (const purchase of (purchases || []) as any[]) {
      const month = String(purchase.orderDate || purchase.createdAt || '').slice(0, 7) || 'unknown';
      if (!grouped[month]) {
        grouped[month] = {
          month,
          revenue: 0,
          costOfGoods: 0,
          grossProfit: 0,
          expenses: 0,
          netProfit: 0,
        };
      }
      grouped[month].costOfGoods += Number(purchase.total || 0);
    }

    return Object.values(grouped)
      .map((row) => ({
        ...row,
        grossProfit: row.revenue - row.costOfGoods,
        netProfit: row.revenue - row.costOfGoods - row.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
