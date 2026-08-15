export interface ISupportTicketEntity {
  tenantId: string;
  tenantName: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  respondedAt?: string;
  response?: string;
  attachments?: string[];
}
