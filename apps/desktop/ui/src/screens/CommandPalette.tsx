import { SHORTCUTS, type ShortcutId } from '@posnepal/shared';
import type { DesktopPage, DesktopRole } from '../lib/types';

const PAGES: Array<{ id: DesktopPage; label: string; shortcut?: ShortcutId; staff?: boolean }> = [
  { id: 'dashboard', label: 'Dashboard', shortcut: 'goDashboard' },
  { id: 'pos', label: 'POS', shortcut: 'goPos', staff: true },
  { id: 'billing', label: 'Billing' },
  { id: 'products', label: 'Products', shortcut: 'goProducts' },
  { id: 'inventory', label: 'Inventory', shortcut: 'goInventory' },
  { id: 'categories', label: 'Categories' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'stock-transfer', label: 'Stock transfer' },
  { id: 'sales', label: 'Sales', shortcut: 'goSales', staff: true },
  { id: 'customers', label: 'Customers' },
  { id: 'outlets', label: 'Outlets' },
  { id: 'staff', label: 'Staff' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'support', label: 'Support' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'store-profile', label: 'Store' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings', staff: true },
];

export function CommandPalette({
  role,
  onGo,
  onClose,
}: {
  role: DesktopRole;
  onGo: (page: DesktopPage) => void;
  onClose: () => void;
}) {
  const items = PAGES.filter((p) => role !== 'staff' || p.staff);
  return (
    <div className="palette" onClick={onClose}>
      <div className="palette-box" onClick={(e) => e.stopPropagation()}>
        <input autoFocus placeholder={`Jump to… (${SHORTCUTS.commandPalette.keysLabel})`} onKeyDown={(e) => e.key === 'Escape' && onClose()} />
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onGo(item.id);
                  onClose();
                }}
              >
                {item.label}
                {item.shortcut ? (
                  <kbd style={{ float: 'right' }}>{SHORTCUTS[item.shortcut].keysLabel}</kbd>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
