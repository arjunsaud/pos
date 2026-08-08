'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BellOff, Search, ArrowUpDown, ShoppingCart, Settings, AlertTriangle, CreditCard, Info, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ---------- Types ----------

type NotificationCategory = 'all' | 'sale' | 'payment' | 'inventory' | 'system' | 'promotion';

type SortOption = 'newest' | 'oldest';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: Exclude<NotificationCategory, 'all'>;
  read: boolean;
  time: string; // ISO string
}

// ---------- Category Config ----------

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sale: ShoppingCart,
  payment: CreditCard,
  inventory: AlertTriangle,
  system: Settings,
  promotion: Megaphone,
};

const CATEGORY_STYLES: Record<string, { indicator: string; iconBg: string; iconText: string }> = {
  sale: {
    indicator: 'bg-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  payment: {
    indicator: 'bg-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-400',
  },
  inventory: {
    indicator: 'bg-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
  system: {
    indicator: 'bg-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-900/30',
    iconText: 'text-gray-600 dark:text-gray-400',
  },
  promotion: {
    indicator: 'bg-rose-500',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconText: 'text-rose-600 dark:text-rose-400',
  },
};

// ---------- Time Helpers ----------

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;

  const thenDate = new Date(isoString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    thenDate.getFullYear() === yesterday.getFullYear() &&
    thenDate.getMonth() === yesterday.getMonth() &&
    thenDate.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }

  return thenDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ---------- Mock Data ----------

const initialNotifications: Notification[] = [
  { id: 'n1', title: 'New Sale #1087', message: 'Sita Kumari purchased DDC Milk, Wai Wai, and Goldstar Shoes at ABC Store — NPR 4,250 via eSewa', category: 'sale', read: false, time: minutesAgo(5) },
  { id: 'n2', title: 'eSewa Payment Received', message: 'NPR 12,750 from Hari Store for Invoice #INV-1092', category: 'payment', read: false, time: minutesAgo(18) },
  { id: 'n3', title: 'Low Stock Alert', message: 'DDC Milk (500ml) is below minimum stock level — 4 units remaining (min: 10)', category: 'inventory', read: false, time: minutesAgo(32) },
  { id: 'n4', title: 'Khalti Payment Confirmed', message: 'NPR 3,800 received from Ram Kumar for Invoice #INV-1089', category: 'payment', read: false, time: hoursAgo(1) },
  { id: 'n5', title: 'Sale Refunded', message: 'Invoice #INV-1056 for NPR 1,200 has been refunded to customer Suman Sharma', category: 'sale', read: false, time: hoursAgo(2) },
  { id: 'n6', title: 'Stock Depleted', message: 'Tokla Tea (Pack of 25) is now out of stock at ABC Store', category: 'inventory', read: false, time: hoursAgo(3) },
  { id: 'n7', title: 'System Update', message: 'POS Nepal platform updated to v2.4.2 — new reports features added', category: 'system', read: false, time: hoursAgo(5) },
  { id: 'n8', title: 'Dashain Offer Started', message: 'Promotional campaign "Dashain Dhamaka" is now active — 10% off on all groceries', category: 'promotion', read: false, time: hoursAgo(8) },
  { id: 'n9', title: 'Bulk Sale Completed', message: 'Laxmi General Store ordered 50 units of Wai Wai — NPR 5,000 via bank transfer', category: 'sale', read: true, time: hoursAgo(12) },
  { id: 'n10', title: 'Stock Replenished', message: 'Surf Excel (1kg) restocked — 30 units added by Ramesh', category: 'inventory', read: true, time: daysAgo(1) },
  { id: 'n11', title: 'Daily Report Ready', message: 'Your sales summary for yesterday is available in Reports — total NPR 45,620', category: 'system', read: true, time: daysAgo(1) },
  { id: 'n12', title: 'New Customer Registered', message: 'Bikash Thapa registered with PAN 304567890 at ABC Store', category: 'system', read: true, time: daysAgo(1) },
  { id: 'n13', title: 'Tihar Promotion Ending', message: 'The "Tihar Special" promotion ends in 2 days — 15% off electronics', category: 'promotion', read: true, time: daysAgo(2) },
  { id: 'n14', title: 'Payment Failed', message: 'Khalti payment of NPR 2,500 from Invoice #INV-1043 was declined — please follow up', category: 'payment', read: true, time: daysAgo(2) },
  { id: 'n15', title: 'Low Stock Warning', message: 'Goldstar Shoes (Size 8) is running low — 2 units remaining (min: 5)', category: 'inventory', read: true, time: daysAgo(3) },
  { id: 'n16', title: 'Subscription Renewed', message: 'ABC Store Pro plan renewed successfully for NPR 4,999/month', category: 'system', read: true, time: daysAgo(3) },
  { id: 'n17', title: 'Large Order #1041', message: 'Pokhara Electronics purchased 3 Samsung TVs — NPR 1,25,000 via bank transfer', category: 'sale', read: true, time: daysAgo(4) },
  { id: 'n18', title: 'Weekend Flash Sale', message: 'Flash sale campaign created — 20% off on snacks and beverages this Saturday', category: 'promotion', read: true, time: daysAgo(5) },
];

// ---------- Category Filter Config ----------

const categoryFilters: { label: string; value: NotificationCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Sale', value: 'sale' },
  { label: 'Payment', value: 'payment' },
  { label: 'Inventory', value: 'inventory' },
  { label: 'System', value: 'system' },
  { label: 'Promotion', value: 'promotion' },
];

// ---------- Component ----------

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id && !n.read ? { ...n, read: true } : n))
    );
  };

  const filtered = useMemo(() => {
    let result = notifications;

    if (activeCategory !== 'all') {
      result = result.filter(n => n.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const aTime = new Date(a.time).getTime();
      const bTime = new Date(b.time).getTime();
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [notifications, activeCategory, searchQuery, sortOrder]);

  const totalNotifications = notifications.length;
  const showingCount = filtered.length;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications">
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="gap-2"
        >
          <BellOff className="h-4 w-4" />
          Mark all as read
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
              {unreadCount}
            </span>
          )}
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="space-y-3">
        {/* Category Filters + Search + Sort — Mobile stack, Desktop row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {categoryFilters.map(filter => {
              const count =
                filter.value === 'all'
                  ? notifications.length
                  : notifications.filter(n => n.category === filter.value).length;
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveCategory(filter.value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5',
                    activeCategory === filter.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                      activeCategory === filter.value
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted-foreground/15 text-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 pl-8 text-sm"
              />
            </div>
            <Select value={sortOrder} onValueChange={v => setSortOrder(v as SortOption)}>
              <SelectTrigger className="h-9 w-[150px] text-sm">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <BellOff className="h-12 w-12 opacity-30" />
          <div className="text-center">
            <p className="text-sm font-medium">No notifications found</p>
            <p className="text-xs mt-1">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'You\'re all caught up!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notification => {
            const Icon = CATEGORY_ICONS[notification.category] || Info;
            const styles = CATEGORY_STYLES[notification.category] || CATEGORY_STYLES.system;
            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  'group relative flex items-start gap-3 rounded-lg border px-4 py-3.5 transition-all duration-150 cursor-pointer',
                  'hover:shadow-md hover:border-primary/20',
                  !notification.read
                    ? 'bg-primary/[0.03] border-primary/10'
                    : 'bg-card border-border/60 opacity-80 hover:opacity-100'
                )}
              >
                {/* Left Color Indicator */}
                <div className={cn('absolute left-0 top-3 bottom-3 w-1 rounded-full', styles.indicator)} />

                {/* Category Icon */}
                <div
                  className={cn(
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    styles.iconBg,
                    styles.iconText
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pl-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        'text-sm leading-snug',
                        !notification.read ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                      )}
                    >
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/20" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-muted-foreground/80">
                      {formatRelativeTime(notification.time)}
                    </span>
                    <span className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                      styles.iconBg,
                      styles.iconText
                    )}>
                      {notification.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 flex items-center justify-between rounded-lg border bg-background/95 px-4 py-3 backdrop-blur-sm text-sm text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-foreground">{showingCount}</span> of{' '}
          <span className="font-semibold text-foreground">{totalNotifications}</span> notifications
        </span>
        <span>
          {unreadCount > 0 ? (
            <>
              <span className="font-semibold text-primary">{unreadCount}</span> unread
            </>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400">All read</span>
          )}
        </span>
      </div>
    </div>
  );
}
