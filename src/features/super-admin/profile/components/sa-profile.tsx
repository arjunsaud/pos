'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { mockSuperAdminProfile } from '@/lib/mock-data';
import { getInitials, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { UserProfile } from '@/lib/types';

export default function SAProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ ...mockSuperAdminProfile });

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully'); };

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
    </div>
  );
}
