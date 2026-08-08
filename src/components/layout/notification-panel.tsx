'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, CreditCard, AlertTriangle, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/helpers';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
  time: string;
  icon: React.ElementType;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'Surf Excel (1kg) is below minimum stock level (3/5)', type: 'warning', read: false, time: '2024-06-15T10:30:00', icon: AlertTriangle },
  { id: '2', title: 'New Subscription', message: 'Lalitpur Fashion upgraded to Pro plan', type: 'info', read: false, time: '2024-06-15T09:15:00', icon: CreditCard },
  { id: '3', title: 'Payment Received', message: 'NPR 7,999 from Biratnagar Hardware', type: 'success', read: false, time: '2024-06-15T08:00:00', icon: CreditCard },
  { id: '4', title: 'Low Stock Alert', message: 'Frozen Chicken (1kg) is out of stock', type: 'warning', read: true, time: '2024-06-14T16:00:00', icon: Package },
  { id: '5', title: 'New Tenant Signup', message: 'Chitwan Fresh registered for Basic plan', type: 'info', read: true, time: '2024-06-14T14:00:00', icon: Users },
  { id: '6', title: 'System Update', message: 'Platform updated to v2.4.1 successfully', type: 'success', read: true, time: '2024-06-13T02:00:00', icon: Check },
];

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const typeColors = {
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

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
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <button
                  key={notification.id}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeColors[notification.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-sm truncate', !notification.read && 'font-semibold')}>{notification.title}</p>
                      {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatRelativeTime(notification.time)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
