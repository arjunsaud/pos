'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { nprFull } from '@/lib/helpers';
import { mockPackages } from '@/lib/mock-data';
import { useLegalContentStore } from '@/features/auth/store';
import {
  Monitor,
  ShoppingCart,
  Warehouse,
  Receipt,
  Globe,
  BarChart3,
  Shield,
  Users,
  Gift,
  Check,
  X,
  Moon,
  Sun,
  Menu,
  X as XIcon,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  TrendingUp,
  Headphones,
  UserPlus,
  Store,
  Package,
  Quote,
  MessageCircle,
  Clock,
  Crown,
  Sparkles,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const ANNUAL_DISCOUNT = 20;

const features = [
  { icon: ShoppingCart, title: 'Fast POS', desc: 'Lightning-fast point of sale with barcode scanning, cart management, and instant receipts.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: Warehouse, title: 'Inventory Management', desc: 'Track stock levels in real-time, get low-stock alerts, and manage movements across outlets.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: Receipt, title: 'Billing & VAT', desc: 'Automatic 13% VAT calculation, PAN support, and professional invoice generation for Nepal.', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Globe, title: 'Multi-Tenant', desc: 'Manage multiple stores or outlets from a single platform with fully isolated data.', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Comprehensive sales, inventory, and VAT reports with Nepal fiscal year support.', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with 2FA, encrypted data, and 99.9% uptime SLA.', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

const steps = [
  { icon: UserPlus, title: 'Sign Up & Choose Plan', desc: 'Create your account in seconds and select the plan that fits your business.' },
  { icon: Store, title: 'Set Up Your Store', desc: 'Add your products, configure outlets, and customize your POS settings.' },
  { icon: ShoppingCart, title: 'Start Selling', desc: 'Ring up sales, manage inventory, and generate invoices with built-in VAT.' },
  { icon: BarChart3, title: 'Grow & Scale', desc: 'Track analytics, manage multiple outlets, and scale your operations.' },
];

const testimonials = [
  { quote: 'POS Nepal completely transformed how we manage our store. The VAT integration alone saves us hours every month. Best investment we made.', name: 'Rajesh Sharma', role: 'Owner, ABC Store - Kathmandu', stars: 5 },
  { quote: 'The inventory tracking is incredibly accurate. We went from weekly stocktakes to real-time visibility. Our shrinkage dropped by 40% in the first quarter.', name: 'Bikash Thapa', role: 'Manager, Kathmandu Grocers', stars: 5 },
  { quote: 'As an electronics retailer, we needed a system that could handle thousands of SKUs. POS Nepal handles it effortlessly with blazing-fast performance.', name: 'Anita Gurung', role: 'Director, Pokhara Electronics', stars: 5 },
];

const faqs = [
  { q: 'What is POS Nepal?', a: 'POS Nepal is a comprehensive multi-tenant Point of Sale, Inventory Management, and Billing System designed specifically for Nepali businesses. It includes built-in VAT calculation, PAN support, and multi-store management.' },
  { q: 'How does multi-tenant work?', a: 'Multi-tenancy allows you to manage multiple stores or business outlets from a single platform. Each tenant has fully isolated data, ensuring privacy and security while enabling centralized oversight.' },
  { q: 'What payment methods are supported?', a: 'POS Nepal supports cash, bank transfers, mobile wallets (eSewa, Khalti, IME Pay), and card payments through our integrated payment gateway (available on eligible plans).' },
  { q: 'Can I upgrade my plan later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time. When you upgrade, the new features are available immediately and billing is prorated for the remainder of your cycle.' },
  { q: 'Is there a free trial?', a: 'Yes! Every new account comes with a 7-day free trial on the Free Plan with access to basic features. No credit card is required to start. Upgrade anytime during or after the trial.' },
];

const featureToggles: { key: keyof (typeof mockPackages)[number]; label: string }[] = [
  { key: 'paymentGateway', label: 'Payment Gateway' },
  { key: 'billing', label: 'Billing' },
  { key: 'receipt', label: 'Receipt' },
  { key: 'export', label: 'Export' },
  { key: 'advanceInventory', label: 'Advanced Inventory' },
  { key: 'pos', label: 'POS' },
  { key: 'multipleOutlets', label: 'Multiple Outlets' },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

/* ------------------------------------------------------------------ */
/*  Helper: Render markdown-like content from store                     */
/* ------------------------------------------------------------------ */
function RenderMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-base font-semibold mt-4">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-lg font-semibold mt-4">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-xl font-bold mt-2">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith('- ')) {
      const boldMatch = trimmed.match(/^- (\*\*(.+?)\*\*:)?(.*)$/);
      const label = boldMatch?.[2];
      const rest = boldMatch?.[3] || trimmed.slice(2);
      elements.push(
        <li key={key++} className="text-sm text-muted-foreground ml-4 list-disc">
          {label && <strong className="text-foreground font-medium">{label}:</strong>}
          <span dangerouslySetInnerHTML={{ __html: rest.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />
        </li>
      );
    } else {
      elements.push(
        <p key={key++} className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Registration state
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStore, setRegStore] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferral, setRegReferral] = useState('');

  // Trial expired popup
  const [showTrialPopup, setShowTrialPopup] = useState(false);

  // Legal pages
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Legal content from store
  const { termsContent, privacyContent } = useLegalContentStore();

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      const discounted = Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT / 100));
      return { monthly: discounted, yearly: discounted * 12 };
    }
    return { monthly: monthlyPrice, yearly: monthlyPrice * 12 };
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode.trim().toUpperCase());
    }
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regStore || !regPassword) return;
    setShowRegister(false);
    onSignIn();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ============================================================ */}
      {/*  NAVBAR                                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Monitor className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">POS Nepal</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">{link.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="outline" className="hidden sm:flex" onClick={onSignIn}>Sign In</Button>
            <Button className="hidden sm:flex" onClick={() => setShowRegister(true)}>Get Started</Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm font-medium" onClick={() => setMobileMenu(false)}>{link.label}</a>
            ))}
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setMobileMenu(false); onSignIn(); }}>Sign In</Button>
              <Button className="flex-1" onClick={() => { setMobileMenu(false); setShowRegister(true); }}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ============================================================ */}
        {/*  HERO                                                        */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Trusted by 500+ businesses across Nepal
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
                Streamline Your Business with{' '}<span className="text-primary">POS Nepal</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Multi-tenant Point of Sale, Inventory Management & Billing System designed specifically for Nepali businesses. Built-in VAT, PAN support, and more.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8 h-12" onClick={() => setShowRegister(true)}>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 h-12" onClick={() => setShowTrialPopup(true)}>
                  <Clock className="mr-2 h-4 w-4" /> View Demo
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> 7-day free trial</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FEATURES                                                    */}
        {/* ============================================================ */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">Powerful features to manage your retail business efficiently</p>
            </motion.div>
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

        {/* ============================================================ */}
        {/*  HOW IT WORKS                                                */}
        {/* ============================================================ */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">Get up and running in four simple steps</p>
            </motion.div>
            <div className="relative">
              <div className="hidden md:block absolute top-12 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-0.5 bg-border" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {steps.map((step, i) => (
                  <motion.div key={step.title} className="flex flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.4 }}>
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="mt-4 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</span>
                    <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-[220px]">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  PRICING                                                     */}
        {/* ============================================================ */}
        <section id="pricing" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-3 text-lg text-muted-foreground">Choose the plan that fits your business</p>

              {/* Billing Toggle */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className={cn('text-sm font-medium', billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={cn(
                    'relative h-7 w-12 rounded-full transition-colors duration-200',
                    billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <motion.div
                    className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
                    animate={{ left: billingCycle === 'yearly' ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className={cn('text-sm font-medium', billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>Annually</span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 text-xs px-2 py-0.5">
                    <Sparkles className="h-3 w-3 mr-1" /> Save {ANNUAL_DISCOUNT}%
                  </Badge>
                )}
              </div>

              {billingCycle === 'yearly' && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-medium"
                >
                  🎉 Limited Time Offer: Get {ANNUAL_DISCOUNT}% off on annual plans!
                </motion.p>
              )}
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mockPackages.map((plan, i) => {
                const price = getPrice(plan.price);
                const isYearly = billingCycle === 'yearly';
                return (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                    <Card className={cn('relative h-full flex flex-col transition-shadow hover:shadow-lg', plan.popular && 'border-primary shadow-md ring-1 ring-primary/20')}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="px-3 py-1"><Star className="h-3 w-3 mr-1" /> Most Popular</Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="mt-4">
                          {isYearly && (
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <span className="text-sm text-muted-foreground line-through">NPR {nprFull(plan.price * 12)}</span>
                              <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 text-[10px] px-1.5 py-0">-{ANNUAL_DISCOUNT}%</Badge>
                            </div>
                          )}
                          <span className="text-sm text-muted-foreground">NPR </span>
                          <span className="text-4xl font-extrabold">{nprFull(isYearly ? price.monthly : plan.price)}</span>
                          <span className="text-muted-foreground">/{isYearly ? 'mo' : 'month'}</span>
                          {isYearly && (
                            <p className="text-xs text-muted-foreground mt-1">Billed NPR {nprFull(price.yearly)}/year</p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col pt-0">
                        <ul className="space-y-1.5 text-sm mb-4 pb-4 border-b">
                          <li className="flex justify-between"><span className="text-muted-foreground">Max Products</span><span className="font-medium">{plan.maxProducts.toLocaleString()}</span></li>
                          <li className="flex justify-between"><span className="text-muted-foreground">Staff Accounts</span><span className="font-medium">{plan.maxStaff}</span></li>
                          <li className="flex justify-between"><span className="text-muted-foreground">Analytics</span><span className="font-medium capitalize">{plan.analytics}</span></li>
                          <li className="flex justify-between"><span className="text-muted-foreground">Support</span><span className="font-medium capitalize">{plan.support}</span></li>
                        </ul>

                        <ul className="space-y-2 flex-1 mb-6">
                          {featureToggles.map((ft) => {
                            const enabled = plan[ft.key] as boolean;
                            return (
                              <li key={ft.key} className="flex items-center gap-2 text-sm">
                                {enabled
                                  ? <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                  : <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                }
                                <span className={cn(!enabled && 'text-muted-foreground/60')}>{ft.label}</span>
                              </li>
                            );
                          })}
                        </ul>

                        <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} onClick={() => setShowRegister(true)}>
                          Get Started <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Custom Plan Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }}>
                <Card className="relative h-full flex flex-col transition-shadow hover:shadow-lg border-dashed border-2">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Custom</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold">Let&apos;s Talk</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Tailored to your business needs</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <ul className="space-y-1.5 text-sm mb-4 pb-4 border-b">
                      <li className="flex justify-between"><span className="text-muted-foreground">Products</span><span className="font-medium">Unlimited</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Staff Accounts</span><span className="font-medium">Unlimited</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Analytics</span><span className="font-medium capitalize">Custom</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Support</span><span className="font-medium capitalize">Dedicated</span></li>
                    </ul>
                    <ul className="space-y-2 flex-1 mb-6">
                      {featureToggles.map((ft) => (
                        <li key={ft.key} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{ft.label}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Custom Integrations</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>SLA Guarantee</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline" asChild>
                      <a href="https://wa.me/9779800000000?text=Hi%20POS%20Nepal%2C%20I%27m%20interested%20in%20a%20custom%20plan." target="_blank" rel="noopener noreferrer">
                        Contact Us <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Free Plan Banner */}
            <div className="mt-10">
              <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Free Plan — 7-Day Trial</h3>
                      <p className="text-sm text-muted-foreground">Start with basic POS features free for 7 days. No credit card needed. Upgrade anytime.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowRegister(true)}>
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Promo Code */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex gap-2">
                <Input placeholder="Enter promo code..." value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setAppliedPromo(''); }} className="h-10 font-mono" onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()} />
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

        {/* ============================================================ */}
        {/*  TESTIMONIALS                                                */}
        {/* ============================================================ */}
        <section id="testimonials" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl sm:text-4xl font-bold">Loved by Businesses Across Nepal</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">See what our customers have to say about POS Nepal</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col">
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: t.stars }).map((_, si) => (
                          <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        <Quote className="h-4 w-4 text-primary/30 mb-2 block" />
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FAQ                                                         */}
        {/* ============================================================ */}
        <section id="faq" className="py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-3 text-lg text-muted-foreground">Got questions? We&apos;ve got answers.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  REFERRAL CTA                                                */}
        {/* ============================================================ */}
        <section id="referral" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Gift className="h-8 w-8 text-primary" />
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
              <Button size="lg" className="mt-10 text-base px-8 h-12" onClick={() => setShowRegister(true)}>
                Start Referring <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Monitor className="h-4 w-4" /></div>
                <span className="font-bold">POS Nepal</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Multi-tenant POS, Inventory & Billing System built for Nepali businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#referral" className="hover:text-foreground transition-colors">Referral Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5" /> 24/7 Support</li>
                <li className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> Kathmandu, Nepal</li>
                <li className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> info@posnepal.com</li>
                <li className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" /> +977-9800000000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setShowTerms(true)} className="hover:text-foreground transition-colors flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Terms & Conditions</button></li>
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-foreground transition-colors flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">&copy; 2025 POS Nepal &middot; All rights reserved</p>
        </div>
      </footer>

      {/* ============================================================ */}
      {/*  WHATSAPP FLOATING BUTTON                                     */}
      {/* ============================================================ */}
      <a
        href="https://wa.me/9779800000000?text=Hi%20POS%20Nepal%2C%20I%27m%20interested%20in%20your%20POS%20system."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] hover:shadow-xl transition-all duration-200 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground text-background px-3 py-1.5 text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us!
        </span>
      </a>

      {/* ============================================================ */}
      {/*  REGISTRATION DIALOG                                          */}
      {/* ============================================================ */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UserPlus className="h-4 w-4" />
              </div>
              Create Your Account
            </DialogTitle>
            <DialogDescription>Start your 7-day free trial. No credit card required.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-3">
              <div className="flex items-start gap-2">
                <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  <p className="font-medium">Free Plan — 7-Day Trial</p>
                  <p className="mt-0.5 opacity-80">Get started with basic POS features. Upgrade anytime to unlock more.</p>
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
            <div className="grid grid-cols-2 gap-3">
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
              <Input id="reg-password" type="password" placeholder="Min 8 characters" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-referral">Referral Code (optional)</Label>
              <Input id="reg-referral" placeholder="Enter referral code" value={regReferral} onChange={e => setRegReferral(e.target.value)} className="font-mono" />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button className="w-full" disabled={!regName || !regEmail || !regStore || !regPassword} onClick={handleRegister}>
                Create Account & Start Free Trial
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By signing up, you agree to our{' '}
                <button onClick={() => { setShowRegister(false); setTimeout(() => setShowTerms(true), 200); }} className="underline hover:text-foreground">Terms of Service</button>
                {' '}and{' '}
                <button onClick={() => { setShowRegister(false); setTimeout(() => setShowPrivacy(true), 200); }} className="underline hover:text-foreground">Privacy Policy</button>.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/*  TRIAL EXPIRED POPUP                                          */}
      {/* ============================================================ */}
      <Dialog open={showTrialPopup} onOpenChange={setShowTrialPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Trial Period Ending Soon
            </DialogTitle>
            <DialogDescription>Your 7-day free trial is about to expire. Upgrade now to keep your data and continue using POS Nepal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Trial Progress */}
            <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Free Trial</span>
                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">5 of 7 days used</span>
              </div>
              <div className="h-2 w-full rounded-full bg-amber-200 dark:bg-amber-900/50 overflow-hidden">
                <div className="h-full w-[71%] rounded-full bg-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Upgrade before your trial ends to avoid any interruption.</p>
            </div>

            {/* Quick Plans */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Choose a plan to continue:</h4>
              {mockPackages.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">Up to {plan.maxProducts.toLocaleString()} products &middot; {plan.maxStaff} staff</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">NPR {nprFull(plan.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    <Button size="sm" className="h-6 text-[10px] px-2 mt-1" onClick={() => { setShowTrialPopup(false); setShowRegister(true); }}>Choose</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowTrialPopup(false)}>Remind Me Later</Button>
              <Button className="flex-1" onClick={() => { setShowTrialPopup(false); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>
                View All Plans <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/*  TERMS & CONDITIONS DIALOG                                     */}
      {/* ============================================================ */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Terms & Conditions</DialogTitle>
            <DialogDescription>Last updated: June 15, 2025</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <RenderMarkdown content={termsContent} />
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/*  PRIVACY POLICY DIALOG                                          */}
      {/* ============================================================ */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Privacy Policy</DialogTitle>
            <DialogDescription>Last updated: June 15, 2025</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <RenderMarkdown content={privacyContent} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
