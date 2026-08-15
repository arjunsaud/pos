'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useTenantSelectorStore } from '@/features/auth/store';
import { apiPaths, apiRequest, resourceApi } from '@/lib/api';
import { mapActivityLog, mapStaffMember, mapUserProfile } from '@/lib/api/mappers';
import type {
  ActivityLog,
  AdminPaymentMethod,
  AppNotification,
  Batch,
  Category,
  Contract,
  Customer,
  InventoryItem,
  InventoryReportData,
  Outlet,
  PaymentReceipt,
  Product,
  ProfitLossData,
  Promotion,
  PurchaseOrder,
  Referral,
  ReturnRefund,
  Sale,
  SalesReportData,
  StaffMember,
  StockMovement,
  StockTransfer,
  Subscription,
  SubscriptionPackage,
  SuperAdminStats,
  SupportTicket,
  Tenant,
  TenantDocument,
  TenantFeature,
  TenantStats,
  UserProfile,
  VATReportData,
  Vendor,
} from '@/lib/types';

type QueryMap = Record<string, string | number | boolean | undefined>;

const EMPTY_ITEMS: never[] = [];

function useScope() {
  const role = useAuthStore((s) => s.user?.role);
  const userTenantId = useAuthStore((s) => s.user?.tenantId);
  const selectedTenantId = useTenantSelectorStore((s) => s.selectedTenantId);
  const isAdmin = role === 'super-admin';
  return {
    isAdmin,
    tenantId: isAdmin ? selectedTenantId : userTenantId,
    userTenantId,
  };
}

export function useResource<T>(
  path: string | null,
  query?: QueryMap,
  map?: (row: Record<string, unknown>) => T,
) {
  const queryClient = useQueryClient();
  const queryKey = ['resource', path, query];

  const q = useQuery({
    queryKey,
    enabled: Boolean(path),
    queryFn: async () => {
      const rows = await resourceApi(path!).list<unknown[]>({
        perPage: 100,
        ...query,
      });
      const list = Array.isArray(rows) ? rows : [];
      return map
        ? list.map((row) => map(row as Record<string, unknown>))
        : (list as T[]);
    },
  });

  const api = path ? resourceApi(path) : null;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['resource', path] });

  return {
    items: (q.data ?? EMPTY_ITEMS) as T[],
    isLoading: q.isLoading,
    refetch: q.refetch,
    create: async (body: unknown) => {
      if (!api) return;
      await api.create(body);
      await invalidate();
    },
    update: async (id: string, body: unknown) => {
      if (!api) return;
      await api.update(id, body);
      await invalidate();
    },
    remove: async (id: string) => {
      if (!api) return;
      await api.remove(id);
      await invalidate();
    },
    setActive: async (id: string, active: boolean) => {
      if (!api) return;
      if (active) {
        await api.active(id);
      } else {
        await api.inactive(id);
      }
      await invalidate();
    },
  };
}

export function useTenants() {
  return useResource<Tenant>(apiPaths.admin.tenant);
}

export function usePackages(publicOnly = false) {
  const { isAdmin } = useScope();
  const path = publicOnly
    ? apiPaths.user.publicPackages
    : isAdmin
      ? apiPaths.admin.package
      : apiPaths.user.package;
  return useResource<SubscriptionPackage>(path);
}

export function usePublicPackages() {
  return useQuery({
    queryKey: ['public-packages'],
    queryFn: async () => {
      const rows = await apiRequest<SubscriptionPackage[]>(
        apiPaths.user.publicPackages,
        { auth: false, query: { perPage: 100 } },
      );
      return Array.isArray(rows) ? rows : EMPTY_ITEMS;
    },
  });
}

export function useSubscriptions() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.subscription : apiPaths.user.subscription;
  return useResource<Subscription>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useProducts() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.product : apiPaths.user.product;
  return useResource<Product>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useCategories() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.category : apiPaths.user.category;
  return useResource<Category>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useVendors() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.vendor : apiPaths.user.vendor;
  return useResource<Vendor>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useCustomers() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.customer : apiPaths.user.customer;
  return useResource<Customer>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useSales() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.sale : apiPaths.user.sale;
  return useResource<Sale>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useInventory() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.inventory : apiPaths.user.inventory;
  return useResource<InventoryItem>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useStockMovements() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.stockMovement : apiPaths.user.stockMovement;
  return useResource<StockMovement>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useBatches() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.batch : apiPaths.user.batch;
  return useResource<Batch>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useOutlets() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.outlet : apiPaths.user.outlet;
  return useResource<Outlet>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function usePurchases() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.purchase : apiPaths.user.purchase;
  return useResource<PurchaseOrder>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useStockTransfers() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.stockTransfer : apiPaths.user.stockTransfer;
  return useResource<StockTransfer>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useNotifications() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.notification : apiPaths.user.notification;
  return useResource<AppNotification>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useSupportTickets() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.supportTicket : apiPaths.user.supportTicket;
  return useResource<SupportTicket>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useDocuments() {
  return useResource<TenantDocument>(apiPaths.admin.document);
}

