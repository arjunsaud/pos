'use client';

import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Store, UserCheck, ArrowRight, Zap, Globe, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const roles: { role: UserRole; title: string; description: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string; hoverBorder: string; iconBg: string; gradientFrom: string; gradientTo: string }[] = [
  {
    role: 'super-admin',
    title: 'Super Admin',
    description: 'Manage tenants, subscriptions, and platform settings',
    icon: Shield,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    iconBg: 'bg-purple-100/80 dark:bg-purple-900/40',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-violet-500',
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
    iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
  },
  {
    role: 'staff',
    title: 'Staff / Cashier',
    description: 'Access POS terminal and sales history',
    icon: UserCheck,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-600',
    iconBg: 'bg-amber-100/80 dark:bg-amber-900/40',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-500',
  },
];

const features: { icon: React.ElementType; label: string; borderColor: string }[] = [
  { icon: Zap, label: 'Fast POS', borderColor: 'border-emerald-300 dark:border-emerald-700' },
  { icon: Globe, label: 'Multi-Tenant', borderColor: 'border-blue-300 dark:border-blue-700' },
  { icon: Lock, label: 'Secure', borderColor: 'border-amber-300 dark:border-amber-700' },
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
          {/* Animated gradient line below heading */}
          <motion.div
            className="mx-auto h-[2px] w-24 rounded-full bg-gradient-to-r from-purple-500 via-emerald-500 to-amber-500"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Multi-tenant Point of Sale, Inventory & Billing System designed for Nepali businesses.
          </p>
          {/* Feature pills with slide-up animation and colored borders */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {features.map((f, i) => (
              <motion.span
                key={f.label}
                className={cn('inline-flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground', f.borderColor)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
              >
                <f.icon className="h-3 w-3" /> {f.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="border-0 shadow-xl relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
            <CardHeader className="text-center pb-4 relative">
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1.5">
                Select your role to explore the system
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />\n                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Demo Mode</span>
              </CardDescription>
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
                  {roles.map(({ role, title, description, icon: Icon, color, bgColor, borderColor, hoverBorder, iconBg, gradientFrom, gradientTo }, i) => (
                    <motion.button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 pt-6 text-center transition-all duration-200 hover:shadow-lg',
                        selectedRole === role
                          ? `${borderColor} ${bgColor} shadow-lg ring-1 ring-primary/20`
                          : cn('border-border hover:border-primary/30', hoverBorder)
                      )}
                    >
                      {/* Gradient top border */}
                      <div className={cn('absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r', gradientFrom, gradientTo, selectedRole === role ? 'opacity-100' : 'opacity-60')} />
                      {/* Animated checkmark - left side */}
                      <div className="absolute left-2 top-2">
                        {selectedRole === role ? (
                          <motion.div
                            className={cn('flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r', gradientFrom, gradientTo, 'text-white shadow-sm')}
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20" />
                        )}
                      </div>
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
                  className={cn(
                    'w-full h-11 text-sm font-semibold gap-2 transition-all duration-200',
                    'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20',
                    !selectedRole && 'opacity-50 cursor-not-allowed'
                  )}
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

              <p className="text-center text-[11px] text-muted-foreground relative">
                This is a UI prototype with mock data. No real authentication.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-center text-xs text-muted-foreground">
            © 2025 POS Nepal · Multi-Tenant SaaS Platform
          </p>
          <p className="text-center text-[10px] text-muted-foreground/60">
            Built with Next.js, Tailwind CSS & ShadCN UI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
