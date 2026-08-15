'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  DEFAULT_INVOICE_HTML,
  DEFAULT_RECEIPT_HTML,
  PRINT_TEMPLATE_VARIABLES,
  PrintTemplateType,
  renderPrintTemplate,
} from '@posnepal/shared';
import { apiPaths } from '@/lib/api';
import { useResource } from '@/hooks/use-api-data';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  EditorModeToggle,
  HtmlSourceEditor,
  RichTextEditor,
} from '@/components/shared/rich-text-editor';

interface PrintTemplateRow {
  id: string;
  type: PrintTemplateType;
  name: string;
  html: string;
  paperSize: string;
  isDefault: boolean;
  isActive: boolean;
}

const emptyForm = {
  type: 'receipt' as PrintTemplateType,
  name: '',
  html: DEFAULT_RECEIPT_HTML,
  paperSize: '80mm',
  isDefault: true,
  isActive: true,
};

export default function TemplatesPage() {
  const templates = useResource<PrintTemplateRow>(apiPaths.admin.template);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(
    () =>
      renderPrintTemplate(form.html, {
        storeName: 'Demo Store',
        storeAddress: 'Kathmandu, Nepal',
        storePan: '309876543',
        storePhone: '+977-9800000000',
        invoiceNumber: 'INV-1001',
        date: new Date().toLocaleString(),
        cashier: 'Admin',
        customerName: 'Walk-in Customer',
        customerPan: '',
        items: [
          { name: 'Milk 1L', quantity: 2, price: '80.00', lineTotal: '160.00' },
          { name: 'Bread', quantity: 1, price: '55.00', lineTotal: '55.00' },
        ],
        subtotal: '215.00',
        vat: '27.95',
        discount: '0.00',
        total: '242.95',
        paymentMethod: 'cash',
        footer: 'Thank you for shopping with us!',
      }),
    [form.html],
  );

  const openCreate = (type: PrintTemplateType) => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      type,
      name: type === 'receipt' ? 'POS receipt' : 'Tax invoice',
      html: type === 'receipt' ? DEFAULT_RECEIPT_HTML : DEFAULT_INVOICE_HTML,
      paperSize: type === 'receipt' ? '80mm' : 'a4',
    });
    setSource(false);
    setOpen(true);
  };

  const openEdit = (row: PrintTemplateRow) => {
    setEditingId(row.id);
    setForm({
      type: row.type,
      name: row.name,
      html: row.html,
      paperSize: row.paperSize || (row.type === 'receipt' ? '80mm' : 'a4'),
      isDefault: row.isDefault,
      isActive: row.isActive !== false,
    });
    setSource(false);
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.html.trim()) {
      toast.error('Name and template HTML are required');
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await templates.update(editingId, form);
        toast.success('Template updated');
      } else {
        await templates.create(form);
        toast.success('Template created');
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save template');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Print templates"
        description="Design dynamic invoice and receipt layouts used by every tenant. Placeholders such as {{storeName}} and {{#items}} are filled at print time."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openCreate('receipt')}>
            New receipt
          </Button>
          <Button onClick={() => openCreate('invoice')}>
            <Plus className="mr-2 h-4 w-4" />
            New invoice
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available placeholders</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {PRINT_TEMPLATE_VARIABLES.map((name) => (
            <Badge
              key={name}
              variant="outline"
              className="cursor-pointer font-mono"
              onClick={() => {
                const token = name === 'items' ? '{{#items}}{{name}} x{{quantity}}{{/items}}' : `{{${name}}}`;
                setForm((prev) => ({ ...prev, html: `${prev.html}${token}` }));
              }}
            >
              {`{{${name}}}`}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Paper</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="capitalize">{row.type}</TableCell>
                  <TableCell>{row.paperSize || '—'}</TableCell>
                  <TableCell>{row.isDefault ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.isActive === false ? 'Inactive' : 'Active'}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        void templates.remove(row.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {templates.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Default invoice and receipt templates are created automatically on first visit.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit template' : 'Create template'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: PrintTemplateType) =>
                      setForm({
                        ...form,
                        type: value,
                        html:
                          form.html === DEFAULT_INVOICE_HTML || form.html === DEFAULT_RECEIPT_HTML
                            ? value === 'receipt'
                              ? DEFAULT_RECEIPT_HTML
                              : DEFAULT_INVOICE_HTML
                            : form.html,
                        paperSize: value === 'receipt' ? '80mm' : 'a4',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Paper</Label>
                  <Input
                    value={form.paperSize}
                    onChange={(e) => setForm({ ...form, paperSize: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isDefault}
                    onCheckedChange={(isDefault) => setForm({ ...form, isDefault })}
                  />
                  <Label>Default for this type</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(isActive) => setForm({ ...form, isActive })}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Design</Label>
                <EditorModeToggle source={source} onToggle={() => setSource((v) => !v)} />
              </div>
              {source ? (
                <HtmlSourceEditor value={form.html} onChange={(html) => setForm({ ...form, html })} />
              ) : (
                <RichTextEditor value={form.html} onChange={(html) => setForm({ ...form, html })} />
              )}
            </div>
            <div>
              <Label>Live preview</Label>
              <div
                className="mt-2 max-h-[520px] overflow-auto rounded-md border bg-white p-4 text-black"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={busy} onClick={() => void save()}>
              Save template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
