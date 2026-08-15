'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, User, Mail, Phone, MapPin, Shield, Lock, KeyRound, Smartphone, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCurrentProfile } from '@/hooks/use-api-data';
import { getInitials, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { UserProfile } from '@/lib/types';

export default function SAProfile() {
  const mockSuperAdminProfile = useCurrentProfile().data ?? { id: "", name: "", email: "", phone: "", role: "super-admin" as const, joinedAt: "" };

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ ...mockSuperAdminProfile });
  useEffect(() => {
    setProfile(mockSuperAdminProfile);
  }, [mockSuperAdminProfile]);

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully'); };

  // Password strength check
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
    if (score <= 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: 'bg-emerald-500', width: '80%' };
    return { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  const handleChangePassword = () => {
    if (!currentPassword) { toast.error('Please enter your current password'); return; }
    if (newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
    if (currentPassword === newPassword) { toast.error('New password must be different from current password'); return; }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully (mock)');
  };

  const handle2FAToggle = (enabled: boolean) => {
    if (enabled) {
      toast.success('2FA enabled. In production, a QR code would be shown for authenticator app setup.');
    } else {
      toast.info('2FA disabled. Your account is less secure now.');
    }
    setTwoFAEnabled(enabled);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account information">
        {!editing ? <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="h-4 w-4 mr-2" />Edit Profile</Button> : null}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 pb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge className="mt-3 capitalize" variant="outline"><Shield className="h-3 w-3 mr-1" />{profile.role.replace('-', ' ')}</Badge>
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span className="font-medium">{formatDate(profile.joinedAt)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">2FA</span>
                <Badge variant={twoFAEnabled ? 'default' : 'outline'} className={cn('text-[10px] px-1.5', twoFAEnabled && 'bg-emerald-500 hover:bg-emerald-600')}>
                  {twoFAEnabled ? <><CheckCircle2 className="h-3 w-3 mr-1" />Enabled</> : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>Full Name</Label><div className="relative">{editing ? <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><User className="h-4 w-4 text-muted-foreground" /><span>{profile.name}</span></div>}</div></div>
              <div className="grid gap-2"><Label>Email</Label>{editing ? <Input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{profile.email}</span></div>}</div>
              <div className="grid gap-2"><Label>Phone</Label>{editing ? <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>{profile.phone}</span></div>}</div>
              <div className="grid gap-2"><Label>City</Label>{editing ? <Input value={profile.city || ''} onChange={e => setProfile({ ...profile, city: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{profile.city || '—'}</span></div>}</div>
            </div>
            <div className="grid gap-2"><Label>Bio</Label>{editing ? <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} /> : <p className="text-sm text-muted-foreground min-h-[40px] rounded-md border bg-muted/50 p-3">{profile.bio || 'No bio set.'}</p>}</div>
            <div className="grid gap-2"><Label>Address</Label>{editing ? <Input value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{profile.address || '—'}</span></div>}</div>
            {editing && (<div className="flex justify-end"><Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button></div>)}
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPasswordSection ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPasswordSection(true)}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-password">New Password</Label>
                    {newPassword && (
                      <span className={cn(
                        'text-xs font-medium',
                        pwdStrength.label === 'Weak' ? 'text-red-500' :
                        pwdStrength.label === 'Fair' ? 'text-orange-500' :
                        pwdStrength.label === 'Good' ? 'text-yellow-600' : 'text-emerald-600'
                      )}>
                        {pwdStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-300', pwdStrength.color)}
                          style={{ width: pwdStrength.width }}
                        />
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <div className={cn('text-[10px] px-1.5 py-0.5 rounded', newPassword.length >= 8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>8+ chars</div>
                        <div className={cn('text-[10px] px-1.5 py-0.5 rounded', /[A-Z]/.test(newPassword) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>Uppercase</div>
                        <div className={cn('text-[10px] px-1.5 py-0.5 rounded', /[a-z]/.test(newPassword) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>Lowercase</div>
                        <div className={cn('text-[10px] px-1.5 py-0.5 rounded', /[0-9]/.test(newPassword) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>Number</div>
                        <div className={cn('text-[10px] px-1.5 py-0.5 rounded', /[^A-Za-z0-9]/.test(newPassword) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>Special</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button onClick={handleChangePassword} className="flex-1">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Two-Factor Authentication Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                twoFAEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'bg-muted'
              )}>
                {twoFAEnabled
                  ? <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  : <Smartphone className="h-5 w-5 text-muted-foreground" />
                }
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </div>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
          </CardHeader>
          <CardContent>
            {twoFAEnabled ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">2FA is Enabled</p>
                      <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">
                        Your account is protected with two-factor authentication. You will be asked for a verification code when signing in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Authenticator App
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Use an authenticator app like Google Authenticator or Authy to generate verification codes.</p>
                    <div className="flex items-center gap-2 rounded-md bg-background p-2.5 border">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <KeyRound className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-xs">QR Code (Mock)</p>
                        <p className="text-[10px]">Scan with authenticator app</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="backup-code" className="text-xs">Backup Recovery Codes</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456'].map((code) => (
                        <div key={code} className="rounded bg-background border px-2.5 py-1.5 text-xs font-mono text-muted-foreground text-center">
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Store these codes safely. Each can only be used once.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">2FA is Not Enabled</p>
                      <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">
                        We strongly recommend enabling two-factor authentication for your super admin account to prevent unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">How 2FA protects you:</h4>
                  <ul className="space-y-2">
                    {[
                      { icon: Shield, text: 'Requires a verification code in addition to your password' },
                      { icon: Smartphone, text: 'Codes are generated by your authenticator app' },
                      { icon: KeyRound, text: 'Backup codes available if you lose your device' },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/70" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handle2FAToggle(true)}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
