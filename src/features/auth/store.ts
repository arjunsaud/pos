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
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// ---------- Navigation State ----------
interface NavState {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
}

export const useNavStore = create<NavState>((set) => ({
  currentSection: 'super-admin-dashboard',
  setCurrentSection: (section: NavSection) => set({ currentSection: section }),
}));
