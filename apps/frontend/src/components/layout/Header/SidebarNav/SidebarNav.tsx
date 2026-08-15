'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavItem } from '@/lib/types/interface/nav.interface';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SidebarNav({
  items,
  onNavigate,
}: {
  items: SidebarNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1 py-3">
      <nav className="space-y-1 px-3">
        {items.map((group, groupIdx) => (
          <div key={group.title}>
            <h4
              className={cn(
                'px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70',
                groupIdx > 0 ? 'mt-5 border-t border-border/50 pt-4' : 'mb-2',
              )}
            >
              {group.title}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const href = item.href ?? '#';
                const isActive =
                  href !== '/' &&
                  (pathname === href ||
                    (href !== '/dashboard' && pathname.startsWith(`${href}/`)) ||
                    (href.split('/').length > 3 && pathname === href));
                const Icon = item.icon;
                return (
                  <Link
                    key={href + item.title}
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      'relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground',
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-primary' : '',
                        )}
                      />
                    )}
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}
