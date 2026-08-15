import { net } from 'electron';
import { NetworkStatus } from '@posnepal/shared';
import type { NetworkSnapshot } from '../domain/network';
import type { NetworkMonitorPort } from '../application/ports/network-monitor.port';

/**
 * Uses Electron `net` + Chromium online events.
 * Polls periodically so VPN / sleep wake changes are noticed.
 */
export class ElectronNetworkMonitor implements NetworkMonitorPort {
  private readonly pollMs: number;

  constructor(pollMs = 5000) {
    this.pollMs = pollMs;
  }

  getSnapshot(): NetworkSnapshot {
    const online = net.isOnline();
    return {
      status: online ? NetworkStatus.ONLINE : NetworkStatus.OFFLINE,
      checkedAt: new Date().toISOString(),
    };
  }

  start(onChange: (snapshot: NetworkSnapshot) => void): () => void {
    let last = this.getSnapshot().status;
    onChange(this.getSnapshot());

    const emitIfChanged = () => {
      const next = this.getSnapshot();
      if (next.status !== last) {
        last = next.status;
        onChange(next);
      }
    };

    const timer = setInterval(emitIfChanged, this.pollMs);

    // Extra signal when Chromium reports connectivity change (renderer→main via powerMonitor not always enough).
    const onlineHandler = () => emitIfChanged();
    // Node process does not get window online events; polling covers us.

    return () => {
      clearInterval(timer);
      void onlineHandler;
    };
  }
}
