'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavStore, useAuthStore } from '@/features/auth/store';
import {
  LayoutDashboard, Users, CreditCard, Activity, FileText, Settings,
  ShoppingCart, Receipt, Package, Warehouse, Tags, BarChart3,
  UserCog, Store, Search, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavSection, UserRole } from '@/lib/types';

interface CommandItem {
  label: string;
  section: NavSection;
  icon: LucideIcon;
  group: string;
}

function buildCommands(role: UserRole): CommandItem[] {
  const all: Record<string, CommandItem[]> = {
    'super-admin': [
      { label: 'Go to Dashboard', section: 'super-admin-dashboard', icon: LayoutDashboard, group: 'Navigation' },
      { label: 'Go to Tenants', section: 'tenants', icon: Store, group: 'Navigation' },
      { label: 'Go to Staff', section: 'super-admin-staff', icon: UserCog, group: 'Navigation' },
      { label: 'Go to Subscriptions', section: 'super-admin-subscriptions', icon: CreditCard, group: 'Navigation' },
      { label: 'Go to Activity Logs', section: 'activity-logs', icon: Activity, group: 'Navigation' },
      { label: 'Go to Content & Social', section: 'content', icon: FileText, group: 'Navigation' },
      { label: 'Go to Settings', section: 'super-admin-settings', icon: Settings, group: 'Navigation' },
    ],
    'tenant-admin': [
      { label: 'Go to Dashboard', section: 'tenant-dashboard', icon: LayoutDashboard, group: 'Navigation' },
      { label: 'Go to POS Terminal', section: 'pos', icon: ShoppingCart, group: 'Quick Actions' },
      { label: 'Go to Billing', section: 'billing', icon: Receipt, group: 'Navigation' },
      { label: 'Go to Products', section: 'products', icon: Package, group: 'Navigation' },
      { label: 'Go to Inventory', section: 'inventory', icon: Warehouse, group: 'Navigation' },
      { label: 'Go to Categories', section: 'categories', icon: Tags, group: 'Navigation' },
      { label: 'Go to Sales', section: 'sales', icon: BarChart3, group: 'Navigation' },
      { label: 'Go to Reports', section: 'reports', icon: BarChart3, group: 'Navigation' },
      { label: 'Go to Subscription', section: 'tenant-subscription', icon: CreditCard, group: 'Navigation' },
      { label: 'Go to Staff', section: 'tenant-staff', icon: UserCog, group: 'Navigation' },
    ],
    'staff': [
      { label: 'Go to POS Terminal', section: 'pos', icon: ShoppingCart, group: 'Quick Actions' },
      { label: 'Go to Sales History', section: 'sales', icon: BarChart3, group: 'Navigation' },
    ],
  };
  return all[role] || [];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user } = useAuthStore();
  const { currentSection, setCurrentSection } = useNavStore();

  const commands = user ? buildCommands(user.role) : [];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  // Group filtered results
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  const navigate = useCallback((section: NavSection) => {
    setCurrentSection(section);
    setOpen(false);
    setQuery('');
  }, [setCurrentSection]);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  if (!user) return null;

  return (
    <>
      {/* Trigger button in sidebar bottom or can be triggered by Cmd+K */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        Search...
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">⌘K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="ml-2 shrink-0 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">ESC</kbd>
          </div>
          <ScrollArea className="max-h-72 p-2">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-2">
                  <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </p>
                  {items.map((item) => {
                    const isActive = currentSection === item.section;
                    return (
                      <button
                        key={item.section}
                        onClick={() => navigate(item.section)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground hover:bg-accent/50'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && (
                          <span className="text-[10px] font-medium text-muted-foreground">Current</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </ScrollArea>
          <div className="border-t px-4 py-2 text-[10px] text-muted-foreground">
            Navigate with <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> and press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px]">Enter</kbd>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
