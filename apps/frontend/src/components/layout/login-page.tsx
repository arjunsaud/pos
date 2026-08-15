'use client';

import { isDesktopClient } from '@/lib/desktop';
import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Store, UserCheck, ArrowRight, Zap, Globe, Lock, Check, MoonStar, ArrowLeft, UserPlus, Crown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PATHS, homePath } from '@/lib/navigation/routes';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api';

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

interface LoginPageProps {
  onBack?: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const router = useRouter();
  const { login, register, completeTwoFactorLogin, hydrated, isAuthenticated, user } = useAuthStore();
  const desktop = isDesktopClient();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    desktop ? 'tenant-admin' : null,
  );
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState(desktop ? '' : 'admin@posnepal.com');
  const [password, setPassword] = useState(desktop ? '' : 'Test@123');
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const [challenge, setChallenge] = useState<{
    email: string;
    kind: 'admin' | 'user';
  } | null>(null);

  useEffect(() => {
    if (hydrated && isAuthenticated && user) {
      router.replace(homePath(user.role));
    }
  }, [hydrated, isAuthenticated, user, router]);
  const visibleRoles = desktop
    ? roles.filter((r) => r.role !== 'super-admin')
    : roles;

  const [regStore, setRegStore] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleError = (error: unknown) => {
    const message =
      error instanceof ApiError
        ? error.message
        : 'Unable to complete the request. Please try again.';
    toast.error(message);
  };

  const handleSignIn = async () => {
    if (!selectedRole || !email || !password) return;
    setSubmitting(true);
    try {
      const result = await login(email, password, selectedRole);
      if ('requiresTwoFactor' in result) {
        setChallenge({ email: result.email, kind: result.kind });
        toast.success('Enter the 2FA code sent to your email');
        return;
      }
      router.replace(homePath(result.role));
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!challenge || !otp) return;
    setSubmitting(true);
    try {
      const user = await completeTwoFactorLogin(challenge.email, otp, challenge.kind);
      router.replace(homePath(user.role));
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regStore || !regPassword) return;
    setSubmitting(true);
    try {
      const digits = regPhone.replace(/\D/g, '').slice(-10);
      const result = await register({
        fullName: regName,
        email: regEmail,
        password: regPassword,
        tenantName: regStore,
        mobileNumber: digits.length === 10 ? digits : undefined,
      });
      if ('requiresTwoFactor' in result) {
        toast.success('Enter the 2FA code sent to your email');
        return;
      }
      router.replace(homePath(result.role));
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl space-y-8 relative z-10">
        {/* Back Button */}
        {!desktop && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground -ml-2"
              onClick={() => (onBack ? onBack() : router.push(PATHS.home))}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn(
            'mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-shadow duration-300',
            isDark && 'shadow-[0_0_15px_rgba(99,102,241,0.3)]',
          )}>
            {isDark ? <MoonStar className="h-8 w-8" /> : <Store className="h-8 w-8" />}
          </div>
          <h1 className={cn(
            'text-4xl font-bold tracking-tight',
            isDark && 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',
          )}>POS Nepal</h1>
          {/* Animated gradient line below heading */}
          <motion.div
            className="mx-auto h-[2px] w-24 rounded-full bg-gradient-to-r from-purple-500 via-emerald-500 to-amber-500"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            {desktop
              ? 'Sign in as a tenant admin or staff to open your dashboard.'
              : 'Multi-tenant Point of Sale, Inventory & Billing System designed for Nepali businesses.'}
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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className={cn(
            'border-0 shadow-xl relative overflow-hidden',
            'dark:border-border/50 dark:bg-card/50 dark:backdrop-blur-sm',
          )}>
            {/* Subtle background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
            
            {/* Toggle: Sign In / Get Started */}
            {!desktop && (
            <div className="relative z-10 flex border-b">
              <button
                className={cn(
                  'flex-1 py-4 text-sm font-semibold transition-all duration-200 relative',
                  mode === 'signin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                )}
                onClick={() => setMode('signin')}
              >
                Sign In
                {mode === 'signin' && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                className={cn(
                  'flex-1 py-4 text-sm font-semibold transition-all duration-200 relative',
                  mode === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                )}
                onClick={() => setMode('register')}
              >
                <UserPlus className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                Get Started
                {mode === 'register' && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>
            )}

            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {/* ==================== SIGN IN VIEW ==================== */}
                {mode === 'signin' && (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <CardTitle className="text-xl">Welcome Back</CardTitle>
                      <CardDescription className="flex items-center justify-center gap-1.5 mt-1">
                        Sign in with your account credentials
                      </CardDescription>
                    </div>

                    {challenge ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          We sent a 2FA code to {challenge.email}.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="otp">Verification code</Label>
                          <Input
                            id="otp"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="6-digit code"
                          />
                        </div>
                        <Button
                          className="w-full"
                          disabled={submitting || otp.length < 4}
                          onClick={() => void handleVerifyOtp()}
                        >
                          {submitting ? 'Verifying…' : 'Verify and sign in'}
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => { setChallenge(null); setOtp(''); }}>
                          Back
                        </Button>
                      </div>
                    ) : (
                    <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@store.com" value={email} onChange={(e) => setEmail(e.target.value)} className="dark:border-border/60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className="dark:border-border/60" />
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sign in as</p>
                      <div className={cn('grid grid-cols-1 gap-3', desktop ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
                        {visibleRoles.map(({ role, title, description, icon: Icon, color, bgColor, borderColor, hoverBorder, iconBg, gradientFrom, gradientTo }, i) => (
                          <motion.button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.08 }}
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
                            {/* Animated checkmark */}
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
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        className={cn(
                          'w-full h-11 text-sm font-semibold gap-2 transition-all duration-200',
                          'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20',
                          !selectedRole && 'opacity-50 cursor-not-allowed'
                        )}
                        size="lg"
                        disabled={!selectedRole || submitting}
                        onClick={() => void handleSignIn()}
                      >
                        {submitting ? 'Signing in...' : `Sign In as ${selectedRole ? visibleRoles.find(r => r.role === selectedRole)?.title : '...'}`}
                        {selectedRole && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                    </>
                    )}
                  </motion.div>
                )}

                {/* ==================== REGISTER VIEW ==================== */}
                {mode === 'register' && !desktop && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <CardTitle className="text-xl flex items-center justify-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Create Your Account
                      </CardTitle>
                      <CardDescription className="mt-1">Start your 7-day free trial. No credit card required.</CardDescription>
                    </div>

                    {/* Free trial banner */}
                    <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                      <div className="flex items-start gap-2">
                        <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <div className="text-xs text-emerald-700 dark:text-emerald-300">
                          <p className="font-medium">Free Plan — 7-Day Trial</p>
                          <p className="mt-0.5 opacity-80">Get started with basic POS features. Upgrade anytime.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reg-store">Store / Business Name *</Label>
                      <Input id="reg-store" placeholder="e.g. ABC Store" value={regStore} onChange={e => setRegStore(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-name">Full Name *</Label>
                      <Input id="reg-name" placeholder="Your full name" value={regName} onChange={e => setRegName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="reg-email">Email *</Label>
                        <Input id="reg-email" type="email" placeholder="you@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="reg-phone">Phone</Label>
                        <Input id="reg-phone" placeholder="+977-98..." value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-password">Password *</Label>
                      <Input id="reg-password" type="password" placeholder="e.g. Test@123" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        className={cn(
                          'w-full h-11 text-sm font-semibold gap-2 transition-all duration-200',
                          'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20',
                          (!regName || !regEmail || !regStore || !regPassword) && 'opacity-50 cursor-not-allowed'
                        )}
                        size="lg"
                        disabled={!regName || !regEmail || !regStore || !regPassword || submitting}
                        onClick={() => void handleRegister()}
                      >
                        {submitting ? 'Creating account...' : 'Create Account & Start Free Trial'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <p className="text-center text-[11px] text-muted-foreground mt-3">
                        Password must include upper, lower, number, and a symbol.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground/70">
            © 2025 POS Nepal · Multi-Tenant SaaS Platform
          </p>
          <p className="text-center text-[10px] text-muted-foreground/60 dark:text-muted-foreground/50">
            Built with Next.js, Tailwind CSS & ShadCN UI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
