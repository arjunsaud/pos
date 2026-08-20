'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserAvatar } from '@/components/shared/user-avatar';
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
import { Plus, Pencil, Power, PowerOff, X } from 'lucide-react';
import { useTenantStaff } from '@/hooks/use-api-data';
import { toast } from 'sonner';
import type { StaffMember, TenantStaffRole } from '@/lib/types';
import { getRoleBadgeClasses, getStatusBadgeClasses } from '@/lib/helpers';
import { cn } from '@/lib/utils';

function getAvatarColor(name: string): string {
  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500',
    'bg-cyan-500', 'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  manager: 'Full access to all features including settings',
  cashier: 'Access to POS terminal and sales history',
};

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
  const { items: mockTenantStaff, create, update, setActive } = useTenantStaff();

  const [staff, setStaff] = useState<StaffMember[]>([...mockTenantStaff]);
  useEffect(() => {
    setStaff(mockTenantStaff);
  }, [mockTenantStaff]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [customPerm, setCustomPerm] = useState('');

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setCustomPerm('');
    setDialogOpen(true);
  };

  const openEdit = (member: StaffMember) => {
    setEditId(member.id);
    const perms = member.permissions.includes('all')
      ? PERMISSIONS.map((p) => p.key)
      : [...member.permissions];
    // Also add any custom permissions not in the predefined list
    member.permissions.forEach((perm) => {
      if (!PERMISSIONS.some((p) => p.key === perm) && !perms.includes(perm)) {
        perms.push(perm);
      }
    });
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role as TenantStaffRole,
      permissions: perms,
    });
    setCustomPerm('');
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

  const addCustomPermission = () => {
    const key = customPerm.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key) return;
    if (form.permissions.includes(key)) {
      toast.error('Permission already added');
      return;
    }
    setForm((prev) => ({
      ...prev,
      permissions: [...prev.permissions, key],
    }));
    setCustomPerm('');
  };

  const removePermission = (key: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p !== key),
    }));
  };

  const getPermissionLabel = (key: string): string => {
    const found = PERMISSIONS.find((p) => p.key === key);
    if (found) return found.label;
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.role) {
      toast.error('Please fill in required fields (Name, Email, Role)');
      return;
    }
    const phone = form.phone.replace(/\D/g, '').slice(-10);
    try {
      if (editId) {
        await update(editId, {
          fullName: form.name,
          mobileNumber: phone.length === 10 ? phone : undefined,
          tenantStaffRole: form.role,
          permissions: form.permissions,
        });
        toast.success('Staff member updated successfully');
      } else {
        await create({
          fullName: form.name,
          email: form.email,
          password: 'Test@123',
          mobileNumber: phone.length === 10 ? phone : undefined,
          tenantStaffRole: form.role,
          permissions: form.permissions,
        });
        toast.success('Staff member added. Default password is Test@123');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Failed to save staff member');
    }
  };

  const toggleStatus = async (id: string) => {
    const member = staff.find((m) => m.id === id);
    if (!member) return;
    try {
      await setActive(id, member.status !== 'active');
      toast.success('Staff status updated');
    } catch {
      toast.error('Failed to update staff status');
    }
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
                      <div className={cn(
                        'h-2 w-2 rounded-full shrink-0',
                        member.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                      )} />
                      <UserAvatar
                        name={member.name}
                        src={member.avatar}
                        className='h-8 w-8'
                        fallbackClassName={cn('text-xs text-white', getAvatarColor(member.name))}
                      />
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
              {form.role && ROLE_DESCRIPTIONS[form.role] && (
                <p className='text-xs text-muted-foreground'>
                  {ROLE_DESCRIPTIONS[form.role]}
                </p>
              )}
            </div>
            <div className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <Label>Permissions</Label>
                {form.permissions.length > 0 && (
                  <span className='text-xs text-muted-foreground'>
                    {form.permissions.length} permission{form.permissions.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              {/* Permission badges */}
              {form.permissions.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {form.permissions.map((key) => (
                    <Badge
                      key={key}
                      variant='outline'
                      className='gap-1 pr-1 text-xs'
                    >
                      {getPermissionLabel(key)}
                      <button
                        type='button'
                        onClick={() => removePermission(key)}
                        className='ml-0.5 rounded-full p-0.5 hover:bg-muted'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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
              {/* Custom permission input */}
              <div className='flex items-center gap-2'>
                <Input
                  value={customPerm}
                  onChange={(e) => setCustomPerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPermission())}
                  placeholder='Add custom permission...'
                  className='h-8 text-sm'
                />
                <Button type='button' variant='outline' size='sm' onClick={addCustomPermission}>
                  Add
                </Button>
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
