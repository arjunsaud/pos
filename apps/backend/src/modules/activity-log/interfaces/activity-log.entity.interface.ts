export interface IActivityLogEntity {
  tenantId?: string;
  user: string;
  action: string;
  details?: string;
  type: string;
}
