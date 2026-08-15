import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcChannel } from '../../shared/ipc-channels';
import type { NetworkSnapshot } from '../../domain/network';
import type { ShortcutId } from '@posnepal/shared';

const api = {
  getNetwork(): Promise<NetworkSnapshot> {
    return ipcRenderer.invoke(IpcChannel.NETWORK_GET);
  },
  onNetworkChange(callback: (snapshot: NetworkSnapshot) => void): () => void {
    const listener = (_event: IpcRendererEvent, snapshot: NetworkSnapshot) => {
      callback(snapshot);
    };
    ipcRenderer.on(IpcChannel.NETWORK_CHANGED, listener);
    return () => ipcRenderer.removeListener(IpcChannel.NETWORK_CHANGED, listener);
  },
  getVersion(): Promise<string> {
    return ipcRenderer.invoke(IpcChannel.APP_GET_VERSION);
  },
  onShortcut(callback: (id: ShortcutId) => void): () => void {
    const listener = (_event: IpcRendererEvent, id: ShortcutId) => {
      callback(id);
    };
    ipcRenderer.on(IpcChannel.SHORTCUT, listener);
    return () => ipcRenderer.removeListener(IpcChannel.SHORTCUT, listener);
  },
};

contextBridge.exposeInMainWorld('posnepalDesktop', api);

export type PosnepalDesktopApi = typeof api;
