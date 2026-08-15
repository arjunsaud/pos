import type { Id } from './common';

export interface UserPublic {
  id: Id;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface TenantPublic {
  id: Id;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductPublic {
  id: Id;
  name: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
}
