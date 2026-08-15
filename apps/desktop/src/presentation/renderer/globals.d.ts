import type { PosnepalDesktopApi } from '../preload/index';

declare global {
  interface Window {
    posnepalDesktop?: PosnepalDesktopApi;
    __POSNEPAL_APP_URL__?: string;
  }
}

export {};
