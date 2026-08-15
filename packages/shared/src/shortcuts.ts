export type ShortcutId =
  | 'commandPalette'
  | 'posBarcode'
  | 'posCheckout'
  | 'posClear'
  | 'goDashboard'
  | 'goPos'
  | 'goProducts'
  | 'goInventory'
  | 'goSales';

export interface ShortcutSpec {
  id: ShortcutId;
  /** KeyboardEvent.key (case-insensitive for letters). */
  key: string;
  /** Cmd on macOS, Ctrl elsewhere. */
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
  allowInInputs?: boolean;
  label: string;
  /** Shown in UI, e.g. "⌘K / Ctrl+K". */
  keysLabel: string;
  /** Electron Menu accelerator, e.g. CmdOrCtrl+K */
  accelerator: string;
}

export const SHORTCUTS: Record<ShortcutId, ShortcutSpec> = {
  commandPalette: {
    id: 'commandPalette',
    key: 'k',
    mod: true,
    allowInInputs: true,
    label: 'Command palette',
    keysLabel: '⌘K / Ctrl+K',
    accelerator: 'CmdOrCtrl+K',
  },
  posBarcode: {
    id: 'posBarcode',
    key: 'F2',
    allowInInputs: true,
    label: 'Focus barcode',
    keysLabel: 'F2',
    accelerator: 'F2',
  },
  posCheckout: {
    id: 'posCheckout',
    key: 'F9',
    allowInInputs: true,
    label: 'Complete sale',
    keysLabel: 'F9',
    accelerator: 'F9',
  },
  posClear: {
    id: 'posClear',
    key: 'Escape',
    allowInInputs: true,
    label: 'Clear / close',
    keysLabel: 'Esc',
    accelerator: 'Escape',
  },
  goDashboard: {
    id: 'goDashboard',
    key: '1',
    mod: true,
    allowInInputs: true,
    label: 'Go to dashboard',
    keysLabel: '⌘1 / Ctrl+1',
    accelerator: 'CmdOrCtrl+1',
  },
  goPos: {
    id: 'goPos',
    key: '2',
    mod: true,
    allowInInputs: true,
    label: 'Go to POS',
    keysLabel: '⌘2 / Ctrl+2',
    accelerator: 'CmdOrCtrl+2',
  },
  goProducts: {
    id: 'goProducts',
    key: '3',
    mod: true,
    allowInInputs: true,
    label: 'Go to products',
    keysLabel: '⌘3 / Ctrl+3',
    accelerator: 'CmdOrCtrl+3',
  },
  goInventory: {
    id: 'goInventory',
    key: '4',
    mod: true,
    allowInInputs: true,
    label: 'Go to inventory',
    keysLabel: '⌘4 / Ctrl+4',
    accelerator: 'CmdOrCtrl+4',
  },
  goSales: {
    id: 'goSales',
    key: '5',
    mod: true,
    allowInInputs: true,
    label: 'Go to sales',
    keysLabel: '⌘5 / Ctrl+5',
    accelerator: 'CmdOrCtrl+5',
  },
};

export const SHORTCUT_LIST = Object.values(SHORTCUTS);

export interface ShortcutEventLike {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  target?: unknown;
}

function isEditableTarget(target: unknown): boolean {
  if (!target || typeof target !== 'object') return false;
  const el = target as { tagName?: string; isContentEditable?: boolean };
  const tag = (el.tagName || '').toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(el.isContentEditable);
}

export function matchesShortcut(
  event: ShortcutEventLike,
  spec: ShortcutSpec,
): boolean {
  if (!spec.allowInInputs && isEditableTarget(event.target)) {
    return false;
  }

  const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const specKey = spec.key.length === 1 ? spec.key.toLowerCase() : spec.key;
  if (eventKey !== specKey) return false;

  const wantsMod = Boolean(spec.mod);
  const hasMod = event.metaKey || event.ctrlKey;
  if (wantsMod !== hasMod) return false;

  if (Boolean(spec.shift) !== event.shiftKey) return false;
  if (Boolean(spec.alt) !== event.altKey) return false;

  return true;
}

export function matchShortcutId(
  event: ShortcutEventLike,
): ShortcutId | null {
  for (const spec of SHORTCUT_LIST) {
    if (matchesShortcut(event, spec)) return spec.id;
  }
  return null;
}
