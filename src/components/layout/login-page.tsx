'use client';

import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Store, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roles: { role: UserRole; title: string; description: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string }[] = [
  {
    role: 'super-admin',
    title: 'Super Admin',
    description: 'Manage tenants, subscriptions, and platform settings',
    icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    role: 'tenant-admin',
    title: 'Tenant Admin',
    description: 'Manage your shop, POS, inventory, and billing',
    icon: Store,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    role: 'staff',
    title: 'Staff / Cashier',
    description: 'Access POS terminal and sales history',
    icon: UserCheck,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-200 dark:border-sky-800',
  },
];

export function LoginPage() {
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">POS Nepal</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Multi-tenant Point of Sale, Inventory & Billing System for Nepali businesses.
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Select your role to explore the system (demo mode)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@posnepal.com" defaultValue="admin@posnepal.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="password" />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Role (Demo)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map(({ role, title, description, icon: Icon, color, bgColor, borderColor }) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:shadow-md',
                      selectedRole === role
                        ? `${borderColor} ${bgColor} shadow-md`
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    {selectedRole === role && (
                      <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">✓</div>
                    )}
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bgColor)}>
                      <Icon className={cn('h-5 w-5', color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-11 text-sm font-semibold"
              size="lg"
              disabled={!selectedRole}
              onClick={() => selectedRole && login(selectedRole)}
            >
              Sign In as {selectedRole ? roles.find(r => r.role === selectedRole)?.title : '...'}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              This is a UI prototype with mock data. No real authentication.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2024 POS Nepal · Multi-Tenant SaaS Platform
        </p>
      </div>
    </div>
  );
}
