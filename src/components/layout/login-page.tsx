'use client';

import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Store, UserCheck, ArrowRight, Zap, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const roles: { role: UserRole; title: string; description: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string; hoverBorder: string; iconBg: string }[] = [
  {
    role: 'super-admin',
    title: 'Super Admin',
    description: 'Manage tenants, subscriptions, and platform settings',
    icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-600',
    iconBg: 'bg-amber-100 dark:bg-amber-900/60',
  },
  {
    role: 'tenant-admin',
    title: 'Tenant Admin',
    description: 'Manage your shop, POS, inventory, and billing',
    icon: Store,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
  },
  {
    role: 'staff',
    title: 'Staff / Cashier',
    description: 'Access POS terminal and sales history',
    icon: UserCheck,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-200 dark:border-sky-800',
    hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-600',
    iconBg: 'bg-sky-100 dark:bg-sky-900/60',
  },
];

const features = [
  { icon: Zap, label: 'Fast POS' },
  { icon: Globe, label: 'Multi-Tenant' },
  { icon: Lock, label: 'Secure' },
];

export function LoginPage() {
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">POS Nepal</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Multi-tenant Point of Sale, Inventory & Billing System designed for Nepali businesses.
          </p>
          {/* Feature pills */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {features.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                <f.icon className="h-3 w-3" /> {f.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
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
                  {roles.map(({ role, title, description, icon: Icon, color, bgColor, borderColor, hoverBorder, iconBg }, i) => (
                    <motion.button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      className={cn(
                        'relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 text-center transition-all duration-200 hover:shadow-md',
                        selectedRole === role
                          ? `${borderColor} ${bgColor} shadow-md ring-1 ring-primary/20`
                          : cn('border-border hover:border-primary/30', hoverBorder)
                      )}
                    >
                      {selectedRole === role && (
                        <motion.div
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >✓</motion.div>
                      )}
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
                        <Icon className={cn('h-6 w-6', color)} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  className="w-full h-11 text-sm font-semibold gap-2"
                  size="lg"
                  disabled={!selectedRole}
                  onClick={() => selectedRole && login(selectedRole)}
                >
                  Sign In as {selectedRole ? roles.find(r => r.role === selectedRole)?.title : '...'}
                  {selectedRole && <ArrowRight className="h-4 w-4" />}
                </Button>
                {selectedRole && (
                  <p className="text-center text-[11px] text-muted-foreground">Press Enter to sign in</p>
                )}
              </motion.div>

              <p className="text-center text-[11px] text-muted-foreground">
                This is a UI prototype with mock data. No real authentication.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          © 2025 POS Nepal · Multi-Tenant SaaS Platform
        </motion.p>
      </div>
    </div>
  );
}
