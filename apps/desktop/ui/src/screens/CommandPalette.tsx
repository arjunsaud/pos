import { useMemo, useState } from 'react';
import { SHORTCUTS, type ShortcutId } from '@posnepal/shared';
import type { DesktopPage, DesktopRole } from '@/lib/types';
import { navForRole } from '@/lib/nav';
import { Input } from '@/components/ui/input';

const SHORTCUT_BY_PAGE: Partial<Record<DesktopPage, ShortcutId>> = {
  dashboard: 'goDashboard',
  pos: 'goPos',
  products: 'goProducts',
  inventory: 'goInventory',
  sales: 'goSales',
};

export function CommandPalette({
  role,
  onGo,
  onClose,
}: {
  role: DesktopRole;
  onGo: (page: DesktopPage) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const items = useMemo(() => {
    const flat = navForRole(role).flatMap((g) => g.items);
    const q = query.trim().toLowerCase();
    if (!q) return flat;
    return flat.filter((item) => item.label.toLowerCase().includes(q));
  }, [role, query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-3">
          <Input
            autoFocus
            placeholder={`Jump to… (${SHORTCUTS.commandPalette.keysLabel})`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {items.map((item) => {
            const shortcut = SHORTCUT_BY_PAGE[item.id];
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onGo(item.id);
                    onClose();
                  }}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="flex-1">{item.label}</span>
                  {shortcut ? <kbd>{SHORTCUTS[shortcut].keysLabel}</kbd> : null}
                </button>
              </li>
            );
          })}
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
