export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum SaleStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  PROGRESS = 'PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum NetworkStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  UNKNOWN = 'UNKNOWN',
}
