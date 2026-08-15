'use client';

import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell, BellOff, ShoppingCart, Settings, AlertTriangle,
  CreditCard, Info, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/use-api-data';


type NotificationCategory = 'all' | 'order' | 'system' | 'alert' | 'payment' | 'info';

type NotificationType = 'order' | 'system' | 'alert' | 'payment' | 'warning' | 'info' | 'success';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  read: boolean;
  time: string; // ISO string for relative time formatting
}

// Category-specific icon mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  order: ShoppingCart,
  system: Settings,
  alert: AlertTriangle,
  payment: CreditCard,
  info: Info,
};

// Category-specific colors
const CATEGORY_STYLES: Record<string, { indicator: string; iconBg: string; iconText: string }> = {
  order: {
    indicator: 'bg-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  system: {
    indicator: 'bg-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconText: 'text-blue-600 dark:text-blue-400',
  },
  alert: {
    indicator: 'bg-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
  payment: {
    indicator: 'bg-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-400',
  },
  info: {
    indicator: 'bg-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-900/30',
    iconText: 'text-gray-600 dark:text-gray-400',
  },
};

const categoryPills: { label: string; value: NotificationCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Orders', value: 'order' },
  { label: 'System', value: 'system' },
  { label: 'Alerts', value: 'alert' },
];

// Simple relative time formatting
function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;

  // Check if yesterday
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

  // Older: show date
  return thenDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Determine category for styling (fallback for types that don't map directly)
function getCategoryStyle(type: NotificationType, category: NotificationCategory): { indicator: string; iconBg: string; iconText: string } {
  const key = category === 'all' ? type : category;
  return CATEGORY_STYLES[key] || CATEGORY_STYLES.info;
}

function getCategoryIcon(type: NotificationType, category: NotificationCategory): React.ElementType {
  const key = category === 'all' ? type : category;
  return CATEGORY_ICONS[key] || Info;
}

export function NotificationPanel() {
  const apiNotifications = useNotifications().items;
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');

  const notifications = useMemo<Notification[]>(
    () =>
      apiNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: (n.type as NotificationType) || 'info',
        category: (n.type as NotificationCategory) || 'info',
        read: readOverrides[n.id] ?? n.isRead,
        time: n.createdAt,
      })),
    [apiNotifications, readOverrides],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    if (unreadCount === 0) return;
    const next: Record<string, boolean> = {};
    notifications.forEach((n) => {
      next[n.id] = true;
    });
    setReadOverrides(next);
    toast.success('All notifications marked as read');
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  }, [notifications, activeCategory]);

  // Group into "Today" (within 24h) and "Earlier"
  const todayNotifications = filtered.filter(n => {
    const diffHour = (Date.now() - new Date(n.time).getTime()) / (1000 * 60 * 60);
    return diffHour < 24;
  });
  const earlierNotifications = filtered.filter(n => {
    const diffHour = (Date.now() - new Date(n.time).getTime()) / (1000 * 60 * 60);
    return diffHour >= 24;
  });

  const hasNotifications = filtered.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <button
            className={cn(
              'text-xs text-primary hover:underline transition-colors',
              unreadCount === 0 && 'pointer-events-none opacity-40'
            )}
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 border-b px-4 py-2">
          {categoryPills.map(pill => (
            <button
              key={pill.value}
              onClick={() => setActiveCategory(pill.value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeCategory === pill.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-80">
          {!hasNotifications ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <BellOff className="h-8 w-8 opacity-40" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <div>
              {todayNotifications.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today</span>
                  </div>
                  {todayNotifications.map((notification, index) => {
                    const Icon = getCategoryIcon(notification.type, notification.category);
                    const styles = getCategoryStyle(notification.type, notification.category);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer',
                          notification.read && 'opacity-70',
                          !notification.read && 'bg-primary/5'
                        )}
                      >
                        {/* Left color indicator */}
                        <div className={cn('w-1 shrink-0 self-stretch rounded-full', styles.indicator)} />
                        {/* Category icon */}
                        <div className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          styles.iconBg, styles.iconText
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              'text-sm truncate font-medium',
                              notification.read && 'font-normal'
                            )}>{notification.title}</p>
                            {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{formatRelativeTime(notification.time)}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {earlierNotifications.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Earlier</span>
                  </div>
                  {earlierNotifications.map((notification) => {
                    const Icon = getCategoryIcon(notification.type, notification.category);
                    const styles = getCategoryStyle(notification.type, notification.category);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer',
                          notification.read && 'opacity-70',
                          !notification.read && 'bg-primary/5'
                        )}
                      >
                        {/* Left color indicator */}
                        <div className={cn('w-1 shrink-0 self-stretch rounded-full', styles.indicator)} />
                        {/* Category icon */}
                        <div className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          styles.iconBg, styles.iconText
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              'text-sm truncate font-medium',
                              notification.read && 'font-normal'
                            )}>{notification.title}</p>
                            {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{formatRelativeTime(notification.time)}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {hasNotifications && (
          <div className="border-t px-4 py-2.5 text-center">
            <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline transition-colors">
              View All Notifications
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
