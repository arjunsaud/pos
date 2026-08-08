'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { toast } from 'sonner';
import { mockPlans, mockTenants } from '@/lib/mock-data';
import type { PlanType, SubscriptionPlan } from '@/lib/types';
import { cn } from '@/lib/utils';

const nprFormatter = new Intl.NumberFormat('en-NP');

function PlanCard({ plan, isPro }: { plan: SubscriptionPlan; isPro: boolean }) {
  const planLabel = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);
  const currentPlan = plan.name === 'pro';
  const isBasic = plan.name === 'basic';

  const handleAction = () => {
    if (isBasic) {
      toast.info('Upgrade to Pro plan requested (mock)');
    } else if (plan.name === 'enterprise') {
      toast.info('Downgrade request submitted (mock)');
    }
  };

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        isPro && 'border-primary shadow-lg scale-[1.02]'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="gap-1">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-xl">{planLabel}</CardTitle>
        <CardDescription className="sr-only">{planLabel} plan details</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            NPR {nprFormatter.format(plan.price)}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="grid gap-2 text-sm">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-1 text-xs text-muted-foreground border-t pt-4">
          <p>Max Products: {plan.maxProducts >= 99999 ? 'Unlimited' : plan.maxProducts}</p>
          <p>Max Staff: {plan.maxStaff >= 99999 ? 'Unlimited' : plan.maxStaff}</p>
        </div>
        <Button
          className="w-full"
          variant={currentPlan ? 'outline' : 'default'}
          disabled={currentPlan}
          onClick={handleAction}
        >
          {currentPlan ? 'Current Plan' : isBasic ? 'Upgrade' : 'Downgrade'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionManagement() {
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [selectedTenantName, setSelectedTenantName] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [newPlan, setNewPlan] = useState<PlanType>('basic');
  const [tenantSubscriptions, setTenantSubscriptions] = useState(
    mockTenants.map((t) => ({
      id: t.id,
      name: t.name,
      plan: t.plan,
      status: t.status,
      monthlyRevenue: t.monthlyRevenue,
    }))
  );

  const openChangePlan = (tenantId: string, tenantName: string, currentPlan: PlanType) => {
    setSelectedTenantId(tenantId);
    setSelectedTenantName(tenantName);
    setNewPlan(currentPlan);
    setChangePlanOpen(true);
  };

  const handleChangePlan = () => {
    setTenantSubscriptions((prev) =>
      prev.map((t) =>
        t.id === selectedTenantId ? { ...t, plan: newPlan } : t
      )
    );
    toast.success(`Plan changed for ${selectedTenantName} (mock)`);
    setChangePlanOpen(false);
  };

  const planBadgeVariant: Record<PlanType, 'secondary' | 'default' | 'outline'> = {
    basic: 'secondary',
    pro: 'default',
    enterprise: 'outline',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Manage pricing plans and tenant subscriptions"
      />

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {mockPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPro={plan.name === 'pro'}
          />
        ))}
      </div>

      {/* Tenant Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Monthly Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <Badge variant={planBadgeVariant[sub.plan]}>
                      {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'border-transparent',
                        sub.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    NPR {nprFormatter.format(sub.monthlyRevenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openChangePlan(sub.id, sub.name, sub.plan)}
                    >
                      Change Plan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Update the subscription plan for {selectedTenantName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Select New Plan</label>
            <Select value={newPlan} onValueChange={(v: PlanType) => setNewPlan(v)}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic - NPR {nprFormatter.format(999)}/mo</SelectItem>
                <SelectItem value="pro">Pro - NPR {nprFormatter.format(2999)}/mo</SelectItem>
                <SelectItem value="enterprise">Enterprise - NPR {nprFormatter.format(7999)}/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePlan}>Update Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
