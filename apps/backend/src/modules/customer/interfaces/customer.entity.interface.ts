export interface ICustomerEntity {
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  pan?: string;
  address?: string;
  totalPurchases?: number;
  totalSpent?: number;
  lastVisit?: string;
  isActive?: boolean;
  loyaltyPoints?: number;
  creditBalance?: number;
  creditLimit?: number;
}
