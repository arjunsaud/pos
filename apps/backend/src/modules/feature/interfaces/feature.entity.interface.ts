export interface IFeatureEntity {
  tenantId: string;
  key: string;
  label: string;
  description?: string;
  category: string;
  enabled?: boolean;
}
