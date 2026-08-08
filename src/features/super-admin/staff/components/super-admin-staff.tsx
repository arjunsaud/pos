'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Pencil, Power, Search } from 'lucide-react';
import { toast } from 'sonner';
import { mockSuperAdminStaff } from '@/lib/mock-data';
import type { StaffMember, SuperAdminStaffRole } from '@/lib/types';
import { cn } from '@/lib/utils';

function getAvatarColor(name: string): string {
  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500',
    'bg-cyan-500', 'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_DESCRIPTIONS: Record<SuperAdminStaffRole, string> = {
  admin: 'Full platform access with all management capabilities',
  support: 'Can view tenants and respond to support tickets',
  finance: 'Access to billing, invoices and financial reports',
};

const roleBadgeClass: Record<SuperAdminStaffRole, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  support: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const PERMISSIONS = [
  { key: 'view_tenants', label: 'View Tenants' },
  { key: 'view_tickets', label: 'View Tickets' },
  { key: 'respond_tickets', label: 'Respond Tickets' },
  { key: 'view_revenue', label: 'View Revenue' },
  { key: 'view_subscriptions', label: 'View Subscriptions' },
  { key: 'manage_invoices', label: 'Manage Invoices' },
] as const;

export default function SuperAdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([...mockSuperAdminStaff]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [search, setSearch] = useState('');

  const filteredStaff = useMemo(() => {
    if (!search.trim()) return staff;
    const q = search.toLowerCase();
    return staff.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [staff, search]);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<SuperAdminStaffRole>('support');
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('support');
    setFormPermissions([]);
  };

  const openEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setFormRole(member.role as SuperAdminStaffRole);
    setFormPermissions(
      member.permissions.includes('all')
        ? PERMISSIONS.map((p) => p.key)
        : [...member.permissions]
    );
    setEditOpen(true);
  };

  const handleAddStaff = () => {
    const newMember: StaffMember = {
      id: `sa-${Date.now()}`,
      name: formName,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: formPermissions,
    };
    setStaff((prev) => [newMember, ...prev]);
    toast.success('Staff member added (mock)');
    setAddOpen(false);
    resetForm();
  };

  const handleEditStaff = () => {
    if (!editingStaff) return;
    setStaff((prev) =>
      prev.map((m) =>
        m.id === editingStaff.id
          ? {
              ...m,
              name: formName,
              email: formEmail,
              phone: formPhone,
              role: formRole,
              permissions: formPermissions,
            }
          : m
      )
    );
    toast.success('Staff member updated (mock)');
    setEditOpen(false);
    resetForm();
  };

  const togglePermission = (key: string) => {
    setFormPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleStatus = (member: StaffMember) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    setStaff((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m))
    );
    toast.success(
      `${member.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`
    );
  };

  const renderPermissionTags = (member: StaffMember) => {
    if (member.permissions.includes('all')) {
      return <Badge variant="outline" className="text-xs">All Permissions</Badge>;
    }
    const permLabels = member.permissions.map((key) => {
      const found = PERMISSIONS.find((p) => p.key === key);
      return found ? found.label : key.replace(/_/g, ' ');
    });
    const visible = permLabels.slice(0, 3);
    const remaining = permLabels.length - 3;
    return (
      <>
        {visible.map((label, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            {label}
          </Badge>
        ))}
        {remaining > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remaining} more
          </Badge>
        )}
      </>
    );
  };

  const formContent = (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="staff-name">Name</Label>
        <Input
          id="staff-name"
          placeholder="Full name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="staff-email">Email</Label>
        <Input
          id="staff-email"
          type="email"
          placeholder="email@posnepal.com"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="staff-phone">Phone</Label>
        <Input
          id="staff-phone"
          placeholder="+977-98XXXXXXXX"
          value={formPhone}
          onChange={(e) => setFormPhone(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="staff-role">Role</Label>
        <Select value={formRole} onValueChange={(v: SuperAdminStaffRole) => setFormRole(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {ROLE_DESCRIPTIONS[formRole]}
        </p>
      </div>
      <div className="grid gap-3">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2">
          {PERMISSIONS.map((perm) => (
            <div key={perm.key} className="flex items-center gap-2">
              <Checkbox
                id={`perm-${perm.key}`}
                checked={formPermissions.includes(perm.key)}
                onCheckedChange={() => togglePermission(perm.key)}
              />
              <Label htmlFor={`perm-${perm.key}`} className="text-sm font-normal cursor-pointer">
                {perm.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management">
        <div className="relative w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff</DialogTitle>
              <DialogDescription>
                Create a new staff account with specific roles and permissions.
              </DialogDescription>
            </DialogHeader>
            {formContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff}>Add Staff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Staff Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="transition-colors hover:bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id} className="transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-2 w-2 rounded-full shrink-0',
                        member.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                      )} />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn('text-xs text-white', getAvatarColor(member.name))}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {member.phone}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('border-transparent', roleBadgeClass[member.role as SuperAdminStaffRole])}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'border-transparent',
                        member.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 items-center">
                      <Badge className={cn('border-transparent', roleBadgeClass[member.role as SuperAdminStaffRole])}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                      {renderPermissionTags(member)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(member)}>
                        <Power className="h-4 w-4" />
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff details and permissions.</DialogDescription>
          </DialogHeader>
          {formContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
