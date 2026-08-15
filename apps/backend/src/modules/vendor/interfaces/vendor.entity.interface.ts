export interface IVendorEntity {
  tenantId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  pan?: string;
  vatNumber?: string;
  address?: string;
  city?: string;
  status: string;
  productCount?: number;
}
