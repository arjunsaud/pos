import type { NetworkStatus } from '@posnepal/shared';
import type { ShortcutId } from '@posnepal/shared';

export interface PosnepalDesktopApi {
  getNetwork(): Promise<{ status: NetworkStatus; type?: string; checkedAt: string }>;
  onNetworkChange(callback: (snapshot: { status: NetworkStatus; checkedAt: string }) => void): () => void;
  getVersion(): Promise<string>;
  onShortcut(callback: (id: ShortcutId) => void): () => void;
}

declare global {
  interface Window {
    posnepalDesktop?: PosnepalDesktopApi;
  }
}

export {};
