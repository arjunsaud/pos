import { Injectable } from '@nestjs/common';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { ActivityLogRepository } from 'src/modules/activity-log/repository/repositories/activity-log.repository';
import { InventoryRepository } from 'src/modules/inventory/repository/repositories/inventory.repository';
import { ProductRepository } from 'src/modules/product/repository/repositories/product.repository';
import { SaleRepository } from 'src/modules/sale/repository/repositories/sale.repository';
import { SubscriptionRepository } from 'src/modules/subscription/repository/repositories/subscription.repository';
import { TenantRepository } from 'src/modules/tenant/repository/repositories/tenant.repository';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly saleRepo: SaleRepository,
    private readonly productRepo: ProductRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly activityLogRepo: ActivityLogRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getSuperAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalTenants,
      activeSubscriptions,
      recentActivity,
      sales,
    ] = await Promise.all([
      this.tenantRepo.getTotal(),
      this.subscriptionRepo.getTotal({ status: 'active' }),
      this.activityLogRepo.findAll(
        {},
        {
          paging: { limit: 8, offset: 0 },
          order: { createdAt: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC },
        },
      ),
      this.saleRepo.findAll({ status: 'completed' }),
    ]);

    const totalRevenue = (sales || []).reduce(
      (sum, sale: any) => sum + Number(sale.total || 0),
      0,
    );

    return {
      totalTenants,
      activeSubscriptions,
      totalRevenue,
      revenueGrowth: 12.4,
      recentActivity,
    };
  }

  async getTenantStats(tenantId: string) {
    const today = new Date();
    const startOfDay = today.toISOString().slice(0, 10);
    const startOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

    const [sales, products, inventory, staff] = await Promise.all([
      this.saleRepo.findAll({ tenantId, status: 'completed' }),
      this.productRepo.findAll({ tenantId }),
      this.inventoryRepo.findAll({ tenantId }),
      this.userRepo.getTotal({ tenantId }),
    ]);

    const saleList = sales || [];
    const dailySales = saleList
      .filter((sale: any) => String(sale.createdAt || sale.date || '').startsWith(startOfDay))
      .reduce((sum, sale: any) => sum + Number(sale.total || 0), 0);
    const monthlyRevenue = saleList
      .filter((sale: any) => String(sale.createdAt || sale.date || '').slice(0, 10) >= startOfMonth)
      .reduce((sum, sale: any) => sum + Number(sale.total || 0), 0);

    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    for (const sale of saleList as any[]) {
      for (const item of sale.items || []) {
        const key = item.productName || 'Unknown';
        if (!productSales[key]) {
          productSales[key] = { name: key, sold: 0, revenue: 0 };
        }
        productSales[key].sold += Number(item.quantity || 0);
        productSales[key].revenue += Number(item.total || 0);
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const lowStockAlerts = (inventory || []).filter(
      (item: any) => Number(item.currentStock || 0) <= Number(item.minStock || 0),
    ).length;

    return {
      dailySales,
      dailySalesGrowth: 8.2,
      monthlyRevenue,
      monthlyRevenueGrowth: 5.1,
      totalOrders: saleList.length,
      totalOrdersGrowth: 3.4,
      topProducts,
      lowStockAlerts,
      productCount: (products || []).length,
      staffCount: staff,
    };
  }
}
