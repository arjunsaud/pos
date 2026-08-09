'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { mockContracts, mockTenants } from '@/lib/mock-data';
import type { Contract, ContractStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { nprFull } from '@/lib/helpers';

const contractStatusBadgeClasses: Record<ContractStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  terminated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const contractTypeBadgeClasses: Record<Contract['type'], string> = {
  service: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  license: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  custom: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const statusFilters: { label: string; value: ContractStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Draft', value: 'draft' },
  { label: 'Terminated', value: 'terminated' },
];

const typeFilters: { label: string; value: Contract['type'] | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Service', value: 'service' },
  { label: 'License', value: 'license' },
  { label: 'Custom', value: 'custom' },
];

interface ContractFormData {
  tenantId: string;
  title: string;
  type: Contract['type'];
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: string;
  description: string;
}

const emptyForm: ContractFormData = {
  tenantId: '',
  title: '',
  type: 'service',
  status: 'draft',
  startDate: '',
  endDate: '',
  value: '',
  description: '',
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Contract['type'] | 'all'>('all');

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deletingContract, setDeletingContract] = useState<Contract | null>(null);
  const [form, setForm] = useState<ContractFormData>(emptyForm);

  // Filtered contracts
  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchType = typeFilter === 'all' || c.type === typeFilter;
      return matchStatus && matchType;
    });
  }, [contracts, statusFilter, typeFilter]);

  // Summary stats
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter((c) => c.status === 'active').length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const expiringSoon = contracts.filter((c) => {
    if (c.status !== 'active') return false;
    const end = new Date(c.endDate);
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff <= thirtyDays;
  }).length;

  // Form helpers
  const resetForm = () => setForm(emptyForm);

  const handleOpenAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleOpenEdit = (contract: Contract) => {
    setEditingContract(contract);
    setForm({
      tenantId: contract.tenantId,
      title: contract.title,
      type: contract.type,
      status: contract.status,
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: String(contract.value),
      description: contract.description,
    });
    setEditOpen(true);
  };

  const handleOpenDelete = (contract: Contract) => {
    setDeletingContract(contract);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    if (!tenant || !form.title || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    const newContract: Contract = {
      id: `ct-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      title: form.title,
      type: form.type,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      value: parseFloat(form.value) || 0,
      currency: 'NPR',
      description: form.description,
    };
    setContracts((prev) => [newContract, ...prev]);
    toast.success(`Contract added: ${form.title}`);
    setAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingContract) return;
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    if (!tenant || !form.title || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setContracts((prev) =>
      prev.map((c) =>
        c.id === editingContract.id
          ? {
              ...c,
              tenantId: tenant.id,
              tenantName: tenant.name,
              title: form.title,
              type: form.type,
              status: form.status,
              startDate: form.startDate,
              endDate: form.endDate,
              value: parseFloat(form.value) || 0,
              description: form.description,
            }
          : c
      )
    );
    toast.success(`Contract updated: ${form.title}`);
    setEditOpen(false);
    setEditingContract(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deletingContract) return;
    setContracts((prev) => prev.filter((c) => c.id !== deletingContract.id));
    toast.success(`Contract deleted: ${deletingContract.title}`);
    setDeleteOpen(false);
    setDeletingContract(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contracts" description="Manage tenant contracts and agreements">
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contract
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Contracts" value={totalContracts} icon={FileText} />
        <StatCard title="Active" value={activeContracts} icon={CheckCircle} borderColor="border-l-emerald-500" />
        <StatCard title="Total Value" value={`NPR ${nprFull(totalValue)}`} icon={FileText} borderColor="border-l-amber-500" />
        <StatCard title="Expiring Soon" value={expiringSoon} icon={AlertTriangle} borderColor="border-l-red-500" />
      </div>

      {/* Contracts Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={statusFilter === f.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={typeFilter === f.value ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setTypeFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Start Date</TableHead>
                  <TableHead className="hidden md:table-cell">End Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No contracts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((contract) => (
                    <TableRow key={contract.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium max-w-[200px] truncate">{contract.title}</TableCell>
                      <TableCell>{contract.tenantName}</TableCell>
                      <TableCell>
                        <Badge className={cn('border-0', contractTypeBadgeClasses[contract.type])}>
                          {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border-0', contractStatusBadgeClasses[contract.status])}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{contract.startDate}</TableCell>
                      <TableCell className="hidden md:table-cell">{contract.endDate}</TableCell>
                      <TableCell>NPR {nprFull(contract.value)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenEdit(contract)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleOpenDelete(contract)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Contract Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Contract</DialogTitle>
            <DialogDescription>Create a new contract for a tenant.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="add-c-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="add-c-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-c-title">Title</Label>
              <Input id="add-c-title" placeholder="Contract title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-c-type">Type</Label>
                <Select value={form.type} onValueChange={(v: Contract['type']) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger id="add-c-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-c-status">Status</Label>
                <Select value={form.status} onValueChange={(v: ContractStatus) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger id="add-c-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-c-start">Start Date</Label>
                <Input id="add-c-start" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-c-end">End Date</Label>
                <Input id="add-c-end" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-c-value">Value (NPR)</Label>
              <Input id="add-c-value" type="number" placeholder="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-c-desc">Description</Label>
              <Textarea id="add-c-desc" placeholder="Contract description..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAdd}>Add Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contract Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update contract: {editingContract?.title}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="edit-c-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="edit-c-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-c-title">Title</Label>
              <Input id="edit-c-title" placeholder="Contract title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-c-type">Type</Label>
                <Select value={form.type} onValueChange={(v: Contract['type']) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger id="edit-c-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-c-status">Status</Label>
                <Select value={form.status} onValueChange={(v: ContractStatus) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger id="edit-c-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-c-start">Start Date</Label>
                <Input id="edit-c-start" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-c-end">End Date</Label>
                <Input id="edit-c-end" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-c-value">Value (NPR)</Label>
              <Input id="edit-c-value" type="number" placeholder="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-c-desc">Description</Label>
              <Textarea id="edit-c-desc" placeholder="Contract description..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setEditingContract(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingContract?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteOpen(false); setDeletingContract(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
