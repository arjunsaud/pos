'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Upload, ShieldCheck, Wallet, Landmark, CreditCard, Banknote, Zap, CheckCircle2, XCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  merchantId: string;
  icon: 'esewa' | 'khalti' | 'card' | 'cash';
  color: string;
  darkColor: string;
  bgColor: string;
  darkBgColor: string;
  borderColor: string;
  transactions: number;
  volume: number;
  lastTransaction: string;
}

export default function SuperAdminSettings() {
  // Branding state
  const [platformName, setPlatformName] = useState('POS Nepal');
  const [brandTagline, setBrandTagline] = useState('Multi-Tenant POS System');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [supportEmail, setSupportEmail] = useState('support@posnepal.com');

  // Payment state
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Nepal\'s most popular digital wallet for instant payments',
      enabled: true,
      merchantId: 'EPAY_12345',
      icon: 'esewa',
      color: 'text-emerald-700',
      darkColor: 'dark:text-emerald-400',
      bgColor: 'bg-emerald-100',
      darkBgColor: 'dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800/50',
      transactions: 1247,
      volume: 892500,
      lastTransaction: '2024-06-15T17:30:00',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Digital wallet supporting bank transfers and mobile banking',
      enabled: true,
      merchantId: 'KLT_67890',
      icon: 'khalti',
      color: 'text-purple-700',
      darkColor: 'dark:text-purple-400',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      transactions: 856,
      volume: 634200,
      lastTransaction: '2024-06-15T16:45:00',
    },
    {
      id: 'card',
      name: 'Card / Bank Transfer',
      description: 'Accept Visa, Mastercard, and direct bank transfers',
      enabled: false,
      merchantId: '',
      icon: 'card',
      color: 'text-blue-700',
      darkColor: 'dark:text-blue-400',
      bgColor: 'bg-blue-100',
      darkBgColor: 'dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      transactions: 0,
      volume: 0,
      lastTransaction: '',
    },
    {
      id: 'cash',
      name: 'Cash',
      description: 'Traditional cash payments at the point of sale',
      enabled: true,
      merchantId: '',
      icon: 'cash',
      color: 'text-amber-700',
      darkColor: 'dark:text-amber-400',
      bgColor: 'bg-amber-100',
      darkBgColor: 'dark:bg-amber-900/30',
      borderColor: 'border-amber-200 dark:border-amber-800/50',
      transactions: 2156,
      volume: 1456800,
      lastTransaction: '2024-06-15T17:50:00',
    },
  ]);

  // Domain state
  const [defaultDomain, setDefaultDomain] = useState('posnepal.com');
  const [sslEnabled, setSslEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gatewayIcon = (icon: PaymentGateway['icon']) => {
    switch (icon) {
      case 'esewa': return <Wallet className="h-5 w-5" />;
      case 'khalti': return <Zap className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'cash': return <Banknote className="h-5 w-5" />;
    }
  };

  const toggleGateway = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const updateMerchantId = (id: string, merchantId: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, merchantId } : g))
    );
  };

  const saveBranding = () => toast.success('Branding settings saved (mock)');
  const savePayment = () => toast.success('Payment settings saved (mock)');
  const saveDomain = () => toast.success('Domain settings saved (mock)');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings"
        description="Configure platform-wide settings"
      />

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Customize the platform appearance</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Logo Upload */}
                <div className="grid gap-2">
                  <Label>Platform Logo</Label>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  <div
                    className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-muted-foreground/50 cursor-pointer"
                    onClick={() => toast.info('Image upload is not available in demo mode')}
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm">Click to upload logo</p>
                      <p className="text-xs">PNG, JPG or SVG (max 2MB)</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded-lg border"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="brand-tagline">Brand Tagline</Label>
                  <Input
                    id="brand-tagline"
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                  />
                </div>

                <div className="grid gap-2 sm:max-w-sm">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>

                <Button onClick={saveBranding}>Save Branding</Button>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium">Live Preview</h3>
                <div
                  className="h-4 w-4 rounded-full border border-muted-foreground/20"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>

              <Card className="rounded-xl border bg-card p-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sidebar Header
                </p>
                {/* Mini Sidebar Header */}
                <div
                  className="mb-6 flex items-center gap-3 rounded-lg p-3 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-xs font-bold">
                    {platformName.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {platformName || 'Store Name'}
                    </p>
                    <p className="text-[10px] leading-tight opacity-80">Admin Panel</p>
                  </div>
                </div>

                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Login Page
                </p>
                {/* Mini Login Page */}
                <div className="rounded-lg border bg-background p-4">
                  <div className="mb-3 flex flex-col items-center text-center">
                    <div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {platformName.charAt(0) || 'P'}
                    </div>
                    <p className="text-sm font-semibold">
                      {platformName || 'Store Name'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {brandTagline || 'Your tagline here'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 rounded border bg-muted/50" />
                    <div className="h-6 rounded border bg-muted/50" />
                    <div
                      className="h-7 rounded text-center text-[10px] font-medium leading-7 text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Sign In
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Payment Gateways</h3>
            <p className="text-sm text-muted-foreground">Configure and manage payment methods available to tenants</p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Active Gateways</p>
              <p className="text-xl font-semibold">
                {gateways.filter(g => g.enabled).length}<span className="text-sm font-normal text-muted-foreground">/{gateways.length}</span>
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Total Transactions (Mock)</p>
              <p className="text-xl font-semibold">{gateways.reduce((sum, g) => sum + g.transactions, 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Total Volume (Mock)</p>
              <p className="text-xl font-semibold">NPR {new Intl.NumberFormat('en-NP').format(gateways.reduce((sum, g) => sum + g.volume, 0))}</p>
            </div>
          </div>

          {/* Gateway Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {gateways.map((gateway) => (
              <Card
                key={gateway.id}
                className={
                  'transition-all hover:shadow-md ' +
                  (gateway.enabled ? gateway.borderColor : 'border-border')
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={
                        'flex h-10 w-10 items-center justify-center rounded-lg ' +
                        (gateway.enabled ? gateway.bgColor + ' ' + gateway.darkBgColor + ' ' + gateway.color + ' ' + gateway.darkColor
                          : 'bg-muted text-muted-foreground')
                      }>
                        {gatewayIcon(gateway.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{gateway.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className={
                              'text-[10px] px-1.5 py-0 ' +
                              (gateway.enabled
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50'
                                : 'bg-muted text-muted-foreground border-border')
                            }
                          >
                            {gateway.enabled ? (
                              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Active</span>
                            ) : (
                              <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Inactive</span>
                            )}
                          </Badge>
                        </div>
                        <CardDescription className="mt-0.5 text-xs">
                          {gateway.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={gateway.enabled}
                      onCheckedChange={() => toggleGateway(gateway.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Transaction Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Transactions
                      </div>
                      <p className="text-sm font-semibold">{gateway.transactions.toLocaleString()}</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ArrowUpRight className="h-3 w-3" />
                        Volume
                      </div>
                      <p className="text-sm font-semibold">NPR {gateway.volume > 0 ? new Intl.NumberFormat('en-NP').format(gateway.volume) : '—'}</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Landmark className="h-3 w-3" />
                        Last Used
                      </div>
                      <p className="text-sm font-semibold">
                        {gateway.lastTransaction
                          ? new Date(gateway.lastTransaction).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Never'}
                      </p>
                    </div>
                  </div>

                  {/* Merchant ID (non-cash) */}
                  {gateway.icon !== 'cash' && (
                    <div className="grid gap-2">
                      <Label htmlFor={`merchant-${gateway.id}`} className="text-xs">
                        Merchant ID
                      </Label>
                      <Input
                        id={`merchant-${gateway.id}`}
                        value={gateway.merchantId}
                        onChange={(e) => updateMerchantId(gateway.id, e.target.value)}
                        placeholder={`Enter ${gateway.name} Merchant ID`}
                        disabled={!gateway.enabled}
                        className="h-8 text-sm"
                      />
                    </div>
                  )}

                  {/* Test Connection button for digital gateways */}
                  {gateway.icon !== 'cash' && gateway.enabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => toast.info(`${gateway.name} connection test (mock — always succeeds)`)}
                    >
                      <Zap className="mr-1.5 h-3 w-3" />
                      Test Connection
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={savePayment}>Save Payment Settings</Button>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Configure platform domain and SSL</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2 sm:max-w-md">
                <Label htmlFor="default-domain">Default Domain</Label>
                <Input
                  id="default-domain"
                  value={defaultDomain}
                  onChange={(e) => setDefaultDomain(e.target.value)}
                />
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <h4 className="text-sm font-medium">Custom Domain Information</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tenants can configure custom domains for their stores (Enterprise plan
                  required). Custom domains are mapped via CNAME records to your
                  platform. SSL certificates are automatically provisioned via
                  Let&apos;s Encrypt.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">SSL Status</p>
                    <p className="text-xs text-muted-foreground">
                      Auto-provision SSL certificates for all domains
                    </p>
                  </div>
                </div>
                <Switch checked={sslEnabled} onCheckedChange={setSslEnabled} />
              </div>

              <Button onClick={saveDomain}>Save Domain Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
