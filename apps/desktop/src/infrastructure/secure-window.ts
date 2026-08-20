import { BrowserWindow, session } from 'electron';
import path from 'node:path';

const DEV_RENDERER = process.env.ELECTRON_RENDERER_URL?.trim();

const ALLOWED_ORIGINS = new Set(
  ['http://127.0.0.1:5173', 'http://localhost:5173', DEV_RENDERER, 'file://']
    .filter(Boolean)
    .map((u) => {
      try {
        return new URL(u!).origin;
      } catch {
        return u!;
      }
    }),
);

export function applySessionSecurity(): void {
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    const allowedDev = permission === 'clipboard-read' || permission === 'clipboard-sanitized-write';
    callback(allowedDev);
  });
}

export function createMainWindow(): BrowserWindow {
  const preload = path.join(__dirname, '../preload/index.js');

  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    title: 'POS Nepal Desktop',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedUrl(url)) event.preventDefault();
  });

  return win;
}

export function isAllowedUrl(url: string): boolean {
  if (url.startsWith('file://')) return true;
  try {
    return ALLOWED_ORIGINS.has(new URL(url).origin);
  } catch {
    return false;
  }
}

/** Desktop Vite UI only — never load the Next.js website. */
export function getRendererUrl(): string {
  if (DEV_RENDERER) return DEV_RENDERER;
  return path.join(__dirname, '../../ui/index.html');
}

export function isDevRenderer(): boolean {
  return Boolean(DEV_RENDERER);
}
