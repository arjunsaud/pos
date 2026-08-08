'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, Crown } from 'lucide-react';
import { mockPlans, mockTenantStats } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);

export default function TenantSubscriptionPage() {
  const currentPlanName = 'pro';
  const currentPlan = mockPlans.find((p) => p.name === currentPlanName)!;
  const renewalDate = '2024-07-15';

  return (
    <div className='space-y-6'>
      <PageHeader title='Subscription' description='Manage your subscription plan' />

      {/* Current Plan Card */}
      <Card className='border-primary'>
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
          return (
            <Card
              key={plan.id}
              className={cn(
                isCurrent && 'border-primary shadow-lg scale-[1.02]',
                isPopular && !isCurrent && 'border-primary/30'
              )}
            >
              <CardHeader className='text-center'>
                {isPopular && (
                  <div className='flex justify-center'>
                    <Badge className='mb-2'>Popular</Badge>
                  </div>
                )}
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
                  {plan.features.map((f) => (
                    <div key={f} className='flex items-center gap-2 text-sm'>
                      <Check className='h-4 w-4 shrink-0 text-emerald-600' />
                      {f}
                    </div>
                  ))}
                </div>
                <Separator />
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
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Products</span>
              <span className='text-muted-foreground'>245 / 500</span>
            </div>
            <Progress value={(245 / 500) * 100} />
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Staff</span>
              <span className='text-muted-foreground'>3 / 5</span>
            </div>
            <Progress value={(3 / 5) * 100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
