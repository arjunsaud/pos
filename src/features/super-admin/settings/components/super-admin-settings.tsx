'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateway {
  name: string;
  enabled: boolean;
  merchantId: string;
}

export default function SuperAdminSettings() {
  // Branding state
  const [platformName, setPlatformName] = useState('POS Nepal');
  const [primaryColor, setPrimaryColor] = useState('Emerald Green');
  const [supportEmail, setSupportEmail] = useState('support@posnepal.com');

  // Payment state
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    { name: 'eSewa', enabled: true, merchantId: 'EPAY_12345' },
    { name: 'Khalti', enabled: true, merchantId: 'KLT_67890' },
    { name: 'Bank Transfer', enabled: false, merchantId: '' },
    { name: 'Cash', enabled: true, merchantId: '' },
  ]);

  // Domain state
  const [defaultDomain, setDefaultDomain] = useState('posnepal.com');
  const [sslEnabled, setSslEnabled] = useState(true);

  const toggleGateway = (index: number) => {
    setGateways((prev) =>
      prev.map((g, i) => (i === index ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const updateMerchantId = (index: number, merchantId: string) => {
    setGateways((prev) =>
      prev.map((g, i) => (i === index ? { ...g, merchantId } : g))
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
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the platform appearance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Logo Upload */}
              <div className="grid gap-2">
                <Label>Platform Logo</Label>
                <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-muted-foreground/50 cursor-pointer">
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
                  <Input
                    id="primary-color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="e.g. Emerald Green"
                  />
                </div>
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
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure available payment methods</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {gateways.map((gateway, index) => (
                <div key={gateway.name}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{gateway.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {gateway.name === 'Cash'
                          ? 'Enable cash payments at POS'
                          : gateway.name === 'Bank Transfer'
                          ? 'Enable bank transfer payments'
                          : `Accept ${gateway.name} payments`}
                      </p>
                    </div>
                    <Switch
                      checked={gateway.enabled}
                      onCheckedChange={() => toggleGateway(index)}
                    />
                  </div>
                  {gateway.name !== 'Cash' && (
                    <div className="mt-3 grid gap-2 sm:max-w-sm">
                      <Label htmlFor={`merchant-${index}`}>Merchant ID</Label>
                      <Input
                        id={`merchant-${index}`}
                        value={gateway.merchantId}
                        onChange={(e) => updateMerchantId(index, e.target.value)}
                        placeholder={`Enter ${gateway.name} Merchant ID`}
                        disabled={!gateway.enabled}
                      />
                    </div>
                  )}
                  {index < gateways.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
              <Button onClick={savePayment}>Save Payment Settings</Button>
            </CardContent>
          </Card>
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
