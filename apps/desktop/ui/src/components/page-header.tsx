import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, subtitle, children }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
      <Separator className="mt-3" />
    </div>
  );
}
