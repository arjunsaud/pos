'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, BellOff, Package, CreditCard, AlertTriangle, Users, ShoppingBag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';


type NotificationCategory = 'all' | 'order' | 'system' | 'alert';

type NotificationType = 'order' | 'system' | 'alert' | 'payment' | 'warning' | 'info' | 'success';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  read: boolean;
  time: string;
  icon: React.ElementType;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'Surf Excel (1kg) is below minimum stock level (3/5)', type: 'alert', category: 'alert', read: false, time: '2024-06-15T10:30:00', icon: AlertTriangle },
  { id: '2', title: 'New Order #1042', message: 'Ram Kumar placed an order for NPR 3,450', type: 'order', category: 'order', read: false, time: '2024-06-15T09:15:00', icon: ShoppingBag },
  { id: '3', title: 'Payment Received', message: 'NPR 7,999 from Biratnagar Hardware', type: 'payment', category: 'order', read: false, time: '2024-06-15T08:00:00', icon: CreditCard },
  { id: '4', title: 'Stock Depleted', message: 'Frozen Chicken (1kg) is out of stock', type: 'alert', category: 'alert', read: true, time: '2024-06-14T16:00:00', icon: Package },
  { id: '5', title: 'New Tenant Signup', message: 'Chitwan Fresh registered for Basic plan', type: 'system', category: 'system', read: true, time: '2024-06-14T14:00:00', icon: Users },
  { id: '6', title: 'System Update', message: 'Platform updated to v2.4.1 successfully', type: 'system', category: 'system', read: true, time: '784 days ago', icon: Settings },
];

const categoryPills: { label: string; value: NotificationCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Orders', value: 'order' },
  { label: 'System', value: 'system' },
  { label: 'Alerts', value: 'alert' },
];

function getTypeColor(type: NotificationType) {
  switch (type) {
    case 'order':
    case 'payment':
      return {
        border: 'border-l-emerald-500 dark:border-l-emerald-400',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'system':
    case 'info':
    case 'success':
      return {
        border: 'border-l-blue-500 dark:border-l-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
      };
    case 'alert':
    case 'warning':
      return {
        border: 'border-l-amber-500 dark:border-l-amber-400',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
      };
    default:
      return {
        border: 'border-l-gray-500 dark:border-l-gray-400',
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-600 dark:text-gray-400',
      };
  }
}

function isEarlier(time: string): boolean {
  return /\d{3,}\s+days?\s+ago/.test(time);
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const todayNotifications = filtered.filter(n => !isEarlier(n.time));
  const earlierNotifications = filtered.filter(n => isEarlier(n.time));

  const hasNotifications = filtered.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" className={cn(
            'h-auto p-0 text-xs transition-opacity',
            unreadCount > 0 ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground/50 cursor-default'
          )} onClick={unreadCount > 0 ? markAllRead : undefined}>
            Mark all read
          </Button>
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
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div>
              {todayNotifications.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today</span>
                  </div>
                  <div className="divide-y">
                    {todayNotifications.map((notification) => {
                      const Icon = notification.icon;
                      const colors = getTypeColor(notification.type);
                      return (
                        <button
                          key={notification.id}
                          className={cn(
                            'flex w-full items-start gap-3 border-l-[3px] pl-3 pr-4 py-3 text-left transition-all hover:bg-muted/50',
                            colors.border,
                            !notification.read && 'bg-primary/5'
                          )}
                        >
                          <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', colors.bg, colors.text)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn('text-sm truncate', !notification.read && 'font-semibold')}>{notification.title}</p>
                              {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {earlierNotifications.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Earlier</span>
                  </div>
                  <div className="divide-y">
                    {earlierNotifications.map((notification) => {
                      const Icon = notification.icon;
                      const colors = getTypeColor(notification.type);
                      return (
                        <button
                          key={notification.id}
                          className={cn(
                            'flex w-full items-start gap-3 border-l-[3px] pl-3 pr-4 py-3 text-left transition-all hover:bg-muted/50',
                            colors.border,
                            !notification.read && 'bg-primary/5'
                          )}
                        >
                          <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', colors.bg, colors.text)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn('text-sm truncate', !notification.read && 'font-semibold')}>{notification.title}</p>
                              {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
