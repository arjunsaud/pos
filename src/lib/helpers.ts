// ============================================================
// Shared formatting & UI helpers used across the entire application
// ============================================================

import { cn } from '@/lib/utils';
import type { TenantStaffRole, SuperAdminStaffRole } from '@/lib/types';

// ---------- Currency ----------
export const npr = (n: number) => new Intl.NumberFormat('en-NP').format(Math.round(n * 100) / 100);
export const nprFull = (n: number) => new Intl.NumberFormat('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ---------- Time ----------
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// ---------- Avatar ----------
export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// ---------- Badges ----------
export function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'active':
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'inactive':
    case 'refunded':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getPlanBadgeClasses(plan: string): string {
  switch (plan) {
    case 'basic':
      return 'bg-secondary text-secondary-foreground';
    case 'pro':
      return 'bg-primary text-primary-foreground';
    case 'enterprise':
      return 'border border-primary/30 text-primary bg-primary/5';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'support':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'finance':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'manager':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'cashier':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

// ---------- Stock ----------
export function getStockBadgeClasses(current: number, min: number): string {
  if (current <= 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (current <= min) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
}

export function getStockStatus(current: number, min: number): string {
  if (current <= 0) return 'Out of Stock';
  if (current <= min) return 'Low Stock';
  return 'In Stock';
}

// ---------- Log type ----------
export function getLogDotColor(type: string): string {
  const colors: Record<string, string> = {
    success: 'bg-emerald-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  return colors[type] || 'bg-gray-400';
}

// ---------- Promotion ----------
export function getPromotionStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'expired': return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    case 'scheduled': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getReferralStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'rewarded': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'converted': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getPromotionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    percentage: '%',
    fixed: 'NPR',
    trial_extension: 'days',
    free_month: 'month',
  };
  return labels[type] || '';
}

export function getPromotionValueDisplay(type: string, value: number): string {
  switch (type) {
    case 'percentage': return `${value}% off`;
    case 'fixed': return `NPR ${nprFull(value)} off`;
    case 'trial_extension': return `${value} extra days`;
    case 'free_month': return `${value} free month${value > 1 ? 's' : ''}`;
    default: return String(value);
  }
}
