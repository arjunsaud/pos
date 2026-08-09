'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Check, Crown, X, RefreshCw, Calendar, Package, Users, HardDrive, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockPlans, mockProducts, mockTenantStaff } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { npr } from '@/lib/helpers';

const planColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  basic: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-700', accent: 'bg-amber-500' },
  pro: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700', accent: 'bg-blue-500' },
  enterprise: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700', accent: 'bg-purple-500' },
};

const planKeyFeatures: Record<string, string[]> = {
  basic: ['POS', 'Basic Reports', 'Email Support'],
  pro: ['Everything in Basic', 'Inventory Management', 'Billing & Invoicing', 'Priority Support'],
  enterprise: ['Everything in Pro', 'API Access', 'Custom Domain', 'Multi-Branch', '24/7 Support'],
};

function getUsageColor(pct: number) {
  if (pct > 90) return 'bg-red-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getUsageLabel(pct: number) {
  if (pct > 90) return 'text-red-600 dark:text-red-400';
  if (pct >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
}

export default function TenantSubscriptionPage() {
  const currentPlanName = 'pro';
  const currentPlan = mockPlans.find((p) => p.name === currentPlanName)!;
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  const renewalDate = now.toISOString().slice(0, 10);

  const productUsage = mockProducts.length;
  const productLimit = currentPlan.maxProducts;
  const productPct = Math.round((productUsage / productLimit) * 100);
  const staffUsage = mockTenantStaff.length;
  const staffLimit = currentPlan.maxStaff;
  const staffPct = Math.round((staffUsage / staffLimit) * 100);
  const storageUsed = 2.4;
  const storageLimit = 10;
  const storagePct = Math.round((storageUsed / storageLimit) * 100);

  const planInitial = currentPlanName.charAt(0).toUpperCase();
  const colors = planColors[currentPlanName];

  return (
    <div className='space-y-6'>
      <PageHeader title='Subscription' description='Manage your subscription plan' />

      {/* Current Plan Card */}
      <Card className={cn('border-primary transition-shadow hover:shadow-md relative overflow-hidden')}>
        {/* Shimmer overlay */}
        <div className='absolute inset-0 animate-card-shine pointer-events-none' />
        <CardContent className='p-6 relative'>
          <div className='flex flex-wrap items-start justify-between gap-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                {/* Plan icon circle */}
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full font-bold text-white', colors.accent)}>
                  {planInitial}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <Crown className='h-5 w-5 text-primary' />
                    <h2 className='text-xl font-bold'>{currentPlanName.charAt(0).toUpperCase() + currentPlanName.slice(1)} Plan</h2>
                    <Badge>Current</Badge>
                  </div>
                  <p className='text-2xl font-bold mt-1'>
                    NPR {npr(currentPlan.price)}
                    <span className='text-base font-normal text-muted-foreground'>/{currentPlan.interval}</span>
                  </p>
                </div>
              </div>
              {/* Next billing date with calendar icon */}
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span>Next billing: <span className='font-medium text-foreground'>{new Date(renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>
              </div>
            </div>
            <div className='flex-1 min-w-[280px] max-w-md space-y-4'>
              {/* Products usage progress */}
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <Package className='h-3.5 w-3.5 text-muted-foreground' />
                    <span className='font-medium'>Products</span>
                  </div>
                  <span className={cn('text-xs font-medium', getUsageLabel(productPct))}>{productUsage} of {productLimit} used</span>
                </div>
                <Progress value={productPct} className='h-2' />
              </div>
              {/* Staff usage progress */}
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <Users className='h-3.5 w-3.5 text-muted-foreground' />
                    <span className='font-medium'>Staff</span>
                  </div>
                  <span className={cn('text-xs font-medium', getUsageLabel(staffPct))}>{staffUsage} of {staffLimit} used</span>
                </div>
                <Progress value={staffPct} className='h-2' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats with Progress bars */}
      <Card className='transition-shadow hover:shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <HardDrive className='h-5 w-5' />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Products */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30'>
                  <Package className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <span className='font-medium'>Products</span>
                  <span className='text-xs text-muted-foreground ml-2'>{productUsage} / {productLimit}</span>
                </div>
              </div>
              <span className={cn('text-sm font-semibold', getUsageLabel(productPct))}>{productPct}%</span>
            </div>
            <div className='relative'>
              <div className='h-3 w-full rounded-full bg-muted'>
                <div
                  className={cn('h-3 rounded-full transition-all', getUsageColor(productPct))}
                  style={{ width: `${Math.min(productPct, 100)}%` }}
                />
              </div>
            </div>
          </div>
          {/* Staff */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                  <Users className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <span className='font-medium'>Staff Accounts</span>
                  <span className='text-xs text-muted-foreground ml-2'>{staffUsage} / {staffLimit}</span>
                </div>
              </div>
              <span className={cn('text-sm font-semibold', getUsageLabel(staffPct))}>{staffPct}%</span>
            </div>
            <div className='relative'>
              <div className='h-3 w-full rounded-full bg-muted'>
                <div
                  className={cn('h-3 rounded-full transition-all', getUsageColor(staffPct))}
                  style={{ width: `${Math.min(staffPct, 100)}%` }}
                />
              </div>
            </div>
          </div>
          {/* Storage */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                  <HardDrive className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <span className='font-medium'>Storage</span>
                  <span className='text-xs text-muted-foreground ml-2'>{storageUsed} / {storageLimit} GB</span>
                </div>
              </div>
              <span className={cn('text-sm font-semibold', getUsageLabel(storagePct))}>{storagePct}%</span>
            </div>
            <div className='relative'>
              <div className='h-3 w-full rounded-full bg-muted'>
                <div
                  className={cn('h-3 rounded-full transition-all', getUsageColor(storagePct))}
                  style={{ width: `${Math.min(storagePct, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compare Plans */}
      <div>
        <h3 className='text-lg font-semibold mb-4'>Compare Plans</h3>
        <div className='grid gap-6 md:grid-cols-3'>
          {mockPlans.map((plan) => {
            const isCurrent = plan.name === currentPlanName;
            const isPopular = plan.popular;
            const keyFeatures = planKeyFeatures[plan.name] || [];
            const pc = planColors[plan.name];
            const isUpgrade = plan.price > currentPlan.price;
            return (
              <Card
                key={plan.id}
                className={cn(
                  'transition-shadow hover:shadow-md relative',
                  isCurrent && 'border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20',
                  isPopular && !isCurrent && 'border-primary/30'
                )}
              >
                <CardHeader className='text-center'>
                  <div className='flex items-center justify-center gap-2 flex-wrap'>
                    {isPopular && <Badge className='mb-0'>Popular</Badge>}
                    {isCurrent && <Badge variant="secondary" className="mb-0 bg-primary/10 text-primary border-primary/20">Current Plan</Badge>}
                  </div>
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-full mx-auto font-bold text-white text-lg mt-2', pc.accent)}>
                    {plan.name.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className='text-xl'>
                    {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    <span className='text-3xl font-bold text-foreground'>NPR {npr(plan.price)}</span>
                    <span>/{plan.interval}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Key features bullet list */}
                  <div className='space-y-2'>
                    {keyFeatures.map((f) => (
                      <div key={f} className='flex items-center gap-2 text-sm'>
                        <Check className='h-4 w-4 shrink-0 text-emerald-600' />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  {/* Usage bars for current plan */}
                  {isCurrent && (
                    <>
                      <div className='space-y-1.5'>
                        <div className='flex items-center justify-between text-xs'>
                          <span className='font-medium'>Products</span>
                          <span className='text-muted-foreground'>{productUsage}/{productLimit}</span>
                        </div>
                        <div className='h-2 w-full rounded-full bg-muted'>
                          <div
                            className='h-2 rounded-full bg-primary transition-all'
                            style={{ width: `${Math.min((productUsage / productLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className='space-y-1.5'>
                        <div className='flex items-center justify-between text-xs'>
                          <span className='font-medium'>Staff</span>
                          <span className='text-muted-foreground'>{staffUsage}/{staffLimit}</span>
                        </div>
                        <div className='h-2 w-full rounded-full bg-muted'>
                          <div
                            className='h-2 rounded-full bg-primary transition-all'
                            style={{ width: `${Math.min((staffUsage / staffLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {!isCurrent && (
                    <>
                      <div className='flex justify-between text-sm text-muted-foreground'>
                        <span>Max Products</span>
                        <span className='font-medium text-foreground'>
                          {plan.maxProducts >= 99999 ? 'Unlimited' : npr(plan.maxProducts)}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm text-muted-foreground'>
                        <span>Max Staff</span>
                        <span className='font-medium text-foreground'>
                          {plan.maxStaff >= 99999 ? 'Unlimited' : plan.maxStaff}
                        </span>
                      </div>
                    </>
                  )}
                  {isCurrent ? (
                    <Button className='w-full' disabled>
                      <Star className='mr-2 h-4 w-4' />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className='w-full gap-2'
                      variant={isUpgrade ? 'default' : 'outline'}
                      onClick={() =>
                        toast.success(
                          `${isUpgrade ? 'Upgrade' : 'Downgrade'} request submitted to ${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}`
                        )
                      }
                    >
                      {isUpgrade ? <ArrowUpRight className='h-4 w-4' /> : <ArrowDownRight className='h-4 w-4' />}
                      {isUpgrade ? 'Upgrade' : 'Downgrade'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Renewal CTA */}
      <Card className='bg-primary/5 border-primary/20 transition-shadow hover:shadow-md'>
        <CardContent className='p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-primary/10 p-2'>
                <Calendar className='h-5 w-5 text-primary' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-semibold'>Renew Your Plan</h3>
                <p className='text-sm text-muted-foreground'>
                  Your <span className='font-medium text-foreground'>{currentPlanName.charAt(0).toUpperCase() + currentPlanName.slice(1)} Plan</span> renews on{' '}
                  <span className='font-medium text-foreground'>
                    {new Date(renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {' '}(NPR {npr(currentPlan.price)}/{currentPlan.interval}).
                </p>
              </div>
            </div>
            <Button
              onClick={() => toast.success('Renewal initiated. Your plan will be renewed for another month.')}
              className='shrink-0'
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Renew Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
