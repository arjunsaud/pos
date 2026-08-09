'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Tag, Percent, Gift, Calendar, Copy, CheckCircle2, Clock, Pause, XCircle } from 'lucide-react';
import { mockPromotions } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getPromotionStatusBadgeClasses, getPromotionValueDisplay, formatDate } from '@/lib/helpers';
import type { Promotion, PromotionStatus, PromotionType } from '@/lib/types';

interface PromoForm {
  code: string; name: string; description: string; type: PromotionType;
  value: number; status: PromotionStatus; maxUses: number; validFrom: string; validUntil: string;
}

const emptyForm: PromoForm = {
  code: '', name: '', description: '', type: 'percentage',
  value: 0, status: 'active', maxUses: 100, validFrom: '', validUntil: '',
};

export default function SAPromotions() {
  const [promos, setPromos] = useState<Promotion[]>([...mockPromotions]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = promos.length;
    const active = promos.filter(p => p.status === 'active').length;
    const totalUses = promos.reduce((s, p) => s + p.usedCount, 0);
    const activeCodes = promos.filter(p => p.status === 'active');
    const convRate = activeCodes.length > 0
      ? Math.round((activeCodes.reduce((s, p) => s + p.usedCount, 0) / activeCodes.reduce((s, p) => s + p.maxUses, 0)) * 100)
      : 0;
    return { total, active, totalUses, convRate };
  }, [promos]);

  const filtered = useMemo(() => {
    return promos.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [promos, search, statusFilter]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Promotion) => {
    setEditId(p.id);
    setForm({ code: p.code, name: p.name, description: p.description, type: p.type, value: p.value, status: p.status, maxUses: p.maxUses, validFrom: p.validFrom, validUntil: p.validUntil });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code || !form.name) { toast.error('Code and Name are required'); return; }
    if (editId) {
      setPromos(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p));
      toast.success('Promotion updated');
    } else {
      const np: Promotion = { ...form, id: `promo-${Date.now()}`, usedCount: 0, createdAt: new Date().toISOString().slice(0, 10), createdBy: 'Super Admin' };
      setPromos(prev => [np, ...prev]);
      toast.success('Promotion created');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (!deleteId) return; setPromos(prev => prev.filter(p => p.id !== deleteId)); toast.success('Promotion deleted'); setDeleteId(null); };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success(`Code "${code}" copied!`); };

  return (
    <div className="space-y-6">
      <PageHeader title="Promotions" description="Manage discount codes and promotional offers">
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Create Promotion</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Promotions', value: stats.total, icon: Tag, color: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Uses', value: stats.totalUses, icon: Gift, color: 'bg-amber-500/10', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'Conversion Rate', value: `${stats.convRate}%`, icon: Percent, color: 'bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400' },
        ].map(s => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', s.color)}><s.icon className={cn('h-5 w-5', s.iconColor)} /></div>
              <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by code or name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="hover:bg-muted/50">
                <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Value</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Usage</TableHead>
                <TableHead className="hidden lg:table-cell">Valid Until</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">No promotions found.</TableCell></TableRow>
                ) : filtered.map(p => (
                  <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell><div className="flex items-center gap-2"><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold font-mono">{p.code}</code><button onClick={() => copyCode(p.code)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button></div></TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize text-muted-foreground">{p.type.replace('_', ' ')}</TableCell>
                    <TableCell className="font-medium">{getPromotionValueDisplay(p.type, p.value)}</TableCell>
                    <TableCell><Badge className={cn('capitalize', getPromotionStatusBadgeClasses(p.status))}>{p.status}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{p.usedCount}/{p.maxUses}</span><span>{Math.round((p.usedCount / p.maxUses) * 100)}%</span></div><div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (p.usedCount / p.maxUses) * 100)}%` }} /></div></div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(p.validUntil)}</TableCell>
                    <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteId(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle><DialogDescription>{editId ? 'Update promotion details' : 'Create a new discount code'}</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Code <span className="text-red-500">*</span></Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="LAUNCH2025" className="font-mono" /></div>
              <div className="grid gap-2"><Label>Name <span className="text-red-500">*</span></Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Promotion name" /></div>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this promotion..." rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Type</Label><Select value={form.type} onValueChange={v => setForm({ ...form, type: v as PromotionType })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="trial_extension">Trial Extension</SelectItem><SelectItem value="free_month">Free Month</SelectItem></SelectContent></Select></div>
              <div className="grid gap-2"><Label>Value</Label><Input type="number" value={form.value || ''} onChange={e => setForm({ ...form, value: Number(e.target.value) })} placeholder="e.g. 20" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v as PromotionStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="expired">Expired</SelectItem></SelectContent></Select></div>
              <div className="grid gap-2"><Label>Max Uses</Label><Input type="number" value={form.maxUses || ''} onChange={e => setForm({ ...form, maxUses: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Valid From</Label><Input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Valid Until</Label><Input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Promotion</AlertDialogTitle><AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
