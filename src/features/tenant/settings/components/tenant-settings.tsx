'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Bell, Eye, EyeOff, Save, Store, Globe, Clock, Link2, Copy, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TenantSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [twoFA, setTwoFA] = useState(false);
  const [notif, setNotif] = useState({ order: true, stock: true, weekly: true, sms: false });

  const [bizName, setBizName] = useState('ABC Store');
  const [bizEmail, setBizEmail] = useState('admin@abcstore.com');
  const [bizPhone, setBizPhone] = useState('+977-9801234567');

  // Custom domain state
  const [subdomain] = useState('abcstore.posnepal.com');
  const [customDomain, setCustomDomain] = useState('');
  const [customDomainVerified, setCustomDomainVerified] = useState(false);

  const handleChangePw = () => {
    if (!currentPw || !newPw) { toast.error('Please fill in all password fields'); return; }
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    toast.success('Password changed successfully');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  const handleToggle2FA = () => {
    setTwoFA(!twoFA);
    toast.success(twoFA ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
  };

  const handleSaveBiz = () => toast.success('Business settings saved');
  const handleSaveNotif = () => toast.success('Notification preferences saved');

  const handleSaveDomain = () => {
    if (customDomain) {
      toast.success('Custom domain settings saved. DNS changes may take up to 24 hours to propagate.');
    } else {
      toast.success('Domain settings saved');
    }
  };

  const handleVerifyDns = () => {
    toast.info('DNS verification initiated. This may take a few moments...');
    setTimeout(() => {
      setCustomDomainVerified(true);
      toast.success('DNS verified successfully! Your custom domain is now active.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and application settings" />

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Lock className="h-5 w-5" /> Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <Button onClick={handleChangePw}><Lock className="h-4 w-4 mr-2" />Change Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Auth */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5" /> Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">Receive a verification code when signing in</p>
            </div>
            <Switch checked={twoFA} onCheckedChange={handleToggle2FA} />
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Store className="h-5 w-5" /> Business Information</CardTitle>
          <CardDescription>Basic business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="grid gap-2"><Label>Business Name</Label><Input value={bizName} onChange={e => setBizName(e.target.value)} /></div>
          <div className="grid gap-2"><Label>Email</Label><Input type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} /></div>
          <div className="grid gap-2"><Label>Phone</Label><Input value={bizPhone} onChange={e => setBizPhone(e.target.value)} /></div>
          <Button onClick={handleSaveBiz}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </CardContent>
      </Card>

      {/* Custom Domain & Subdomain */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-5 w-5" /> Domain Settings</CardTitle>
          <CardDescription>Manage your store&apos;s subdomain and custom domain configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subdomain (automatic) */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Your Subdomain</Label>
              <p className="text-xs text-muted-foreground mt-0.5">This is automatically assigned when your account was created</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center h-10 rounded-md border bg-muted/50 px-3 gap-1.5">
                <Link2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-mono">https://</span>
                <span className="text-sm font-mono font-medium text-primary">{subdomain}</span>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" onClick={() => { navigator.clipboard.writeText(`https://${subdomain}`); toast.success('Subdomain URL copied'); }}>
                <Copy className="h-3.5 w-3.5 mr-1.5" />Copy
              </Button>
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => toast.info('Opening subdomain in new tab (mock)')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Active &mdash; SSL certificate valid</span>
            </div>
          </div>

          <Separator />

          {/* Custom Domain */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Custom Domain</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Available on High and Custom plans. Point your domain via CNAME.</p>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50">
                High Plan
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder="e.g. mystore.com.np"
                  value={customDomain}
                  onChange={e => { setCustomDomain(e.target.value); setCustomDomainVerified(false); }}
                />
              </div>
              {customDomain && !customDomainVerified && (
                <Button variant="outline" size="sm" onClick={handleVerifyDns}>
                  Verify DNS
                </Button>
              )}
            </div>

            {customDomain && (
              <>
                {customDomainVerified ? (
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-3 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      <p className="font-medium">Custom Domain Verified</p>
                      <p className="mt-0.5 opacity-80">Your custom domain <span className="font-mono">{customDomain}</span> is now active and serving traffic with SSL.</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      <p className="font-medium">DNS Configuration Required</p>
                      <p className="mt-0.5 opacity-80">Add a CNAME record in your DNS settings pointing <span className="font-mono">{customDomain}</span> to <span className="font-mono">{subdomain}</span>. Then click &quot;Verify DNS&quot; above.</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {!customDomain && (
              <div className="rounded-lg border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-900/20 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                <div className="text-xs text-sky-700 dark:text-sky-300">
                  <p className="font-medium">Setup Instructions</p>
                  <ol className="mt-1 list-decimal ml-3 space-y-0.5 opacity-80">
                    <li>Enter your custom domain above (e.g. mystore.com.np)</li>
                    <li>Log in to your domain registrar and add a CNAME record</li>
                    <li>Point the CNAME to <span className="font-mono">{subdomain}</span></li>
                    <li>Click &quot;Verify DNS&quot; to complete the setup</li>
                  </ol>
                </div>
              </div>
            )}

            <Button onClick={handleSaveDomain}><Save className="h-4 w-4 mr-2" />Save Domain Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'order' as const, label: 'Order Alerts', desc: 'Get notified for new orders and payments' },
            { key: 'stock' as const, label: 'Low Stock Alerts', desc: 'Alert when products fall below minimum stock' },
            { key: 'weekly' as const, label: 'Weekly Reports', desc: 'Receive weekly summary reports via email' },
            { key: 'sms' as const, label: 'SMS Notifications', desc: 'Get SMS alerts for critical updates' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="space-y-0.5"><p className="text-sm font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
              <Switch checked={notif[item.key]} onCheckedChange={v => setNotif({ ...notif, [item.key]: v })} />
            </div>
          ))}
          <Button onClick={handleSaveNotif}><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-5 w-5" /> Display Preferences</CardTitle>
          <CardDescription>Regional and display settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="grid gap-2"><Label>Currency</Label><Input value="NPR (Nepali Rupee)" disabled className="bg-muted" /></div>
          <div className="grid gap-2"><Label>Timezone</Label><div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Asia/Kathmandu (UTC+5:45)</span></div></div>
          <div className="grid gap-2"><Label>Date Format</Label><Input value="DD/MM/YYYY" disabled className="bg-muted" /></div>
        </CardContent>
      </Card>
    </div>
  );
}
