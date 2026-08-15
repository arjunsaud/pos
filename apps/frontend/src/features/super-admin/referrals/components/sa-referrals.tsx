'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckCircle2, Clock, Gift, Search, Eye, UserPlus, Award } from 'lucide-react';
import { useReferrals } from '@/hooks/use-api-data';
import { cn } from '@/lib/utils';
import { getReferralStatusBadgeClasses, formatDate, nprFull } from '@/lib/helpers';
import type { Referral } from '@/lib/types';

export default function SAReferrals() {
  const mockReferrals = useReferrals().items;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Referral | null>(null);

  const stats = useMemo(() => {
    const total = mockReferrals.length;
    const converted = mockReferrals.filter(r => r.status === 'converted').length;
    const rewarded = mockReferrals.filter(r => r.status === 'rewarded').length;
    const pending = mockReferrals.filter(r => r.status === 'pending').length;
    return { total, converted, rewarded, pending };
  }, []);

  const filtered = useMemo(() => {
    return mockReferrals.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = r.referralCode.toLowerCase().includes(q) || r.referrerTenantName.toLowerCase().includes(q) || r.referredTenantName.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const getRewardLabel = (r: Referral) => {
    if (r.rewardType === 'percentage_discount') return `${r.rewardValue}% discount`;
    if (r.rewardType === 'fixed_discount') return `NPR ${nprFull(r.rewardValue)} off`;
    return `${r.rewardValue} free month${r.rewardValue > 1 ? 's' : ''}`;
  };

  // Referrer stats aggregation
  const referrerStats = useMemo(() => {
    const map = new Map<string, { name: string; total: number; converted: number; rewarded: number; pending: number }>();
    mockReferrals.forEach(r => {
      if (!map.has(r.referrerTenantId)) {
        map.set(r.referrerTenantId, { name: r.referrerTenantName, total: 0, converted: 0, rewarded: 0, pending: 0 });
      }
      const s = map.get(r.referrerTenantId)!;
      s.total++;
      if (r.status === 'converted') s.converted++;
      if (r.status === 'rewarded') s.rewarded++;
      if (r.status === 'pending') s.pending++;
    });
    return Array.from(map.entries()).map(([id, s]) => ({ id, ...s })).sort((a, b) => b.total - a.total);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Referrals" description="Track tenant referrals and rewards" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Referrals', value: stats.total, icon: UserPlus, color: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Rewarded', value: stats.rewarded, icon: Award, color: 'bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500/10', iconColor: 'text-amber-600 dark:text-amber-400' },
        ].map(s => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', s.color)}><s.icon className={cn('h-5 w-5', s.iconColor)} /></div>
              <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referrer Leaderboard */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Top Referrers</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="hover:bg-muted/50"><TableHead>Tenant</TableHead><TableHead className="text-center">Total</TableHead><TableHead className="text-center hidden sm:table-cell">Converted</TableHead><TableHead className="text-center hidden sm:table-cell">Rewarded</TableHead><TableHead className="text-center hidden md:table-cell">Pending</TableHead></TableRow></TableHeader>
              <TableBody>
                {referrerStats.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{r.total}</Badge></TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-emerald-600 dark:text-emerald-400 font-medium">{r.converted}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-purple-600 dark:text-purple-400 font-medium">{r.rewarded}</TableCell>
                    <TableCell className="text-center hidden md:table-cell text-amber-600 dark:text-amber-400 font-medium">{r.pending}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by code or tenant name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="converted">Converted</SelectItem><SelectItem value="rewarded">Rewarded</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="hover:bg-muted/50">
                <TableHead>Referral Code</TableHead><TableHead>Referrer</TableHead><TableHead className="hidden md:table-cell">Referred</TableHead>
                <TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Reward</TableHead><TableHead className="hidden lg:table-cell">Created</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No referrals found.</TableCell></TableRow>
                ) : filtered.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold font-mono">{r.referralCode}</code></TableCell>
                    <TableCell className="font-medium">{r.referrerTenantName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{r.referredTenantName}</TableCell>
                    <TableCell><Badge className={cn('capitalize', getReferralStatusBadgeClasses(r.status))}>{r.status}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-sm">{getRewardLabel(r)}</span></div></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(r)}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (<>
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Gift className="h-5 w-5" /> Referral Detail</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Referral Code</p><p className="font-mono font-bold">{selected.referralCode}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge className={cn('capitalize', getReferralStatusBadgeClasses(selected.status))}>{selected.status}</Badge></div>
                <div><p className="text-muted-foreground">Referrer</p><p className="font-medium">{selected.referrerTenantName}</p></div>
                <div><p className="text-muted-foreground">Referred</p><p className="font-medium">{selected.referredTenantName}</p></div>
                <div><p className="text-muted-foreground">Reward</p><p className="font-medium">{getRewardLabel(selected)}</p></div>
                <div><p className="text-muted-foreground">Created</p><p className="font-medium">{formatDate(selected.createdAt)}</p></div>
                {selected.convertedAt && <div className="col-span-2"><p className="text-muted-foreground">Converted At</p><p className="font-medium">{formatDate(selected.convertedAt)}</p></div>}
              </div>
            </div>
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
