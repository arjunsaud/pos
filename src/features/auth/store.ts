import { create } from 'zustand';
import type { User, UserRole, NavSection, TenantStaffRole, SuperAdminStaffRole } from '@/lib/types';

// ---------- Auth State ----------
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (role: UserRole) => {
    const users: Record<UserRole, User> = {
      'super-admin': {
        id: 'sa-main',
        name: 'Super Admin',
        email: 'admin@posnepal.com',
        role: 'super-admin',
        superAdminStaffRole: 'admin',
      },
      'tenant-admin': {
        id: 'ta-main',
        name: 'Rajesh Sharma',
        email: 'admin@abcstore.com',
        role: 'tenant-admin',
        tenantId: 't1',
        tenantName: 'ABC Store',
      },
      'staff': {
        id: 'ts1',
        name: 'Ramesh Karki',
        email: 'ramesh@abcstore.com',
        role: 'staff',
        tenantId: 't1',
        tenantName: 'ABC Store',
        tenantStaffRole: 'cashier',
      },
    };
    set({ user: users[role], isAuthenticated: true });
    // Navigate to the correct default section for the role
    const defaults: Record<UserRole, NavSection> = {
      'super-admin': 'super-admin-dashboard',
      'tenant-admin': 'tenant-dashboard',
      'staff': 'pos',
    };
    useNavStore.getState().setCurrentSection(defaults[role]);
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    // Clear tenant selection on logout
    useTenantSelectorStore.getState().clearSelection();
    useOutletSelectorStore.getState().clearSelection();
  },
}));

// ---------- Navigation State ----------
interface NavState {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  resetToDefault: (role: UserRole) => void;
  recentSections: NavSection[];
  pushRecent: (section: NavSection) => void;
}

export const useNavStore = create<NavState>((set, get) => ({
  currentSection: 'super-admin-dashboard',
  recentSections: [],
  pushRecent: (section: NavSection) => {
    const { recentSections } = get();
    const filtered = recentSections.filter(s => s !== section);
    set({ recentSections: [section, ...filtered].slice(0, 5) });
  },
  setCurrentSection: (section: NavSection) => {
    const { pushRecent } = get();
    pushRecent(section);
    set({ currentSection: section });
  },
  resetToDefault: (role: UserRole) => {
    const defaults: Record<UserRole, NavSection> = {
      'super-admin': 'super-admin-dashboard',
      'tenant-admin': 'tenant-dashboard',
      'staff': 'pos',
    };
    set({ currentSection: defaults[role] });
  },
}));

// ---------- Tenant Selector State (Super Admin) ----------
interface TenantSelectorState {
  selectedTenantId: string | null;
  setSelectedTenantId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useTenantSelectorStore = create<TenantSelectorState>((set) => ({
  selectedTenantId: null,
  setSelectedTenantId: (id: string | null) => {
    set({ selectedTenantId: id });
    // When selecting a tenant, navigate to tenant overview
    if (id) {
      useNavStore.getState().setCurrentSection('sa-tenant-overview');
    }
  },
  clearSelection: () => set({ selectedTenantId: null }),
}));

export const useOutletSelectorStore = create<OutletSelectorState>((set) => ({
  selectedOutletId: null,
  setSelectedOutletId: (id: string | null) => {
    set({ selectedOutletId: id });
  },
  clearSelection: () => set({ selectedOutletId: null }),
}));

// ---------- Legal Content State ----------
export const defaultTermsContent = `# Terms & Conditions

## 1. Acceptance of Terms

By accessing and using POS Nepal ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.

## 2. Description of Service

POS Nepal is a multi-tenant Point of Sale, Inventory Management, and Billing System designed for businesses in Nepal.

## 3. User Accounts

- You must provide accurate and complete information when creating an account
- You are responsible for maintaining the confidentiality of your account
- You must notify us immediately of any unauthorized use

## 4. Subscription and Payment

- Subscription fees are billed in NPR (Nepali Rupees)
- Payment can be made via eSewa, Khalti, bank transfer, or QR code
- Receipts must be uploaded within 24 hours of payment

## 5. Free Trial

New accounts receive a 7-day free trial. No credit card is required for the trial.

## 6. Data and Privacy

We collect and process data in accordance with our Privacy Policy. By using the Service, you consent to the collection and use of your information.

## 7. Limitation of Liability

POS Nepal shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.

## 8. Contact

For questions about these Terms, contact us at legal@posnepal.com`;

export const defaultPrivacyContent = `# Privacy Policy

## 1. Information We Collect

- **Account Information:** Name, email, phone number, business name, PAN number
- **Transaction Data:** Sales records, inventory data, billing information
- **Usage Data:** Login times, feature usage, device information
- **Payment Data:** Payment method preferences, transaction receipts

## 2. How We Use Your Information

- To provide and maintain the POS service
- To process payments and manage subscriptions
- To improve our service and develop new features
- To comply with legal obligations in Nepal

## 3. Data Storage and Security

All data is encrypted at rest and in transit. We use industry-standard security measures. Access to personal data is restricted to authorized personnel only.

## 4. Data Sharing

We do not sell, trade, or rent your personal information to third parties. We may share data with payment processors (eSewa, Khalti), legal authorities when required by Nepali law, and trusted service providers.

## 5. Your Rights

- Access and download your data at any time
- Request correction of inaccurate information
- Request deletion of your account and data

## 6. Contact Us

For privacy-related inquiries, contact us at privacy@posnepal.com`;

interface LegalContentState {
  termsContent: string;
  privacyContent: string;
  setTermsContent: (content: string) => void;
  setPrivacyContent: (content: string) => void;
}

export const useLegalContentStore = create<LegalContentState>((set) => ({
  termsContent: defaultTermsContent,
  privacyContent: defaultPrivacyContent,
  setTermsContent: (content: string) => set({ termsContent: content }),
  setPrivacyContent: (content: string) => set({ privacyContent: content }),
}));
