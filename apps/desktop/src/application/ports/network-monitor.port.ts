import type { NetworkSnapshot } from '../../domain/network';

/** Port the domain cares about — implemented by infrastructure. */
export interface NetworkMonitorPort {
  getSnapshot(): NetworkSnapshot;
  start(onChange: (snapshot: NetworkSnapshot) => void): () => void;
}
