'use client';

import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Renders below the title in muted text; hidden on very small screens */
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, subtitle, children }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 hidden text-xs sm:inline sm:text-sm text-muted-foreground">{subtitle}</p>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <Separator className="mt-3" />
    </div>
  );
}
