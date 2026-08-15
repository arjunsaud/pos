import { NetworkStatus } from '@posnepal/shared';

export interface NetworkSnapshot {
  status: NetworkStatus;
  /** Rough connection type from Chromium when available. */
  type?: string;
  checkedAt: string;
}

export { NetworkStatus };
