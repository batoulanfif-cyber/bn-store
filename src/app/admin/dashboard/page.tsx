'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Locale, getTranslation, getDir } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Stats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  cancelled_orders: number;
  total_sales: number;
}

export default function AdminDashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const [locale] = useState<Locale>('fr');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';
  const dir = getDir(locale);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/admin/stats`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { key: 'total_orders', label: 'Total Orders', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
    { key: 'pending_orders', label: 'Pending', icon: Clock, color: 'bg-yellow-50 text-yellow-600', iconColor: 'text-yellow-600' },
    { key: 'confirmed_orders', label: 'Confirmed', icon: CheckCircle, color: 'bg-green-50 text-green-600', iconColor: 'text-green-600' },
    { key: 'cancelled_orders', label: 'Cancelled', icon: XCircle, color: 'bg-red-50 text-red-600', iconColor: 'text-red-600' },
    { key: 'total_sales', label: 'Total Sales', icon: DollarSign, color: 'bg-purple-50 text-purple-600', iconColor: 'text-purple-600', isCurrency: true },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" dir={dir}>
        {statCards.map(() => (
          <div key={Math.random()} className="bg-white rounded-card-lg p-6 shadow-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-heading-lg text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your store performance</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 btn-primary self-start"
        >
          View Orders
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-card-lg p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-gray-500 font-medium uppercase tracking-wider">{card.label}</p>
                <p className="font-semibold text-heading-lg text-gray-900 mt-1">
                  {card.isCurrency ? formatPrice(stats?.[card.key as keyof Stats] as number || 0) + ' DA' : stats?.[card.key as keyof Stats] || 0}
                </p>
              </div>
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', card.color)}>
                <card.icon className={cn('w-6 h-6', card.iconColor)} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card-lg p-6 shadow-card">
          <h2 className="font-semibold text-body-lg text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products" className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-caption text-gray-500 mt-1">Add, edit, delete products</p>
            </Link>
            <Link href="/admin/orders" className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
              <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-caption text-gray-500 mt-1">View, confirm, ship orders</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-card-lg p-6 shadow-card">
          <h2 className="font-semibold text-body-lg text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-4">No recent activity to show</p>
          </div>
        </div>
      </div>
    </div>
  );
}