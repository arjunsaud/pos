export interface INotificationEntity {
  tenantId: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead?: boolean;
  actionUrl?: string;
  entityId?: string;
}
