'use client';

import { CartProvider } from './CartContext';
import { MobileNav } from './MobileNav';
import { InstallPrompt } from './InstallPrompt';
import { CartDrawer } from './CartDrawer';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Inner>{children}</Inner>
    </CartProvider>
  );
}

function Inner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  return (
    <>
      {children}
      {!isAdmin && (
        <>
          <CartDrawer />
          <div className="h-[64px] lg:hidden" aria-hidden="true" />
          <MobileNav />
          <InstallPrompt />
        </>
      )}
    </>
  );
}
