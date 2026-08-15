'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useDocuments, useTenants } from '@/hooks/use-api-data';
import type { TenantDocument, DocumentType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTenantSelectorStore } from '@/features/auth/store';

const docTypeBadgeClasses: Record<DocumentType, string> = {
  pan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  vat: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  business_license: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  bank_statement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const docStatusBadgeClasses: Record<TenantDocument['status'], string> = {
  verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const docTypeLabels: Record<DocumentType, string> = {
  pan: 'PAN',
  vat: 'VAT',
  business_license: 'Business License',
  bank_statement: 'Bank Statement',
  other: 'Other',
};

const typeFilters: { label: string; value: DocumentType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'PAN', value: 'pan' },
  { label: 'VAT', value: 'vat' },
  { label: 'Business License', value: 'business_license' },
  { label: 'Bank Statement', value: 'bank_statement' },
  { label: 'Other', value: 'other' },
];

const statusFilters: { label: string; value: TenantDocument['status'] | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Verified', value: 'verified' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
];

interface DocumentFormData {
  tenantId: string;
  type: DocumentType;
  name: string;
  fileName: string;
  status: TenantDocument['status'];
}

const emptyForm: DocumentFormData = {
  tenantId: '',
  type: 'pan',
  name: '',
  fileName: '',
  status: 'pending',
};

export default function DocumentsPage() {
  const mockTenantDocuments = useDocuments().items;
  const mockTenants = useTenants().items;

  const [documents, setDocuments] = useState<TenantDocument[]>(mockTenantDocuments);

  useEffect(() => {

    setDocuments(mockTenantDocuments);

  }, [mockTenantDocuments]);
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TenantDocument['status'] | 'all'>('all');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const selectedTenantId = useTenantSelectorStore(s => s.selectedTenantId);

  // Auto-filter when tenant selected in sidebar
  React.useEffect(() => {
    if (selectedTenantId) setTenantFilter(selectedTenantId);
  }, [selectedTenantId]);

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TenantDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<TenantDocument | null>(null);
  const [form, setForm] = useState<DocumentFormData>(emptyForm);

  // Unique tenants from documents
  const tenantOptions = useMemo(() => {
    const seen = new Set<string>();
    return documents.filter((d) => {
      if (seen.has(d.tenantId)) return false;
      seen.add(d.tenantId);
      return true;
    }).map((d) => ({ id: d.tenantId, name: d.tenantName }));
  }, [documents]);

  // Filtered documents
  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchType = typeFilter === 'all' || d.type === typeFilter;
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchTenant = tenantFilter === 'all' || d.tenantId === tenantFilter;
      return matchType && matchStatus && matchTenant;
    });
  }, [documents, typeFilter, statusFilter, tenantFilter]);

  // Summary stats
  const totalDocs = documents.length;
  const verifiedDocs = documents.filter((d) => d.status === 'verified').length;
  const pendingDocs = documents.filter((d) => d.status === 'pending').length;
  const rejectedDocs = documents.filter((d) => d.status === 'rejected').length;

  // Form helpers
  const resetForm = () => setForm(emptyForm);

  const handleOpenAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleOpenEdit = (doc: TenantDocument) => {
    setEditingDoc(doc);
    setForm({
      tenantId: doc.tenantId,
      type: doc.type,
      name: doc.name,
      fileName: doc.fileName,
      status: doc.status,
    });
    setEditOpen(true);
  };

  const handleOpenDelete = (doc: TenantDocument) => {
    setDeletingDoc(doc);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    if (!tenant || !form.name || !form.fileName) {
      toast.error('Please fill all required fields');
      return;
    }
    const newDoc: TenantDocument = {
      id: `doc-${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      type: form.type,
      name: form.name,
      fileName: form.fileName,
      fileSize: '0 KB',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: form.status,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    toast.success(`Document added: ${form.name}`);
    setAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingDoc) return;
    const tenant = mockTenants.find((t) => t.id === form.tenantId);
    if (!tenant || !form.name || !form.fileName) {
      toast.error('Please fill all required fields');
      return;
    }
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === editingDoc.id
          ? {
              ...d,
              tenantId: tenant.id,
              tenantName: tenant.name,
              type: form.type,
              name: form.name,
              fileName: form.fileName,
              status: form.status,
            }
          : d
      )
    );
    toast.success(`Document updated: ${form.name}`);
    setEditOpen(false);
    setEditingDoc(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deletingDoc) return;
    setDocuments((prev) => prev.filter((d) => d.id !== deletingDoc.id));
    toast.success(`Document deleted: ${deletingDoc.name}`);
    setDeleteOpen(false);
    setDeletingDoc(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Manage tenant documents and verification">
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Document
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Documents" value={totalDocs} icon={FileText} />
        <StatCard title="Verified" value={verifiedDocs} icon={CheckCircle} borderColor="border-l-emerald-500" />
        <StatCard title="Pending" value={pendingDocs} icon={Clock} borderColor="border-l-amber-500" />
        <StatCard title="Rejected" value={rejectedDocs} icon={XCircle} borderColor="border-l-red-500" />
      </div>

      {/* Documents Table */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={typeFilter === f.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {statusFilters.map((f) => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <div className="pt-2">
            <Select value={tenantFilter} onValueChange={setTenantFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {mockTenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableHead>Document Name</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">File Name</TableHead>
                  <TableHead className="hidden md:table-cell">File Size</TableHead>
                  <TableHead className="hidden lg:table-cell">Uploaded Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((doc) => (
                    <TableRow key={doc.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium max-w-[180px] truncate">{doc.name}</TableCell>
                      <TableCell>{doc.tenantName}</TableCell>
                      <TableCell>
                        <Badge className={cn('border-0', docTypeBadgeClasses[doc.type])}>
                          {docTypeLabels[doc.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground max-w-[160px] truncate">{doc.fileName}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{doc.fileSize}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{doc.uploadedAt}</TableCell>
                      <TableCell>
                        <Badge className={cn('border-0', docStatusBadgeClasses[doc.status])}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenEdit(doc)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleOpenDelete(doc)}>
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

      {/* Add Document Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Upload a new document for a tenant.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-d-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="add-d-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-d-type">Document Type</Label>
              <Select value={form.type} onValueChange={(v: DocumentType) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger id="add-d-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pan">PAN</SelectItem>
                  <SelectItem value="vat">VAT</SelectItem>
                  <SelectItem value="business_license">Business License</SelectItem>
                  <SelectItem value="bank_statement">Bank Statement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-d-name">Document Name</Label>
              <Input id="add-d-name" placeholder="e.g., PAN Certificate" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-d-file">File Name</Label>
              <Input id="add-d-file" placeholder="e.g., document.pdf" value={form.fileName} onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Mock upload — enter the file name manually.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-d-status">Status</Label>
              <Select value={form.status} onValueChange={(v: TenantDocument['status']) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger id="add-d-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAdd}>Add Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Update document: {editingDoc?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-d-tenant">Tenant</Label>
              <Select value={form.tenantId} onValueChange={(v) => setForm((f) => ({ ...f, tenantId: v }))}>
                <SelectTrigger id="edit-d-tenant"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {mockTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-d-type">Document Type</Label>
              <Select value={form.type} onValueChange={(v: DocumentType) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger id="edit-d-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pan">PAN</SelectItem>
                  <SelectItem value="vat">VAT</SelectItem>
                  <SelectItem value="business_license">Business License</SelectItem>
                  <SelectItem value="bank_statement">Bank Statement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-d-name">Document Name</Label>
              <Input id="edit-d-name" placeholder="e.g., PAN Certificate" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-d-file">File Name</Label>
              <Input id="edit-d-file" placeholder="e.g., document.pdf" value={form.fileName} onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-d-status">Status</Label>
              <Select value={form.status} onValueChange={(v: TenantDocument['status']) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger id="edit-d-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setEditingDoc(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingDoc?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteOpen(false); setDeletingDoc(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
