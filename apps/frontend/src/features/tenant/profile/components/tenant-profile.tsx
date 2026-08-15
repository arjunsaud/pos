'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, User, Mail, Phone, MapPin, Calendar, Copy, Link2, Share2, Gift, Users, TrendingUp, CheckCircle2, FileText, Send } from 'lucide-react';
import { useCurrentProfile } from '@/hooks/use-api-data';
import { getInitials, formatDate, nprFull } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { UserProfile } from '@/lib/types';

export default function TenantProfile() {
  const mockTenantAdminProfile = useCurrentProfile().data ?? { id: "", name: "", email: "", phone: "", role: "tenant-admin" as const, joinedAt: "" };

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ ...mockTenantAdminProfile });
  useEffect(() => {
    setProfile(mockTenantAdminProfile);
  }, [mockTenantAdminProfile]);

  const referralLink = `https://posnepal.com/ref/${profile.referralCode}`;

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully'); };
  const copyCode = () => { navigator.clipboard.writeText(profile.referralCode || ''); toast.success('Referral code copied!'); };
  const copyLink = () => { navigator.clipboard.writeText(referralLink); toast.success('Referral link copied!'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account and referral program">
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
            <Badge className="mt-3 capitalize" variant="outline">Tenant Admin</Badge>
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{profile.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">PAN</span><span className="font-mono font-medium">{profile.pan || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{profile.city || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span className="font-medium">{formatDate(profile.joinedAt)}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Details + Referral */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <Card>
            <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label>Full Name</Label>{editing ? <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><User className="h-4 w-4 text-muted-foreground" /><span>{profile.name}</span></div>}</div>
                <div className="grid gap-2"><Label>Email</Label>{editing ? <Input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{profile.email}</span></div>}</div>
                <div className="grid gap-2"><Label>Phone</Label>{editing ? <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>{profile.phone}</span></div>}</div>
                <div className="grid gap-2"><Label>PAN Number</Label>{editing ? <Input value={profile.pan || ''} onChange={e => setProfile({ ...profile, pan: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3 font-mono"><FileText className="h-4 w-4 text-muted-foreground" /><span>{profile.pan || '—'}</span></div>}</div>
              </div>
              <div className="grid gap-2"><Label>Bio</Label>{editing ? <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} /> : <p className="text-sm text-muted-foreground min-h-[40px] rounded-md border bg-muted/50 p-3">{profile.bio || 'No bio set.'}</p>}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label>Address</Label>{editing ? <Input value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{profile.address || '—'}</span></div>}</div>
                <div className="grid gap-2"><Label>City</Label>{editing ? <Input value={profile.city || ''} onChange={e => setProfile({ ...profile, city: e.target.value })} /> : <div className="flex items-center gap-2 h-10 rounded-md border bg-muted/50 px-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{profile.city || '—'}</span></div>}</div>
              </div>
              {editing && (<div className="flex justify-end"><Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button></div>)}
            </CardContent>
          </Card>

          {/* Referral Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Gift className="h-5 w-5 text-primary" /> Referral Program</CardTitle>
              <CardDescription>Share your referral code and earn discounts for each successful referral</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Stats */}
              <div className="grid gap-4 grid-cols-3">
                <div className="rounded-lg border bg-background p-4 text-center"><Users className="h-5 w-5 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">{profile.referralCount || 0}</p><p className="text-xs text-muted-foreground">Total Referrals</p></div>
                <div className="rounded-lg border bg-background p-4 text-center"><TrendingUp className="h-5 w-5 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" /><p className="text-2xl font-bold">NPR {nprFull(profile.referralEarnings || 0)}</p><p className="text-xs text-muted-foreground">Earnings</p></div>
                <div className="rounded-lg border bg-background p-4 text-center"><CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-purple-600 dark:text-purple-400" /><p className="text-2xl font-bold">20%</p><p className="text-xs text-muted-foreground">Per Referral</p></div>
              </div>

              <Separator />

              {/* Referral Code */}
              <div>
                <Label className="mb-2 block">Your Referral Code</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg border bg-background px-4 py-3 text-lg font-bold font-mono tracking-wider text-center">{profile.referralCode}</code>
                  <Button variant="outline" onClick={copyCode}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                </div>
              </div>

              {/* Referral Link */}
              <div>
                <Label className="mb-2 block">Your Referral Link</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground font-mono truncate">{referralLink}</div>
                  <Button variant="outline" onClick={copyLink}><Link2 className="h-4 w-4 mr-2" />Copy Link</Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div>
                <Label className="mb-2 block">Share Via</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success('Share link copied for messaging!')}><Send className="h-4 w-4 mr-2" />Message</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Share link copied for email!')}><Mail className="h-4 w-4 mr-2" />Email</Button>
                  <Button variant="outline" size="sm" onClick={copyLink}><Share2 className="h-4 w-4 mr-2" />Other</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
