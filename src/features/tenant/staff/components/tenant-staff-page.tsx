'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Power, PowerOff } from 'lucide-react';
import { mockTenantStaff } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { StaffMember, TenantStaffRole } from '@/lib/types';
import { getInitials, getRoleBadgeClasses, getStatusBadgeClasses } from '@/lib/helpers';

const PERMISSIONS = [
  { key: 'pos_access', label: 'POS Access' },
  { key: 'view_sales', label: 'View Sales' },
  { key: 'manage_products', label: 'Manage Products' },
  { key: 'manage_inventory', label: 'Manage Inventory' },
  { key: 'view_reports', label: 'View Reports' },
] as const;

interface StaffForm {
  name: string;
  email: string;
  phone: string;
  role: TenantStaffRole | '';
  permissions: string[];
}

const emptyForm: StaffForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  permissions: [],
};

export default function TenantStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([...mockTenantStaff]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm>(emptyForm);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (member: StaffMember) => {
    setEditId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role as TenantStaffRole,
      permissions: member.permissions.includes('all')
        ? PERMISSIONS.map((p) => p.key)
        : [...member.permissions],
    });
    setDialogOpen(true);
  };

  const togglePermission = (key: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) {
      toast.error('Please fill in required fields (Name, Email, Role)');
      return;
    }
    if (editId) {
      setStaff((prev) =>
        prev.map((m) =>
          m.id === editId
            ? {
                ...m,
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: form.role as TenantStaffRole,
                permissions: form.permissions,
              }
            : m
        )
      );
      toast.success('Staff member updated successfully');
    } else {
      const newMember: StaffMember = {
        id: `ts-new-${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role as TenantStaffRole,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
        permissions: form.permissions,
      };
      setStaff((prev) => [newMember, ...prev]);
      toast.success('Staff member added successfully');
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
          : m
      )
    );
    toast.success('Staff status updated');
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Staff Management'>
        <Button onClick={openAdd}>
          <Plus className='h-4 w-4' /> Add Staff
        </Button>
      </PageHeader>

      {/* Table */}
      <Card className='transition-shadow hover:shadow-md'>
        <CardContent className='p-0'>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className='transition-colors hover:bg-muted/50'>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} className='transition-colors hover:bg-muted/50'>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='text-xs'>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-medium'>{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClasses(member.role)} variant='secondary'>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusBadgeClasses(member.status)}
                      variant='secondary'
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {member.permissions.includes('all')
                        ? PERMISSIONS.map((p) => (
                            <Badge key={p.key} variant='outline' className='text-xs'>
                              {p.label}
                            </Badge>
                          ))
                        : member.permissions.map((perm) => {
                            const label = PERMISSIONS.find((p) => p.key === perm)?.label || perm;
                            return (
                              <Badge key={perm} variant='outline' className='text-xs'>
                                {label}
                              </Badge>
                            );
                          })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => openEdit(member)}
                      >
                        <Pencil className='h-3.5 w-3.5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status === 'active' ? (
                          <PowerOff className='h-3.5 w-3.5 text-red-500' />
                        ) : (
                          <Power className='h-3.5 w-3.5 text-emerald-500' />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Update staff member details' : 'Fill in staff member information'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder='Full name'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label>Email *</Label>
                <Input
                  type='email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder='email@example.com'
                />
              </div>
              <div className='grid gap-2'>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder='+977-9800000000'
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label>Role *</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as TenantStaffRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='cashier'>Cashier</SelectItem>
                  <SelectItem value='manager'>Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-3'>
              <Label>Permissions</Label>
              <div className='grid grid-cols-2 gap-2'>
                {PERMISSIONS.map((perm) => (
                  <div key={perm.key} className='flex items-center gap-2'>
                    <Checkbox
                      id={perm.key}
                      checked={form.permissions.includes(perm.key)}
                      onCheckedChange={() => togglePermission(perm.key)}
                    />
                    <Label htmlFor={perm.key} className='text-sm font-normal'>
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Add'} Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
