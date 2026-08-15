import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { NetworkStatus } from '@posnepal/shared';
import { MonitorNetworkUseCase } from '../../application/monitor-network';
import { ElectronNetworkMonitor } from '../../infrastructure/electron-network';
import { buildApplicationMenu } from '../../infrastructure/app-menu';
import {
  applySessionSecurity,
  createMainWindow,
  getRendererUrl,
  isAllowedUrl,
  isDevRenderer,
} from '../../infrastructure/secure-window';
import { IpcChannel } from '../../shared/ipc-channels';

let mainWindow: BrowserWindow | null = null;
let stopWatch: (() => void) | null = null;

const network = new MonitorNetworkUseCase(new ElectronNetworkMonitor());

function registerIpc(): void {
  ipcMain.handle(IpcChannel.NETWORK_GET, () => network.getCurrent());
  ipcMain.handle(IpcChannel.APP_GET_VERSION, () => app.getVersion());
}

async function loadDesktopUi(): Promise<void> {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const target = getRendererUrl();
  if (isDevRenderer()) {
    await mainWindow.loadURL(target);
    return;
  }
  await mainWindow.loadFile(target);
}

async function bootstrap(): Promise<void> {
  const locked = app.requestSingleInstanceLock();
  if (!locked) {
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  await app.whenReady();
  applySessionSecurity();
  registerIpc();
  Menu.setApplicationMenu(buildApplicationMenu(() => mainWindow));

  mainWindow = createMainWindow();
  await loadDesktopUi();

  stopWatch = network.watch((snapshot) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.webContents.send(IpcChannel.NETWORK_CHANGED, snapshot);
    void snapshot.status === NetworkStatus.ONLINE;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void bootstrap();
    }
  });
}

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
  contents.setWindowOpenHandler(({ url }) =>
    isAllowedUrl(url) ? { action: 'allow' } : { action: 'deny' },
  );
});

app.on('window-all-closed', () => {
  stopWatch?.();
  stopWatch = null;
  if (process.platform !== 'darwin') app.quit();
});

void bootstrap();
