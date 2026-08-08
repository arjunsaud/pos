'use client';

import { useAuthStore, useNavStore } from '@/features/auth/store';
import { LoginPage } from '@/components/layout/login-page';
import { AppSidebar, MobileBottomNav, MobileSidebarTrigger } from '@/components/layout/app-sidebar';
import { AppNavbar } from '@/components/layout/app-navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Super Admin pages
import SuperAdminDashboard from '@/features/super-admin/dashboard/components/super-admin-dashboard';
import TenantManagement from '@/features/super-admin/tenants/components/tenant-management';
import SuperAdminStaff from '@/features/super-admin/staff/components/super-admin-staff';
import SubscriptionManagement from '@/features/super-admin/subscriptions/components/subscription-management';
import ActivityLogs from '@/features/super-admin/activity-logs/components/activity-logs';
import ContentManagement from '@/features/super-admin/content/components/content-management';
import SuperAdminSettings from '@/features/super-admin/settings/components/super-admin-settings';

// Tenant pages
import TenantDashboard from '@/features/tenant/dashboard/components/tenant-dashboard';
import PosTerminal from '@/features/tenant/pos/components/pos-terminal';
import BillingPage from '@/features/tenant/billing/components/billing-page';
import ProductManagement from '@/features/tenant/products/components/product-management';
import InventoryPage from '@/features/tenant/inventory/components/inventory-page';
import CategoriesPage from '@/features/tenant/categories/components/categories-page';
import SalesPage from '@/features/tenant/sales/components/sales-page';
import ReportsPage from '@/features/tenant/reports/components/reports-page';
import TenantSubscriptionPage from '@/features/tenant/subscription/components/tenant-subscription-page';
import TenantStaffPage from '@/features/tenant/staff/components/tenant-staff-page';

import type { NavSection } from '@/lib/types';

const sectionComponents: Record<NavSection, React.ComponentType> = {
  'super-admin-dashboard': SuperAdminDashboard,
  'tenants': TenantManagement,
  'super-admin-staff': SuperAdminStaff,
  'super-admin-subscriptions': SubscriptionManagement,
  'activity-logs': ActivityLogs,
  'content': ContentManagement,
  'super-admin-settings': SuperAdminSettings,
  'tenant-dashboard': TenantDashboard,
  'pos': PosTerminal,
  'billing': BillingPage,
  'products': ProductManagement,
  'inventory': InventoryPage,
  'categories': CategoriesPage,
  'sales': SalesPage,
  'reports': ReportsPage,
  'tenant-subscription': TenantSubscriptionPage,
  'tenant-staff': TenantStaffPage,
};

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { currentSection } = useNavStore();

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {CurrentPage && <CurrentPage />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {isStaff && <MobileBottomNav />}
    </div>
  );
}
