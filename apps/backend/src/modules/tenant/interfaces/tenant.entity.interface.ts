export interface ITenantEntity {
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  domain: string;
  ownerName: string;
  productCount?: number;
  monthlyRevenue?: number;
  address?: string;
  pan?: string;
  vatNumber?: string;
}
