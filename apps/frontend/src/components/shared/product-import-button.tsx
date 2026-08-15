'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { apiUpload, extractApiMessage, ApiError } from '@/lib/api';

const TEMPLATE_CSV = [
  'name,sku,barcode,price,costPrice,category,stock,minStock,unit,vendorName',
  'Wai Wai Noodles,WAIWAI-1,890155200012,30,22,Grocery,120,20,pcs,CG Foods',
  'Amul Taaza Milk 1L,MILK-1L,890123400001,90,75,Dairy,48,10,pcs,',
].join('\n');

export interface ProductImportResult {
  created: number;
  skipped: number;
  errors?: Array<{ row: number; sku?: string; reason: string }>;
}

interface ProductImportButtonProps {
  path: string;
  tenantId?: string;
  onImported?: (result: ProductImportResult) => void;
}

export function ProductImportButton({
  path,
  tenantId,
  onImported,
}: ProductImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (path.includes('/admin/product/import') && !tenantId) {
      toast.error('Select a tenant before importing products');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<ProductImportResult>(path, formData, {
        query: tenantId ? { tenantId } : undefined,
      });
      const created = result?.created ?? 0;
      const skipped = result?.skipped ?? 0;
      if (created > 0) {
        toast.success(
          skipped
            ? `${created} product(s) imported, ${skipped} skipped`
            : `${created} product(s) imported`,
        );
      } else {
        toast.error(skipped ? `No products imported (${skipped} skipped)` : 'No products imported');
      }
      onImported?.(result);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? extractApiMessage(error.body) || error.message
          : error instanceof Error
            ? error.message
            : 'Could not import products';
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <Button variant="outline" size="sm" type="button" onClick={downloadTemplate}>
        <Download className="h-4 w-4" /> Template
      </Button>
      <Button
        variant="outline"
        size="sm"
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? 'Importing…' : 'Import Excel/CSV'}
      </Button>
    </>
  );
}