export function useContracts() {
  return useResource<Contract>(apiPaths.admin.contract);
}

export function usePromotions() {
  return useResource<Promotion>(apiPaths.admin.promotion);
}

export function useReferrals() {
  return useResource<Referral>(apiPaths.admin.referral);
}

export function usePaymentMethods() {
  return useResource<AdminPaymentMethod>(apiPaths.admin.paymentMethod);
}

export function usePaymentReceipts() {
  return useResource<PaymentReceipt>(apiPaths.admin.paymentReceipt);
}

export function useFeatures() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.feature : apiPaths.user.feature;
  return useResource<TenantFeature>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useReturnRefunds() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.returnRefund : apiPaths.user.returnRefund;
  return useResource<ReturnRefund>(path, isAdmin ? { tenantId: tenantId || undefined } : undefined);
}

export function useActivityLogs() {
  const { isAdmin, tenantId } = useScope();
  return useResource<ActivityLog>(
    apiPaths.admin.activityLog,
    isAdmin ? { tenantId: tenantId || undefined } : undefined,
    mapActivityLog,
  );
}

export function useAdminStaff() {
  return useResource<StaffMember>(apiPaths.admin.staff, undefined, mapStaffMember);
}

export function useTenantStaff() {
  const { isAdmin, tenantId } = useScope();
  const path = isAdmin ? apiPaths.admin.user : apiPaths.user.staff;
  return useResource<StaffMember>(
    path,
    isAdmin ? { tenantId: tenantId || undefined } : undefined,
    mapStaffMember,
  );
}

export function useDashboardStats() {
  const { isAdmin } = useScope();
  const path = isAdmin
    ? `${apiPaths.admin.dashboard}/total`
    : `${apiPaths.user.dashboard}/total`;
  return useQuery({
    queryKey: ['dashboard', path],
    queryFn: () => apiRequest<SuperAdminStats & TenantStats>(path),
  });
}

export function useSalesReport() {
  const { isAdmin, tenantId } = useScope();
  const path = `${isAdmin ? apiPaths.admin.report : apiPaths.user.report}/sales`;
  return useQuery({
    queryKey: ['report', 'sales', path, tenantId],
    queryFn: () =>
      apiRequest<SalesReportData[]>(path, {
        query: isAdmin ? { tenantId: tenantId || undefined } : undefined,
      }),
  });
}

export function useInventoryReport() {
  const { isAdmin, tenantId } = useScope();
  const path = `${isAdmin ? apiPaths.admin.report : apiPaths.user.report}/inventory`;
  return useQuery({
    queryKey: ['report', 'inventory', path, tenantId],
    queryFn: () =>
      apiRequest<InventoryReportData[]>(path, {
        query: isAdmin ? { tenantId: tenantId || undefined } : undefined,
      }),
  });
}

export function useVatReport() {
  const { isAdmin, tenantId } = useScope();
  const path = `${isAdmin ? apiPaths.admin.report : apiPaths.user.report}/vat`;
  return useQuery({
    queryKey: ['report', 'vat', path, tenantId],
    queryFn: () =>
      apiRequest<VATReportData[]>(path, {
        query: isAdmin ? { tenantId: tenantId || undefined } : undefined,
      }),
  });
}

export function useProfitLossReport() {
  const { isAdmin, tenantId } = useScope();
  const path = `${isAdmin ? apiPaths.admin.report : apiPaths.user.report}/profit-loss`;
  return useQuery({
    queryKey: ['report', 'profit-loss', path, tenantId],
    queryFn: () =>
      apiRequest<ProfitLossData[]>(path, {
        query: isAdmin ? { tenantId: tenantId || undefined } : undefined,
      }),
  });
}

export function useCurrentProfile() {
  const user = useAuthStore((s) => s.user);
  const kind = user?.role === 'super-admin' ? 'admin' : 'user';
  const path =
    kind === 'admin'
      ? apiPaths.admin.auth.profile
      : apiPaths.user.auth.profile;
  return useQuery({
    queryKey: ['profile', kind, user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const row = await apiRequest<Record<string, unknown>>(path);
      return mapUserProfile(row, user!.role);
    },
  });
}

export async function updateCurrentProfile(body: unknown) {
  const role = useAuthStore.getState().user?.role;
  const path =
    role === 'super-admin'
      ? apiPaths.admin.auth.updateProfile
      : apiPaths.user.auth.updateProfile;
  return apiRequest(path, { method: 'PATCH', body });
}
