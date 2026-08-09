'use client';

import { useState, useMemo } from 'react';
import { Store, ShoppingCart, Warehouse, Receipt, BarChart3, Plug, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockTenantFeatures } from '@/lib/mock-data';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { TenantFeature } from '@/lib/types';

function TenantBanner({ name }: { name: string }) {
  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
      <Store className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">Viewing data for: <span className="font-bold text-primary">{name}</span></span>
    </div>
  );
}

function NoTenantSelected() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Store className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-semibold">No Tenant Selected</h3>
      <p className="mt-1 text-sm text-muted-foreground">Please select a tenant from the sidebar dropdown to view their data.</p>
    </div>
  );
}

const categoryConfig: Record<string, { label: string; description: string; icon: typeof ShoppingCart }> = {
  pos: { label: 'POS', description: 'Point of sale features', icon: ShoppingCart },
  inventory: { label: 'Inventory', description: 'Stock and inventory management', icon: Warehouse },
  billing: { label: 'Billing', description: 'Invoicing and payment features', icon: Receipt },
  reporting: { label: 'Reporting', description: 'Reports and analytics', icon: BarChart3 },
  integration: { label: 'Integration', description: 'Third-party integrations', icon: Plug },
  advanced: { label: 'Advanced', description: 'Advanced and premium features', icon: Sparkles },
};

const categoryOrder = ['pos', 'inventory', 'billing', 'reporting', 'integration', 'advanced'];

export default function SATenantFeatures() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const [features, setFeatures] = useState<Record<string, boolean>>(
    () => Object.fromEntries(mockTenantFeatures.map(f => [f.id, f.enabled]))
  );

  const grouped = useMemo(() => {
    const groups: Record<string, TenantFeature[]> = {};
    for (const cat of categoryOrder) {
      groups[cat] = mockTenantFeatures.filter(f => f.category === cat);
    }
    return groups;
  }, []);

  const summary = useMemo(() => {
    const all = mockTenantFeatures.length;
    const enabled = mockTenantFeatures.filter(f => features[f.id]).length;
    return { all, enabled, disabled: all - enabled };
  }, [features]);

  const handleToggle = (feature: TenantFeature) => {
    const newVal = !features[feature.id];
    setFeatures(prev => ({ ...prev, [feature.id]: newVal }));
    if (tenant) {
      toast.success(`Feature "${feature.label}" ${newVal ? 'enabled' : 'disabled'} for ${tenant.name}`);
    }
  };

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Features" description="Manage feature toggles for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Summary Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
              <ToggleLeft className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Features</p>
              <p className="text-2xl font-bold">{summary.all}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <ToggleRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enabled</p>
              <p className="text-2xl font-bold">{summary.enabled}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
              <ToggleLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disabled</p>
              <p className="text-2xl font-bold">{summary.disabled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {categoryOrder.map(cat => {
          const config = categoryConfig[cat];
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          const Icon = config.icon;
          return (
            <Card key={cat} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {config.label}
                  <span className="text-sm font-normal text-muted-foreground">— {config.description}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {items.map(feature => (
                    <div key={feature.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{feature.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                      </div>
                      <Switch
                        checked={features[feature.id] ?? feature.enabled}
                        onCheckedChange={() => handleToggle(feature)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
