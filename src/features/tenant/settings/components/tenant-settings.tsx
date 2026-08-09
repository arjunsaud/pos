'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Bell, Eye, EyeOff, Save, Store, Globe, Clock } from 'lucide-react';
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
