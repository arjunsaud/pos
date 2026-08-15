export interface IPromotionEntity {
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  status: string;
  maxUses?: number;
  usedCount?: number;
  validFrom: string;
  validUntil: string;
  createdBy?: string;
}
