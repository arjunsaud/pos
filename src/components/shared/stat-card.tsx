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
  trendColor?: 'positive' | 'negative' | 'neutral';
  borderColor?: string;
  className?: string;
  iconClassName?: string;
  iconColor?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, trendColor = 'neutral', borderColor, className, iconClassName, iconColor }: StatCardProps) {
  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] animate-card-shine',
      borderColor && `border-l-[3px] ${borderColor}`,
      className,
    )}>
      <div className="before:absolute before:inset-x-0 before:h-[2px] before:top-0 before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:rounded-t-lg" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110',
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
                'inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold',
                trendColor === 'positive' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                trendColor === 'negative' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                trendColor === 'neutral' && 'bg-muted text-muted-foreground',
              )}>
                {trendColor === 'positive' ? '+' : trendColor === 'negative' ? '-' : ''}{Math.abs(trend.value)}%
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
