import { create } from 'zustand';
import type { User, UserRole, NavSection } from '@/lib/types';
import {
  apiPaths,
  apiRequest,
  ApiError,
  getAccessToken,
  getAuthKind,
  setAccessToken,
  setAuthKind,
} from '@/lib/api';
import { mapUserFromProfile } from '@/lib/api/mappers';
import { isDesktopClient } from '@/lib/desktop';

const DESKTOP_ADMIN_BLOCKED = 'Super admin cannot sign in to the desktop app.';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  mobileNumber?: string;
  tenantName: string;
}

// ---------- Auth State ----------
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<User | { requiresTwoFactor: true; email: string; kind: 'admin' | 'user' }>;
  completeTwoFactorLogin: (
    email: string,
    otp: string,
    kind: 'admin' | 'user',
  ) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  restoreSession: () => Promise<void>;
  logout: () => void;
}

async function fetchProfile(kind: 'admin' | 'user'): Promise<User> {
  const path =
    kind === 'admin'
      ? apiPaths.admin.auth.profile
      : apiPaths.user.auth.profile;
  const profile = await apiRequest<Record<string, unknown>>(path);
  return mapUserFromProfile(profile, kind);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,
  login: async (email, password, role) => {
    if (isDesktopClient() && role === 'super-admin') {
      throw new ApiError(403, { message: DESKTOP_ADMIN_BLOCKED }, DESKTOP_ADMIN_BLOCKED);
    }
    const kind: 'admin' | 'user' =
      isDesktopClient() || role !== 'super-admin' ? 'user' : 'admin';
    const loginPath =
      kind === 'admin' ? apiPaths.admin.auth.login : apiPaths.user.auth.login;
    const tokens = await apiRequest<{
      accessToken?: string;
      requiresTwoFactor?: boolean;
      email?: string;
    }>(loginPath, {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    if (tokens.requiresTwoFactor) {
      return {
        requiresTwoFactor: true as const,
        email: tokens.email || email,
        kind,
      };
    }
    if (!tokens.accessToken) {
      throw new ApiError(400, { message: 'Sign in failed' }, 'Sign in failed');
    }
    setAccessToken(tokens.accessToken, kind);
    setAuthKind(kind);
    const user = await fetchProfile(kind);
    if (isDesktopClient() && user.role === 'super-admin') {
      setAccessToken(null);
      setAuthKind(null);
      throw new ApiError(403, { message: DESKTOP_ADMIN_BLOCKED }, DESKTOP_ADMIN_BLOCKED);
    }
    set({ user, isAuthenticated: true, hydrated: true });
    return user;
  },
  completeTwoFactorLogin: async (email, otp, kind) => {
    const path = kind === 'admin' ? apiPaths.admin.auth.login2fa : apiPaths.user.auth.login2fa;
    const tokens = await apiRequest<{ accessToken: string }>(path, {
      method: 'POST',
      body: { email, otp },
      auth: false,
    });
    setAccessToken(tokens.accessToken, kind);
    setAuthKind(kind);
    const user = await fetchProfile(kind);
    if (isDesktopClient() && user.role === 'super-admin') {
      setAccessToken(null);
      setAuthKind(null);
      throw new ApiError(403, { message: DESKTOP_ADMIN_BLOCKED }, DESKTOP_ADMIN_BLOCKED);
    }
    set({ user, isAuthenticated: true, hydrated: true });
    return user;
  },
  register: async (payload) => {
    if (isDesktopClient()) {
      throw new ApiError(
        403,
        { message: 'Create an account on the web app, then sign in here.' },
        'Create an account on the web app, then sign in here.',
      );
    }
    await apiRequest(apiPaths.user.auth.register, {
      method: 'POST',
      body: payload,
      auth: false,
    });
    return useAuthStore.getState().login(
      payload.email,
      payload.password,
      'tenant-admin',
    );
  },
  restoreSession: async () => {
    const token = getAccessToken();
    const kind = getAuthKind();
    if (!token || !kind) {
      set({ user: null, isAuthenticated: false, hydrated: true });
      return;
    }
    try {
      if (isDesktopClient() && kind === 'admin') {
        throw new Error('desktop-admin-blocked');
      }
      setAccessToken(token, kind);
      setAuthKind(kind);
      const user = await fetchProfile(kind);
      if (isDesktopClient() && user.role === 'super-admin') {
        throw new Error('desktop-admin-blocked');
      }
      set({ user, isAuthenticated: true, hydrated: true });
    } catch {
      setAccessToken(null);
      setAuthKind(null);
      set({ user: null, isAuthenticated: false, hydrated: true });
    }
  },
  logout: () => {
    setAccessToken(null);
    setAuthKind(null);
    set({ user: null, isAuthenticated: false, hydrated: true });
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
  },
  clearSelection: () => set({ selectedTenantId: null }),
}));

interface OutletSelectorState {
  selectedOutletId: string | null;
  setSelectedOutletId: (id: string | null) => void;
  clearSelection: () => void;
}

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
