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
  logout: () => set({ user: null, isAuthenticated: false }),
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
