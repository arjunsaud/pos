import type { NavSection, UserRole } from '@/lib/types';

export const PATHS = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  pos: '/pos',
  billing: '/billing',
  products: '/products',
  inventory: '/inventory',
  categories: '/categories',
  vendors: '/vendors',
  purchases: '/purchases',
  stockTransfer: '/stock-transfer',
  salesReports: '/sales-reports',
  customers: '/customers',
  subscription: '/subscription',
  outlets: '/outlets',
  storeProfile: '/store-profile',
  staff: '/staff',
  notifications: '/notifications',
  support: '/support',
  profile: '/profile',
  settings: '/settings',
  tenants: '/tenants',
  packages: '/packages',
  documents: '/documents',
  contracts: '/contracts',
  promotions: '/promotions',
  referrals: '/referrals',
  payment: '/payment',
  templates: '/templates',
  supportTickets: '/support-tickets',
  activityLogs: '/activity-logs',
} as const;

const tenantViewSuffix: Record<string, string> = {
  'sa-tenant-overview': '',
  'sa-tenant-billing': '/billing',
  'sa-tenant-products': '/products',
  'sa-tenant-inventory': '/inventory',
  'sa-tenant-categories': '/categories',
  'sa-tenant-sales': '/sales',
  'sa-tenant-reports': '/reports',
  'sa-tenant-staff-view': '/staff',
  'sa-tenant-subscription': '/subscription',
  'sa-tenant-features': '/features',
  'sa-tenant-vendors': '/vendors',
};

const sectionPath: Partial<Record<NavSection, string>> = {
  'super-admin-dashboard': PATHS.dashboard,
  'tenant-dashboard': PATHS.dashboard,
  tenants: PATHS.tenants,
  'super-admin-staff': PATHS.staff,
  'sa-packages': PATHS.packages,
  'sa-documents': PATHS.documents,
  'sa-contracts': PATHS.contracts,
  'activity-logs': PATHS.activityLogs,
  'super-admin-settings': PATHS.settings,
  'sa-promotions': PATHS.promotions,
  'sa-referrals': PATHS.referrals,
  'sa-profile': PATHS.profile,
  'sa-templates': PATHS.templates,
  'sa-payment': PATHS.payment,
  'sa-support-tickets': PATHS.supportTickets,
  pos: PATHS.pos,
  billing: PATHS.billing,
  products: PATHS.products,
  inventory: PATHS.inventory,
  categories: PATHS.categories,
  vendors: PATHS.vendors,
  'sales-reports': PATHS.salesReports,
  'tenant-subscription': PATHS.subscription,
  'tenant-staff': PATHS.staff,
  'store-profile': PATHS.storeProfile,
  'tenant-profile': PATHS.profile,
  'tenant-settings': PATHS.settings,
  'tenant-outlets': PATHS.outlets,
  'tenant-support': PATHS.support,
  customers: PATHS.customers,
  notifications: PATHS.notifications,
  purchases: PATHS.purchases,
  'stock-transfer': PATHS.stockTransfer,
  'landing-page': PATHS.home,
};

export function hrefForSection(
  section: NavSection,
  tenantId?: string | null,
): string {
  if (section.startsWith('sa-tenant-')) {
    if (!tenantId) return PATHS.tenants;
    const suffix = tenantViewSuffix[section] ?? '';
    return `${PATHS.tenants}/${tenantId}${suffix}`;
  }
  return sectionPath[section] ?? PATHS.dashboard;
}

export function homePath(role: UserRole): string {
  return role === 'staff' ? PATHS.pos : PATHS.dashboard;
}
