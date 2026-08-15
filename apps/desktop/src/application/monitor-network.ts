import type { NetworkSnapshot } from '../domain/network';
import type { NetworkMonitorPort } from './ports/network-monitor.port';

/**
 * Use case: keep an up-to-date view of network connectivity.
 * Presentation calls this; it never imports Electron APIs directly.
 */
export class MonitorNetworkUseCase {
  constructor(private readonly monitor: NetworkMonitorPort) {}

  getCurrent(): NetworkSnapshot {
    return this.monitor.getSnapshot();
  }

  watch(onChange: (snapshot: NetworkSnapshot) => void): () => void {
    return this.monitor.start(onChange);
  }
}
