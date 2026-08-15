import type { BrowserWindow } from 'electron';
import { Menu } from 'electron';
import { SHORTCUTS, type ShortcutId } from '@posnepal/shared';
import { IpcChannel } from '../shared/ipc-channels';

function send(win: BrowserWindow | null, id: ShortcutId): void {
  if (!win || win.isDestroyed()) return;
  win.webContents.send(IpcChannel.SHORTCUT, id);
}

export function buildApplicationMenu(getWindow: () => BrowserWindow | null): Menu {
  const go = (id: ShortcutId) => () => send(getWindow(), id);

  return Menu.buildFromTemplate([
    {
      label: 'POS Nepal',
      submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }],
    },
    {
      label: 'Go',
      submenu: [
        { label: SHORTCUTS.goDashboard.label, accelerator: SHORTCUTS.goDashboard.accelerator, click: go('goDashboard') },
        { label: SHORTCUTS.goPos.label, accelerator: SHORTCUTS.goPos.accelerator, click: go('goPos') },
        { label: SHORTCUTS.goProducts.label, accelerator: SHORTCUTS.goProducts.accelerator, click: go('goProducts') },
        { label: SHORTCUTS.goInventory.label, accelerator: SHORTCUTS.goInventory.accelerator, click: go('goInventory') },
        { label: SHORTCUTS.goSales.label, accelerator: SHORTCUTS.goSales.accelerator, click: go('goSales') },
      ],
    },
    {
      label: 'POS',
      submenu: [
        { label: SHORTCUTS.posBarcode.label, accelerator: SHORTCUTS.posBarcode.accelerator, click: go('posBarcode') },
        { label: SHORTCUTS.posCheckout.label, accelerator: SHORTCUTS.posCheckout.accelerator, click: go('posCheckout') },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: SHORTCUTS.commandPalette.label,
          accelerator: SHORTCUTS.commandPalette.accelerator,
          click: go('commandPalette'),
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]);
}
