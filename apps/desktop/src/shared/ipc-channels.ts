/** IPC channel names — keep in sync between main and preload. */
export const IpcChannel = {
  NETWORK_GET: 'network:get',
  NETWORK_CHANGED: 'network:changed',
  APP_GET_VERSION: 'app:get-version',
  SHORTCUT: 'shortcut:trigger',
} as const;

export type IpcChannelName = (typeof IpcChannel)[keyof typeof IpcChannel];
