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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  ShieldCheck,
  Wallet,
  Zap,
  Landmark,
  QrCode,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ImagePlus,
  FileText,
  Shield,
  Save,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AdminPaymentMethod, AdminPaymentType } from '@/lib/types';
import { mockAdminPaymentMethods } from '@/lib/mock-data';
import { useLegalContentStore, defaultTermsContent, defaultPrivacyContent } from '@/features/auth/store';

const paymentTypeIcons: Record<AdminPaymentType, typeof Wallet> = {
  esewa: Wallet,
  khalti: Zap,
  bank: Landmark,
  qr: QrCode,
};

const paymentTypeColors: Record<AdminPaymentType, { bg: string; icon: string }> = {
  esewa: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  khalti: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
  bank: { bg: 'bg-sky-100 dark:bg-sky-900/30', icon: 'text-sky-600 dark:text-sky-400' },
  qr: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400' },
};

export default function SuperAdminSettings() {
  // Branding state
  const [platformName, setPlatformName] = useState('POS Nepal');
  const [brandTagline, setBrandTagline] = useState('Multi-Tenant POS System');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [supportEmail, setSupportEmail] = useState('support@posnepal.com');

  // Domain state
  const [defaultDomain, setDefaultDomain] = useState('posnepal.com');
  const [sslEnabled, setSslEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment Methods state
  const [methods, setMethods] = useState<AdminPaymentMethod[]>([...mockAdminPaymentMethods]);
  const [showMethodDialog, setShowMethodDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<AdminPaymentMethod | null>(null);
  const [methodForm, setMethodForm] = useState({ name: '', type: 'esewa' as AdminPaymentType, description: '', accountDetails: '', enabled: true });

  // Legal content state
  const { termsContent, privacyContent, setTermsContent, setPrivacyContent } = useLegalContentStore();
  const [editTerms, setEditTerms] = useState(termsContent);
  const [editPrivacy, setEditPrivacy] = useState(privacyContent);
  const [showTermsPreview, setShowTermsPreview] = useState(false);
  const [showPrivacyPreview, setShowPrivacyPreview] = useState(false);

  const saveBranding = () => toast.success('Branding settings saved (mock)');
  const saveDomain = () => toast.success('Domain settings saved (mock)');

  // Payment method CRUD
  const openNewMethod = () => {
    setEditingMethod(null);
    setMethodForm({ name: '', type: 'esewa', description: '', accountDetails: '', enabled: true });
    setShowMethodDialog(true);
  };

  const openEditMethod = (m: AdminPaymentMethod) => {
    setEditingMethod(m);
    setMethodForm({ name: m.name, type: m.type, description: m.description, accountDetails: m.accountDetails, enabled: m.enabled });
    setShowMethodDialog(true);
  };

  const saveMethod = () => {
    if (!methodForm.name || !methodForm.accountDetails) {
      toast.error('Name and Account Details are required');
      return;
    }
    if (editingMethod) {
      setMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...methodForm } : m));
      toast.success('Payment method updated');
    } else {
      const newMethod: AdminPaymentMethod = {
        id: `pm-${Date.now()}`,
        ...methodForm,
      };
      setMethods(prev => [...prev, newMethod]);
      toast.success('Payment method added');
    }
    setShowMethodDialog(false);
  };

  const deleteMethod = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    toast.success('Payment method deleted');
  };

  const toggleMethodEnabled = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const saveTerms = () => {
    setTermsContent(editTerms);
    toast.success('Terms & Conditions saved');
  };

  const resetTerms = () => {
    setEditTerms(defaultTermsContent);
    toast.info('Terms & Conditions reset to default');
  };

  const savePrivacy = () => {
    setPrivacyContent(editPrivacy);
    toast.success('Privacy Policy saved');
  };

  const resetPrivacy = () => {
    setEditPrivacy(defaultPrivacyContent);
    toast.info('Privacy Policy reset to default');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Configure platform-wide settings" />

      <Tabs defaultValue="branding">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
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
                <div className="grid gap-2">
                  <Label>Platform Logo</Label>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-muted-foreground/50 cursor-pointer" onClick={() => toast.info('Image upload is not available in demo mode')}>
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
                    <Input id="platform-name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-20 cursor-pointer rounded-lg border" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand-tagline">Brand Tagline</Label>
                  <Input id="brand-tagline" value={brandTagline} onChange={(e) => setBrandTagline(e.target.value)} />
                </div>
                <div className="grid gap-2 sm:max-w-sm">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                </div>
                <Button onClick={saveBranding}>Save Branding</Button>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium">Live Preview</h3>
                <div className="h-4 w-4 rounded-full border border-muted-foreground/20" style={{ backgroundColor: primaryColor }} />
              </div>
              <Card className="rounded-xl border bg-card p-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Sidebar Header</p>
                <div className="mb-6 flex items-center gap-3 rounded-lg p-3 text-white" style={{ backgroundColor: primaryColor }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-xs font-bold">{platformName.charAt(0) || 'P'}</div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{platformName || 'Store Name'}</p>
                    <p className="text-[10px] leading-tight opacity-80">Admin Panel</p>
                  </div>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Login Page</p>
                <div className="rounded-lg border bg-background p-4">
                  <div className="mb-3 flex flex-col items-center text-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ backgroundColor: primaryColor }}>{platformName.charAt(0) || 'P'}</div>
                    <p className="text-sm font-semibold">{platformName || 'Store Name'}</p>
                    <p className="text-[10px] text-muted-foreground">{brandTagline || 'Your tagline here'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 rounded border bg-muted/50" />
                    <div className="h-6 rounded border bg-muted/50" />
                    <div className="h-7 rounded text-center text-[10px] font-medium leading-7 text-white" style={{ backgroundColor: primaryColor }}>Sign In</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
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
                <Input id="default-domain" value={defaultDomain} onChange={(e) => setDefaultDomain(e.target.value)} />
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <h4 className="text-sm font-medium">Custom Domain Information</h4>
                <p className="mt-1 text-sm text-muted-foreground">Tenants can configure custom domains for their stores (Enterprise plan required). Custom domains are mapped via CNAME records to your platform. SSL certificates are automatically provisioned via Let&apos;s Encrypt.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">SSL Status</p>
                    <p className="text-xs text-muted-foreground">Auto-provision SSL certificates for all domains</p>
                  </div>
                </div>
                <Switch checked={sslEnabled} onCheckedChange={setSslEnabled} />
              </div>
              <Button onClick={saveDomain}>Save Domain Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">Manage payment methods shown to tenants for subscription payments</p>
            </div>
            <Button onClick={openNewMethod}><Plus className="h-4 w-4 mr-2" />Add Method</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {methods.map((method) => {
              const Icon = paymentTypeIcons[method.type];
              const colors = paymentTypeColors[method.type];
              return (
                <Card key={method.id} className={cn('transition-all hover:shadow-md', method.enabled ? 'border-primary/30' : 'opacity-70')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors.bg)}>
                          <Icon className={cn('h-5 w-5', colors.icon)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{method.name}</CardTitle>
                            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', method.enabled ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-muted text-muted-foreground border-border')}>
                              {method.enabled ? <><Check className="h-3 w-3 mr-1" />Active</> : <><X className="h-3 w-3 mr-1" />Inactive</>}
                            </Badge>
                          </div>
                          <CardDescription className="mt-0.5 text-xs">{method.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={method.enabled} onCheckedChange={() => toggleMethodEnabled(method.id)} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Account Details</p>
                      <p className="text-xs font-mono text-foreground break-all">{method.accountDetails}</p>
                    </div>

                    {/* QR Code Section */}
                    <div className="rounded-md border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">QR Code</p>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => toast.info('QR code upload is not available in demo mode')}>
                          <ImagePlus className="h-3 w-3 mr-1" />Upload QR
                        </Button>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 flex items-center justify-center">
                          <QrCode className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center mt-1">Upload a QR code for this payment method</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => openEditMethod(method)}>
                        <Pencil className="h-3 w-3 mr-1" />Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700 dark:text-red-400" onClick={() => deleteMethod(method.id)}>
                        <Trash2 className="h-3 w-3 mr-1" />Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              <p className="text-sm text-muted-foreground">Edit the terms shown to users on the landing page</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetTerms}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset to Default
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowTermsPreview(true)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />Preview
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="rounded-lg border bg-muted/20 p-3 mb-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Supports markdown-style formatting: <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">#</code> for headings, <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">-</code> for lists, <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">**bold**</code> for bold text
                </p>
              </div>
              <Textarea
                value={editTerms}
                onChange={(e) => setEditTerms(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter your Terms & Conditions..."
              />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditTerms(termsContent)}>Discard Changes</Button>
            <Button onClick={saveTerms} disabled={editTerms === termsContent}>
              <Save className="h-4 w-4 mr-2" />Save Terms & Conditions
            </Button>
          </div>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">Edit the privacy policy shown to users on the landing page</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetPrivacy}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset to Default
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPrivacyPreview(true)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />Preview
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="rounded-lg border bg-muted/20 p-3 mb-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Supports markdown-style formatting: <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">#</code> for headings, <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">-</code> for lists, <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">**bold**</code> for bold text
                </p>
              </div>
              <Textarea
                value={editPrivacy}
                onChange={(e) => setEditPrivacy(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter your Privacy Policy..."
              />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditPrivacy(privacyContent)}>Discard Changes</Button>
            <Button onClick={savePrivacy} disabled={editPrivacy === privacyContent}>
              <Save className="h-4 w-4 mr-2" />Save Privacy Policy
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Payment Method Dialog */}
      <Dialog open={showMethodDialog} onOpenChange={setShowMethodDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
            <DialogDescription>{editingMethod ? 'Update the payment method details.' : 'Add a new payment method for tenants.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label>Method Name *</Label>
              <Input placeholder="e.g. eSewa, Khalti, Bank Transfer" value={methodForm.name} onChange={e => setMethodForm({ ...methodForm, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={methodForm.type} onValueChange={v => setMethodForm({ ...methodForm, type: v as AdminPaymentType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="esewa">eSewa</SelectItem>
                  <SelectItem value="khalti">Khalti</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="qr">QR Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input placeholder="Brief description" value={methodForm.description} onChange={e => setMethodForm({ ...methodForm, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Account Details *</Label>
              <Textarea placeholder="e.g. eSewa ID: 9841234567 or Bank A/C details" value={methodForm.accountDetails} onChange={e => setMethodForm({ ...methodForm, accountDetails: e.target.value })} className="min-h-[80px]" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Enabled</p>
                <p className="text-xs text-muted-foreground">Show this method to tenants</p>
              </div>
              <Switch checked={methodForm.enabled} onCheckedChange={checked => setMethodForm({ ...methodForm, enabled: checked })} />
            </div>
            <div className="grid gap-2">
              <Label>QR Code Image</Label>
              <div className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 cursor-pointer hover:border-muted-foreground/50 transition-colors" onClick={() => toast.info('QR upload is not available in demo mode')}>
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImagePlus className="h-5 w-5" />
                  <p className="text-xs">Click to upload QR code image</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowMethodDialog(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveMethod}>{editingMethod ? 'Update' : 'Add'} Method</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Preview Dialog */}
      <Dialog open={showTermsPreview} onOpenChange={setShowTermsPreview}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Terms & Conditions Preview</DialogTitle>
            <DialogDescription>This is how the content appears to users on the landing page</DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-1">
            {editTerms.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={i} className="h-2" />;
              if (trimmed.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mt-4">{trimmed.slice(3)}</h2>;
              if (trimmed.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-2">{trimmed.slice(2)}</h1>;
              if (trimmed.startsWith('- ')) return <li key={i} className="text-sm text-muted-foreground ml-4 list-disc" dangerouslySetInnerHTML={{ __html: trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />;
              return <p key={i} className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />;
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Preview Dialog */}
      <Dialog open={showPrivacyPreview} onOpenChange={setShowPrivacyPreview}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Privacy Policy Preview</DialogTitle>
            <DialogDescription>This is how the content appears to users on the landing page</DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-1">
            {editPrivacy.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={i} className="h-2" />;
              if (trimmed.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mt-4">{trimmed.slice(3)}</h2>;
              if (trimmed.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-2">{trimmed.slice(2)}</h1>;
              if (trimmed.startsWith('- ')) return <li key={i} className="text-sm text-muted-foreground ml-4 list-disc" dangerouslySetInnerHTML={{ __html: trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />;
              return <p key={i} className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>') }} />;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
