'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Crown, X, RefreshCw, Calendar } from 'lucide-react';
import { mockPlans, mockProducts, mockTenantStaff } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { npr } from '@/lib/helpers';

// Shared feature comparison matrix: feature name → included in plan names
const allFeatures = [
  'POS System',
  'Basic Reports',
  'Email Support',
  'Up to 100 Products',
  '1 Staff Account',
  'Advanced Reports',
  'Priority Support',
  'Up to 500 Products',
  '5 Staff Accounts',
  'Inventory Management',
  'Billing & Invoicing',
  'Unlimited Products',
  'Unlimited Staff',
  'Custom Reports',
  '24/7 Support',
  'API Access',
  'Custom Domain',
  'Multi-Branch Support',
];

const featureAvailability: Record<string, string[]> = {
  basic: [
    'POS System', 'Basic Reports', 'Email Support', 'Up to 100 Products', '1 Staff Account',
  ],
  pro: [
    'POS System', 'Basic Reports', 'Email Support', 'Up to 500 Products', '5 Staff Accounts',
    'Advanced Reports', 'Priority Support', 'Inventory Management', 'Billing & Invoicing',
  ],
  enterprise: allFeatures,
};

export default function TenantSubscriptionPage() {
  const currentPlanName = 'pro';
  const currentPlan = mockPlans.find((p) => p.name === currentPlanName)!;
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  const renewalDate = now.toISOString().slice(0, 10);

  const productUsage = mockProducts.length;
  const productLimit = currentPlan.maxProducts;
  const staffUsage = mockTenantStaff.length;
  const staffLimit = currentPlan.maxStaff;

  return (
    <div className='space-y-6'>
      <PageHeader title='Subscription' description='Manage your subscription plan' />

      {/* Current Plan Card */}
      <Card className='border-primary transition-shadow hover:shadow-md'>
        <CardContent className='p-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Crown className='h-6 w-6 text-primary' />
                <h2 className='text-xl font-bold'>{currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1)} Plan</h2>
                <Badge>Current</Badge>
              </div>
              <p className='text-3xl font-bold'>
                NPR {npr(currentPlan.price)}
                <span className='text-base font-normal text-muted-foreground'>/{currentPlan.interval}</span>
              </p>
              <p className='text-sm text-muted-foreground'>
                Renews on {new Date(renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className='space-y-1'>
              {currentPlan.features.map((feature) => (
                <div key={feature} className='flex items-center gap-2 text-sm'>
                  <Check className='h-4 w-4 text-emerald-600' />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className='grid gap-6 md:grid-cols-3'>
        {mockPlans.map((plan) => {
          const isCurrent = plan.name === currentPlanName;
          const isPopular = plan.popular;
          const planFeatures = featureAvailability[plan.name] || [];
          return (
            <Card
              key={plan.id}
              className={cn(
                'transition-shadow hover:shadow-md',
                isCurrent && 'border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20',
                isPopular && !isCurrent && 'border-primary/30'
              )}
            >
              <CardHeader className='text-center'>
                <div className='flex items-center justify-center gap-2'>
                  {isPopular && <Badge className='mb-0'>Popular</Badge>}
                  {isCurrent && <Badge variant="secondary" className="mb-0 bg-primary/10 text-primary border-primary/20">Current Plan</Badge>}
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
                <div className='space-y-2'>
                  {allFeatures.map((f) => {
                    const included = planFeatures.includes(f);
                    return (
                      <div key={f} className='flex items-center gap-2 text-sm'>
                        {included ? (
                          <Check className='h-4 w-4 shrink-0 text-emerald-600' />
                        ) : (
                          <X className='h-4 w-4 shrink-0 text-muted-foreground/40' />
                        )}
                        <span className={cn(!included && 'text-muted-foreground/50')}>{f}</span>
                      </div>
                    );
                  })}
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
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className='w-full'
                    variant={plan.price > currentPlan.price ? 'default' : 'outline'}
                    onClick={() =>
                      toast.success(
                        `Plan change request submitted to ${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}`
                      )
                    }
                  >
                    {plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Stats */}
      <Card className='transition-shadow hover:shadow-md'>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Products</span>
              <span className='text-muted-foreground'>{productUsage} / {productLimit} ({Math.round((productUsage / productLimit) * 100)}%)</span>
            </div>
            <div className='h-2 w-full rounded-full bg-muted'>
              <div
                className='h-2 rounded-full bg-primary transition-all'
                style={{ width: `${(productUsage / productLimit) * 100}%` }}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Staff</span>
              <span className='text-muted-foreground'>{staffUsage} / {staffLimit} ({Math.round((staffUsage / staffLimit) * 100)}%)</span>
            </div>
            <div className='h-2 w-full rounded-full bg-muted'>
              <div
                className='h-2 rounded-full bg-primary transition-all'
                style={{ width: `${(staffUsage / staffLimit) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
                  Your <span className='font-medium text-foreground'>{currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1)} Plan</span> renews on{' '}
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
