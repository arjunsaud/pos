'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, MapPin, Building, Phone, Check } from 'lucide-react';
import { useOutlets } from '@/hooks/use-api-data';
import type { Outlet } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store';

// ---------- Form ----------
interface OutletForm {
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

const emptyForm: OutletForm = {
  name: '',
  address: '',
  city: '',
  phone: '',
  isDefault: false,
};

// ---------- Component ----------
export default function TenantOutlets() {
  const mockOutlets = useOutlets().items;

  const { user } = useAuthStore();
  const tenantId = user?.tenantId || '';

  const [outlets, setOutlets] = useState<Outlet[]>(
    () => mockOutlets.filter((o) => o.tenantId === tenantId)
  );
  useEffect(() => {
    setOutlets(mockOutlets.filter((o) => o.tenantId === tenantId));
  }, [mockOutlets, tenantId]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<OutletForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ---------- Derived stats ----------
  const stats = useMemo(() => {
    const total = outlets.length;
    const active = outlets.filter((o) => o.status === 'active').length;
    return { total, active };
  }, [outlets]);

  // ---------- Filtered ----------
  const filtered = useMemo(() => {
    return outlets.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch = o.name.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [outlets, search, statusFilter]);

  // ---------- CRUD handlers ----------
  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (outlet: Outlet) => {
    setEditId(outlet.id);
    setForm({
      name: outlet.name,
      address: outlet.address,
      city: outlet.city,
      phone: outlet.phone,
      isDefault: outlet.isDefault,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Outlet name is required');
      return;
    }

    if (editId) {
      // When setting a new default, unset the previous one
      let updated = [...outlets];
      if (form.isDefault) {
        updated = updated.map((o) => ({ ...o, isDefault: false }));
      }
      setOutlets((prev) =>
        prev.map((o) =>
          o.id === editId
            ? {
                ...o,
                name: form.name.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                phone: form.phone.trim(),
                isDefault: form.isDefault,
              }
            : form.isDefault
              ? { ...o, isDefault: false }
              : o
        )
      );
      toast.success('Outlet updated successfully');
    } else {
      const newOutlet: Outlet = {
        id: `out-new-${Date.now()}`,
        tenantId,
        name: form.name.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        isDefault: form.isDefault
          ? true
          : outlets.length === 0,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      // If the new outlet is default, unset previous defaults
      if (newOutlet.isDefault) {
        setOutlets((prev) => [
          newOutlet,
          ...prev.map((o) => ({ ...o, isDefault: false })),
        ]);
      } else {
        setOutlets((prev) => [newOutlet, ...prev]);
      }
      toast.success('Outlet added successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const outlet = outlets.find((o) => o.id === deleteId);
    if (outlet?.isDefault) {
      toast.error('Cannot delete the default outlet');
      setDeleteId(null);
      return;
    }
    setOutlets((prev) => prev.filter((o) => o.id !== deleteId));
    toast.success('Outlet deleted successfully');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Outlets">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Outlet
        </Button>
      </PageHeader>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Outlets"
          value={stats.total}
          icon={Building}
          iconClassName="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Active Outlets"
          value={stats.active}
          icon={MapPin}
          iconClassName="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1" style={{ minWidth: '180px' }}>
            <Label className="mb-1.5">Search</Label>
            <Input
              placeholder="Search outlets by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Address
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    City
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Phone
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No outlets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((outlet) => (
                    <TableRow
                      key={outlet.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      {/* Name */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="font-medium">{outlet.name}</span>
                        </div>
                      </TableCell>

                      {/* Address */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {outlet.address}
                        </div>
                      </TableCell>

                      {/* City */}
                      <TableCell className="hidden md:table-cell">
                        {outlet.city}
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {outlet.phone}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={cn(
                            'capitalize',
                            outlet.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          )}
                        >
                          {outlet.status}
                        </Badge>
                      </TableCell>

                      {/* Default */}
                      <TableCell>
                        {outlet.isDefault ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(outlet)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => setDeleteId(outlet.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {outlets.length} outlet
                {outlets.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Outlet' : 'Add Outlet'}
            </DialogTitle>
            <DialogDescription>
              {editId
                ? 'Update outlet details below.'
                : 'Fill in the outlet information to add a new outlet.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Main Branch"
              />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="e.g. Putalisadak"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  placeholder="e.g. Kathmandu"
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="+977-98XXXXXXXX"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="is-default">Set as Default Outlet</Label>
                <p className="text-xs text-muted-foreground">
                  This outlet will be selected by default across the system.
                </p>
              </div>
              <Switch
                id="is-default"
                checked={form.isDefault}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isDefault: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editId ? 'Update' : 'Add'} Outlet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outlet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this outlet? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
