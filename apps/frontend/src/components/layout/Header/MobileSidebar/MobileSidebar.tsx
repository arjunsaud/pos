'use client';

import { Menu, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from '../SidebarNav/SidebarNav';
import type { SidebarNavItem } from '@/lib/types/interface/nav.interface';
import { useState } from 'react';

export function MobileSidebar({ items }: { items: SidebarNavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-14 items-center gap-2.5 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Monitor className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">POS Nepal</span>
            <span className="text-[10px] text-muted-foreground">Multi-Tenant System</span>
          </div>
        </div>
        <SidebarNav items={items} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
