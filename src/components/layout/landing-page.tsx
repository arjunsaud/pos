'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { nprFull } from '@/lib/helpers';
import { mockPlans } from '@/lib/mock-data';
import {
  Monitor, ShoppingCart, Warehouse, Receipt, Globe, BarChart3, Shield, Users, Gift, Check, Moon, Sun, Menu, X, Zap, ArrowRight, Star, Copy, Share2, Link2, ChevronRight, TrendingUp, Lock, Headphones,
} from 'lucide-react';

const features = [
  { icon: ShoppingCart, title: 'Fast POS', desc: 'Lightning-fast point of sale with barcode scanning, cart management, and instant receipts.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: Warehouse, title: 'Inventory Management', desc: 'Real-time stock tracking, low stock alerts, and movement history at your fingertips.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: Receipt, title: 'Billing & VAT', desc: 'Auto 13% VAT calculation, Nepal PAN support, and professional invoices.', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Globe, title: 'Multi-Tenant', desc: 'Manage multiple stores from one platform with full data isolation.', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Sales trends, inventory reports, and VAT summaries with visual charts.', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with encrypted data and automatic backups.', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

export default function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Monitor className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">POS Nepal</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#referral" className="hover:text-foreground transition-colors">Referral</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="outline" className="hidden sm:flex" onClick={onSignIn}>Sign In</Button>
            <Button className="hidden sm:flex" onClick={onSignIn}>Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium" onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#pricing" className="block text-sm font-medium" onClick={() => setMobileMenu(false)}>Pricing</a>
            <a href="#referral" className="block text-sm font-medium" onClick={() => setMobileMenu(false)}>Referral</a>
            <Separator />
            <Button className="w-full" onClick={() => { setMobileMenu(false); onSignIn(); }}>Get Started Free</Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Trusted by 500+ businesses across Nepal
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
                Streamline Your Business with{' '}
                <span className="text-primary">POS Nepal</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Multi-tenant Point of Sale, Inventory Management & Billing System designed specifically for Nepali businesses. Built-in VAT, PAN support, and more.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8 h-12" onClick={onSignIn}>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 h-12" onClick={onSignIn}>
                  View Demo
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> 14-day free trial</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">Powerful features to manage your retail business efficiently</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4', f.bg)}>
                        <f.icon className={cn('h-6 w-6', f.color)} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-3 text-lg text-muted-foreground">Choose the plan that fits your business</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {mockPlans.map((plan) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  <Card className={cn('relative h-full flex flex-col transition-shadow hover:shadow-lg', plan.popular && 'border-primary shadow-md ring-1 ring-primary/20')}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="px-3 py-1"><Star className="h-3 w-3 mr-1" /> Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl capitalize">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-extrabold">{nprFull(plan.price)}</span>
                        <span className="text-muted-foreground">/{plan.interval}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <ul className="space-y-2.5 flex-1 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className={cn('h-4 w-4 shrink-0 mt-0.5', plan.popular ? 'text-primary' : 'text-emerald-500')} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button className={cn('w-full', !plan.popular && 'variant="outline"')} variant={plan.popular ? 'default' : 'outline'} onClick={onSignIn}>
                        Get Started <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {/* Promo Code */}
            <div className="mt-10 max-w-md mx-auto">
              <div className="flex gap-2">
                <Input placeholder="Enter promo code..." value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setAppliedPromo(''); }} className="h-10 font-mono" />
                <Button variant="outline" onClick={handleApplyPromo}>Apply</Button>
              </div>
              {appliedPromo && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <Gift className="h-3.5 w-3.5 inline mr-1" /> Code &quot;{appliedPromo}&quot; applied! Discount will be reflected at checkout.
                </motion.p>
              )}
            </div>
          </div>
        </section>

        {/* Referral CTA */}
        <section id="referral" className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Refer a Friend, Earn Rewards</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your unique referral link with other businesses. When they sign up, you both get a discount on your subscription.
              </p>
              <div className="mt-10 grid sm:grid-cols-3 gap-6">
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-extrabold text-primary">20%</p><p className="text-sm text-muted-foreground mt-1">Discount per referral</p></CardContent></Card>
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-extrabold text-primary">Unlimited</p><p className="text-sm text-muted-foreground mt-1">Referrals allowed</p></CardContent></Card>
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-extrabold text-primary">Instant</p><p className="text-sm text-muted-foreground mt-1">Reward application</p></CardContent></Card>
              </div>
              <Button size="lg" className="mt-10 text-base px-8 h-12" onClick={onSignIn}>
                Start Referring <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Monitor className="h-4 w-4" /></div>
                <span className="font-bold">POS Nepal</span>
              </div>
              <p className="text-sm text-muted-foreground">Multi-tenant POS, Inventory & Billing System for Nepali businesses.</p>
            </div>
            <div><h4 className="font-semibold mb-3">Product</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><a href="#features" className="hover:text-foreground">Features</a></li><li><a href="#pricing" className="hover:text-foreground">Pricing</a></li><li><a href="#referral" className="hover:text-foreground">Referral</a></li></ul></div>
            <div><h4 className="font-semibold mb-3">Support</h4><ul className="space-y-2 text-sm text-muted-foreground"><li className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5" /> 24/7 Support</li><li className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Help Center</li><li className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Privacy Policy</li></ul></div>
            <div><h4 className="font-semibold mb-3">Connect</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>Kathmandu, Nepal</li><li>info@posnepal.com</li><li>+977-9800000000</li></ul></div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">&copy; 2025 POS Nepal &middot; All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
