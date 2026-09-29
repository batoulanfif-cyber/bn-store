'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { Locale, getTranslation, getDir, locales, localeNames } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export default function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: Locale }> }) {
  const [locale] = useState<Locale>('fr');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';
  const dir = getDir(locale);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push(`/${locale}/admin/login`);
      router.refresh();
    } catch {
      router.push(`/${locale}/admin/login`);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" dir={dir}>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href={`/${locale}/admin/dashboard`} className="flex items-center gap-2">
              <span className="font-serif font-bold text-heading-md text-gray-900">BN STORE</span>
              <span className="text-primary-600 text-caption font-medium tracking-wider">ADMIN</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {adminNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{t.nav[item.href.split('/').pop() as keyof typeof t.nav] || item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 text-body-sm text-gray-500">
              <span className="font-medium text-gray-900">Admin</span>
              <span className="text-caption text-gray-400">v1.0</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-body-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors mt-2"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="font-serif font-semibold text-heading-md text-gray-900">
                {pathname === '/admin/dashboard' ? 'Dashboard' : pathname.includes('/products') ? 'Products' : 'Orders'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" role="group" aria-label={t.common.language}>
                <select
                  value={locale}
                  onChange={e => router.push(`/${e.target.value}${pathname}`)}
                  className="appearance-none bg-gray-100 border-0 px-3 py-2 rounded-lg text-body-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  dir={dir}
                >
                  {locales.map(l => (
                    <option key={l} value={l}>{localeNames[l]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}