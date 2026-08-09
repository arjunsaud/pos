'use client';

import { useAuthStore, useNavStore, useTenantSelectorStore } from '@/features/auth/store';
import { LoginPage } from '@/components/layout/login-page';
import { AppSidebar, MobileBottomNav, MobileSidebarTrigger } from '@/components/layout/app-sidebar';
import { AppNavbar } from '@/components/layout/app-navbar';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Super Admin pages
import SuperAdminDashboard from '@/features/super-admin/dashboard/components/super-admin-dashboard';
import TenantManagement from '@/features/super-admin/tenants/components/tenant-management';
import SuperAdminStaff from '@/features/super-admin/staff/components/super-admin-staff';
import SubscriptionManagement from '@/features/super-admin/subscriptions/components/subscription-management';
import ContractsPage from '@/features/super-admin/contracts/components/contracts-page';
import DocumentsPage from '@/features/super-admin/documents/components/documents-page';
import ActivityLogs from '@/features/super-admin/activity-logs/components/activity-logs';
import ContentManagement from '@/features/super-admin/content/components/content-management';
import SuperAdminSettings from '@/features/super-admin/settings/components/super-admin-settings';

// Super Admin - Tenant View pages
import SaTenantOverview from '@/features/super-admin/tenant-view/components/sa-tenant-overview';
import SaTenantBilling from '@/features/super-admin/tenant-view/components/sa-tenant-billing';
import SaTenantProducts from '@/features/super-admin/tenant-view/components/sa-tenant-products';
import SaTenantInventory from '@/features/super-admin/tenant-view/components/sa-tenant-inventory';
import SaTenantCategories from '@/features/super-admin/tenant-view/components/sa-tenant-categories';
import SaTenantSales from '@/features/super-admin/tenant-view/components/sa-tenant-sales';
import SaTenantReports from '@/features/super-admin/tenant-view/components/sa-tenant-reports';
import SaTenantStaffView from '@/features/super-admin/tenant-view/components/sa-tenant-staff-view';
import SaTenantSubscription from '@/features/super-admin/tenant-view/components/sa-tenant-subscription';
import SaTenantFeatures from '@/features/super-admin/tenant-view/components/sa-tenant-features';
import SaTenantVendors from '@/features/super-admin/tenant-view/components/sa-tenant-vendors';

// Tenant pages
import TenantDashboard from '@/features/tenant/dashboard/components/tenant-dashboard';
import PosTerminal from '@/features/tenant/pos/components/pos-terminal';
import CustomersPage from '@/features/tenant/customers/components/customers-page';
import BillingPage from '@/features/tenant/billing/components/billing-page';
import ProductManagement from '@/features/tenant/products/components/product-management';
import InventoryPage from '@/features/tenant/inventory/components/inventory-page';
import CategoriesPage from '@/features/tenant/categories/components/categories-page';
import VendorsPage from '@/features/tenant/vendors/components/vendors-page';
import SalesPage from '@/features/tenant/sales/components/sales-page';
import ReportsPage from '@/features/tenant/reports/components/reports-page';
import TenantSubscriptionPage from '@/features/tenant/subscription/components/tenant-subscription-page';
import TenantStaffPage from '@/features/tenant/staff/components/tenant-staff-page';
import StoreProfile from '@/features/tenant/store-profile/components/store-profile';
import SettlementPage from '@/features/tenant/settlement/components/settlement-page';
import NotificationsPage from '@/features/tenant/notifications/components/notifications-page';

import type { NavSection } from '@/lib/types';

const sectionComponents: Record<NavSection, React.ComponentType> = {
  // Super Admin - Global
  'super-admin-dashboard': SuperAdminDashboard,
  'tenants': TenantManagement,
  'super-admin-staff': SuperAdminStaff,
  'super-admin-subscriptions': SubscriptionManagement,
  'sa-contracts': ContractsPage,
  'sa-documents': DocumentsPage,
  'activity-logs': ActivityLogs,
  'content': ContentManagement,
  'super-admin-settings': SuperAdminSettings,
  // Super Admin - Tenant View
  'sa-tenant-overview': SaTenantOverview,
  'sa-tenant-billing': SaTenantBilling,
  'sa-tenant-products': SaTenantProducts,
  'sa-tenant-inventory': SaTenantInventory,
  'sa-tenant-categories': SaTenantCategories,
  'sa-tenant-sales': SaTenantSales,
  'sa-tenant-reports': SaTenantReports,
  'sa-tenant-staff-view': SaTenantStaffView,
  'sa-tenant-subscription': SaTenantSubscription,
  'sa-tenant-features': SaTenantFeatures,
  'sa-tenant-vendors': SaTenantVendors,
  // Tenant Admin
  'tenant-dashboard': TenantDashboard,
  'pos': PosTerminal,
  'customers': CustomersPage,
  'billing': BillingPage,
  'products': ProductManagement,
  'inventory': InventoryPage,
  'categories': CategoriesPage,
  'vendors': VendorsPage,
  'sales': SalesPage,
  'reports': ReportsPage,
  'tenant-subscription': TenantSubscriptionPage,
  'tenant-staff': TenantStaffPage,
  'store-profile': StoreProfile,
  'settlement': SettlementPage,
  'notifications': NotificationsPage,
};

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { currentSection } = useNavStore();
  const { selectedTenantId } = useTenantSelectorStore();

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // If trying to access a tenant-view page without selecting a tenant, redirect to dashboard
  const isTenantViewPage = currentSection.startsWith('sa-tenant-');
  const CurrentPage = sectionComponents[currentSection];
  const isStaff = user.role === 'staff';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AppNavbar />

          <main className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6',
            isStaff ? 'pb-20 md:pb-6' : 'pb-6'
          )}>
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  {!CurrentPage ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      {isTenantViewPage && !selectedTenantId ? (
                        <>
                          <p className="text-lg font-medium">No Tenant Selected</p>
                          <p className="text-sm mt-1">Please select a tenant from the dropdown above to view their data.</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium">Page Not Found</p>
                          <p className="text-sm mt-1">The requested section does not exist.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <CurrentPage />
                  )}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {isStaff && <MobileBottomNav />}
    </div>
  );
}
