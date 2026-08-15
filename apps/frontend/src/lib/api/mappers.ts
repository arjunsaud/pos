import type {
  ActivityLog,
  StaffMember,
  SuperAdminStaffRole,
  TenantStaffRole,
  User,
  UserProfile,
  UserRole,
} from '@/lib/types';

function asString(value: unknown, fallback = ''): string {
  return value === undefined || value === null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function mapUserFromProfile(
  profile: Record<string, unknown>,
  kind: 'admin' | 'user',
): User {
  const tenantStaffRole = asString(profile.tenantStaffRole) as TenantStaffRole | '';
  const role: UserRole =
    kind === 'admin'
      ? 'super-admin'
      : tenantStaffRole
        ? 'staff'
        : 'tenant-admin';

  return {
    id: asString(profile.id || profile._id),
    name: asString(profile.name || profile.fullName, 'User'),
    email: asString(profile.email),
    role,
    tenantStaffRole: tenantStaffRole || undefined,
    superAdminStaffRole:
      kind === 'admin'
        ? ((asString(profile.role).toLowerCase() === 'staff'
            ? 'support'
            : 'admin') as SuperAdminStaffRole)
        : undefined,
    avatar: asString(
      (profile.photo as { completedUrl?: string } | undefined)?.completedUrl,
      undefined as unknown as string,
    ) || undefined,
    tenantId: asString(profile.tenantId) || undefined,
    tenantName: asString(profile.tenantName) || undefined,
  };
}

export function mapStaffMember(row: Record<string, unknown>): StaffMember {
  const tenantRole = asString(row.tenantStaffRole);
  const adminRole = asString(row.role).toLowerCase();
  const role = (tenantRole ||
    (adminRole === 'staff' ? 'support' : 'admin')) as StaffMember['role'];

  return {
    id: asString(row.id || row._id),
    name: asString(row.name || row.fullName, 'Staff'),
    email: asString(row.email),
    phone: asString(row.phone || row.mobileNumber),
    role,
    status: row.isActive === false || row.status === 'inactive' ? 'inactive' : 'active',
    createdAt: asString(row.createdAt).slice(0, 10),
    permissions: Array.isArray(row.permissions)
      ? (row.permissions as string[])
      : [],
    avatar: asString(
      (row.photo as { completedUrl?: string } | undefined)?.completedUrl,
      undefined as unknown as string,
    ) || undefined,
  };
}

export function mapActivityLog(row: Record<string, unknown>): ActivityLog {
  return {
    id: asString(row.id || row._id),
    user: asString(row.user, 'System'),
    action: asString(row.action),
    details: asString(row.details),
    timestamp: asString(row.timestamp || row.createdAt),
    type: (asString(row.type, 'info') as ActivityLog['type']),
  };
}

export function mapUserProfile(
  row: Record<string, unknown>,
  role: UserRole,
): UserProfile {
  return {
    id: asString(row.id || row._id),
    name: asString(row.name || row.fullName),
    email: asString(row.email),
    phone: asString(row.phone || row.mobileNumber),
    avatar:
      asString(
        (row.photo as { completedUrl?: string } | undefined)?.completedUrl,
        undefined as unknown as string,
      ) || undefined,
    role,
    bio: asString(row.bio),
    address: asString(row.address),
    city: asString(row.city),
    pan: asString(row.pan),
    referralCode: asString(row.referralCode),
    referralCount: asNumber(row.referralCount),
    referralEarnings: asNumber(row.referralEarnings),
    joinedAt: asString(row.joinedAt || row.createdAt).slice(0, 10),
  };
}

export function toPackagePayload(pkg: Record<string, unknown>) {
  const { export: canExport, id: _id, createdAt: _c, updatedAt: _u, ...rest } = pkg;
  return {
    ...rest,
    canExport: canExport ?? pkg.canExport,
  };
}

export { asString, asNumber };
