'use client';

import { useMemo } from 'react';
import { Store, CreditCard, Check, ArrowRight, Star } from 'lucide-react';
import { nprFull, formatDate, getStatusBadgeClasses, getPlanBadgeClasses } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { useTenantSelectorStore } from '@/features/auth/store';
import { mockTenants, mockSubscriptions, mockPlans } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

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

export default function SATenantSubscription() {
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);
  const tenant = mockTenants.find(t => t.id === selectedTenantId);

  const activeSub = useMemo(
    () => mockSubscriptions.find(s => s.tenantId === tenant?.id && s.status === 'active'),
    [tenant?.id]
  );

  const subHistory = useMemo(
    () => mockSubscriptions.filter(s => s.tenantId === tenant?.id),
    [tenant?.id]
  );

  const activePlan = useMemo(
    () => activeSub ? mockPlans.find(p => p.name === activeSub.planName) : null,
    [activeSub]
  );

  if (!tenant) return <NoTenantSelected />;

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription" description="Subscription and plan details for this tenant" />
      <TenantBanner name={tenant.name} />

      {/* Current Subscription Card */}
      {activeSub && activePlan ? (
        <Card className="transition-shadow hover:shadow-md border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <Badge className={cn('mt-1 capitalize', getPlanBadgeClasses(activeSub.planName))}>
                  {activeSub.planName}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{nprFull(activeSub.amount)} <span className="text-sm font-normal text-muted-foreground">/{activePlan.interval}</span></p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={getStatusBadgeClasses(activeSub.status)}>{activeSub.status.charAt(0).toUpperCase() + activeSub.status.slice(1)}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(activeSub.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(activeSub.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Auto-Renew</p>
                <Badge className={activeSub.autoRenew ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
                  {activeSub.autoRenew ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Plan Features</p>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {activePlan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Active Subscription</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">This tenant does not have an active subscription.</p>
            <Button>
              <ArrowRight className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Plan Comparison</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockPlans.map(plan => {
            const isCurrentPlan = activeSub?.planName === plan.name;
            return (
              <Card key={plan.id} className={cn('transition-shadow hover:shadow-md relative', isCurrentPlan && 'border-primary ring-2 ring-primary/20')}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" /> Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg capitalize">{plan.name}</CardTitle>
                  <div>
                    <span className="text-3xl font-bold">{nprFull(plan.price)}</span>
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {isCurrentPlan && (
                    <Badge className="mt-4 w-full justify-center bg-primary text-primary-foreground">Current Plan</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Subscription History */}
      {subHistory.length > 0 && (
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subscription History</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Start</TableHead>
                    <TableHead className="hidden sm:table-cell">End</TableHead>
                    <TableHead className="hidden md:table-cell">Auto-Renew</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subHistory.map(sub => (
                    <TableRow key={sub.id} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        <Badge className={cn('capitalize', getPlanBadgeClasses(sub.planName))}>{sub.planName}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{nprFull(sub.amount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClasses(sub.status)}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(sub.startDate)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(sub.endDate)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={sub.autoRenew ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
                          {sub.autoRenew ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
