'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconClassName?: string;
  iconColor?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className, iconClassName, iconColor }: StatCardProps) {
  return (
    <Card className={cn('group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
          iconClassName || 'bg-primary/10',
          iconColor && 'text-foreground'
        )}>
          <Icon className={cn('h-5 w-5', iconColor || 'text-primary')} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(trend || description) && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {trend && (
              <span className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                trend.value >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {trend && description && (
              <span className="ml-1.5">{description}</span>
            )}
            {!trend && description && description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-3 w-40 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-20 rounded bg-muted animate-pulse" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-8 w-full rounded bg-muted animate-pulse" style={{ maxWidth: `${50 + Math.random() * 50}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[250px] items-end gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted animate-pulse"
              style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
