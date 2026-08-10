'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  AlertTriangle,
  XCircle,
  Clock,
  CreditCard,
  PackageCheck,
  ArrowLeftRight,
  Banknote,
  Info,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mock-data';
import type { AppNotification, NotificationType, NotificationPriority } from '@/lib/types';
import { useNavStore } from '@/features/auth/store';
import { toast } from 'sonner';

// ---------- Tab type ----------

type TabValue = 'all' | 'unread' | 'critical' | 'low_stock' | 'expiry' | 'system';

// ---------- Icon map ----------

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  low_stock: AlertTriangle,
  out_of_stock: XCircle,
  expiry_alert: Clock,
  payment_reminder: CreditCard,
  purchase_received: PackageCheck,
  transfer_completed: ArrowLeftRight,
  credit_due: Banknote,
  system: Info,
};

const TYPE_LABELS: Record<NotificationType, string> = {
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  expiry_alert: 'Expiry',
  payment_reminder: 'Payment',
  purchase_received: 'Purchase',
  transfer_completed: 'Transfer',
  credit_due: 'Credit Due',
  system: 'System',
};

const TYPE_ICON_COLORS: Record<NotificationType, { bg: string; text: string }> = {
  low_stock: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  out_of_stock: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  expiry_alert: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  payment_reminder: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  purchase_received: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  transfer_completed: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400' },
  credit_due: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  system: { bg: 'bg-gray-100 dark:bg-gray-800/40', text: 'text-gray-600 dark:text-gray-400' },
};

// ---------- Priority border colors ----------

const PRIORITY_BORDER: Record<NotificationPriority, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-amber-500',
  medium: 'border-l-blue-500',
  low: 'border-l-gray-400',
};

// ---------- Helpers ----------

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay} days ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

// ---------- Component ----------

export default function NotificationsPage() {
  const { setCurrentSection } = useNavStore();
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  // ---------- Derived stats ----------

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  const todayCount = useMemo(() => notifications.filter(n => isToday(n.createdAt)).length, [notifications]);
  const criticalCount = useMemo(() => notifications.filter(n => n.priority === 'critical').length, [notifications]);

  // ---------- Filtered list ----------

  const filtered = useMemo(() => {
    let result = notifications;

    switch (activeTab) {
      case 'unread':
        result = result.filter(n => !n.isRead);
        break;
      case 'critical':
        result = result.filter(n => n.priority === 'critical');
        break;
      case 'low_stock':
        result = result.filter(n => n.type === 'low_stock' || n.type === 'out_of_stock');
        break;
      case 'expiry':
        result = result.filter(n => n.type === 'expiry_alert');
        break;
      case 'system':
        result = result.filter(n => n.type === 'system');
        break;
    }

    // Sort newest first
    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, activeTab]);

  // ---------- Actions ----------

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id && !n.isRead ? { ...n, isRead: true } : n))
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) {
      toast.info('No unread notifications');
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success(`${unread.length} notification${unread.length > 1 ? 's' : ''} marked as read`);
  };

  const deleteAllRead = () => {
    const readCount = notifications.filter(n => n.isRead).length;
    if (readCount === 0) {
      toast.info('No read notifications to delete');
      return;
    }
    setNotifications(prev => prev.filter(n => !n.isRead));
    toast.success(`${readCount} read notification${readCount > 1 ? 's' : ''} deleted`);
  };

  const handleAction = (notification: AppNotification) => {
    if (notification.actionUrl) {
      setCurrentSection(notification.actionUrl as 'inventory' | 'customers' | 'purchases' | 'stock-transfer' | 'tenant-subscription');
    }
  };

  // ---------- Tab counts ----------

  const tabCounts: Record<TabValue, number> = {
    all: notifications.length,
    unread: unreadCount,
    critical: criticalCount,
    low_stock: notifications.filter(n => n.type === 'low_stock' || n.type === 'out_of_stock').length,
    expiry: notifications.filter(n => n.type === 'expiry_alert').length,
    system: notifications.filter(n => n.type === 'system').length,
  };

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications & Alerts" description="Stay updated with your store activity and system alerts">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={deleteAllRead} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Read
          </Button>
        </div>
      </PageHeader>

      {/* ---------- Summary Row ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayCount}</p>
              <p className="text-xs text-muted-foreground">Today&apos;s Notifications</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Tabs ---------- */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabValue)}>
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0">
          {([
            { value: 'all' as TabValue, label: 'All' },
            { value: 'unread' as TabValue, label: 'Unread' },
            { value: 'critical' as TabValue, label: 'Critical' },
            { value: 'low_stock' as TabValue, label: 'Low Stock' },
            { value: 'expiry' as TabValue, label: 'Expiry' },
            { value: 'system' as TabValue, label: 'System' },
          ]).map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-3 py-1.5 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground gap-1.5 transition-colors"
            >
              {tab.label}
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none data-[state=active]:bg-primary-foreground/20 data-[state=inactive]:bg-muted-foreground/15">
                {tabCounts[tab.value]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------- Notification List ---------- */}
        <div className="mt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
              <BellOff className="h-12 w-12 opacity-30" />
              <div className="text-center">
                <p className="text-sm font-medium">No notifications found</p>
                <p className="text-xs mt-1">
                  {activeTab === 'all'
                    ? "You're all caught up!"
                    : `No ${activeTab.replace('_', ' ')} notifications to show`}
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-2 pr-4">
                {filtered.map(notification => {
                  const Icon = TYPE_ICONS[notification.type];
                  const iconStyle = TYPE_ICON_COLORS[notification.type];
                  const borderClass = PRIORITY_BORDER[notification.priority];

                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        'border-l-4 transition-all duration-150 hover:shadow-md',
                        borderClass,
                        !notification.isRead ? 'bg-primary/[0.02]' : 'opacity-85 hover:opacity-100'
                      )}
                    >
                      <CardContent className="flex items-start gap-3 p-4">
                        {/* Type icon */}
                        <div
                          className={cn(
                            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            iconStyle.bg,
                            iconStyle.text
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Unread blue dot */}
                              {!notification.isRead && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
                              )}
                              <h3
                                className={cn(
                                  'text-sm leading-snug truncate',
                                  !notification.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
                                )}
                              >
                                {notification.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-1.5 py-0 font-medium capitalize',
                                  notification.priority === 'critical' && 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400',
                                  notification.priority === 'high' && 'border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400',
                                  notification.priority === 'medium' && 'border-blue-300 text-blue-600 dark:border-blue-800 dark:text-blue-400',
                                  notification.priority === 'low' && 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'
                                )}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] text-muted-foreground/80">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium gap-1">
                                {TYPE_LABELS[notification.type]}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-1">
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 text-xs text-primary hover:text-primary"
                                  onClick={() => handleAction(notification)}
                                >
                                  View
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              )}
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCheck className="h-3 w-3" />
                                  Mark Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </Tabs>
    </div>
  );
}
