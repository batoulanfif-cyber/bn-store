"use client";

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ChevronDown, Phone, MapPin, Package } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';

interface OrderItem {
  id: number;
  product_brand: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  customer_address: string;
  customer_notes: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const NEXT_STATUS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const statusStyle: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '50', page: '1' });
      if (status) params.append('status', status);
      const res = await fetch(`/api/orders?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update order');
      setOrders((prev) => prev.map((o) => (o.id === id ? data.data : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-heading-lg text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-body-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[180px]"
          >
            <option value="">All Status</option>
            {STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-card-lg p-12 shadow-card text-center text-gray-500">
          <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>No orders found{status ? ` with status "${status}"` : ' yet'}.</p>
          <p className="text-sm mt-1">New customer orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-card-lg shadow-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 sm:p-5 text-left hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">#{order.order_number}</p>
                  <p className="text-sm text-gray-500">{order.customer_name} · {order.customer_phone}</p>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-semibold uppercase self-start sm:self-auto', statusStyle[order.status])}>
                  {order.status}
                </span>
                <span className="font-semibold text-gray-900">{formatPrice(Number(order.total))} DA</span>
                <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', expanded === order.id && 'rotate-180')} />
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4 sm:p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" /> {order.customer_phone}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" /> {order.customer_wilaya} — {order.customer_address}
                    </p>
                  </div>
                  {order.customer_notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">📝 {order.customer_notes}</p>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="text-left px-3 py-2">Product</th>
                          <th className="text-center px-3 py-2">Qty</th>
                          <th className="text-right px-3 py-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((it) => (
                          <tr key={it.id} className="border-t border-gray-100">
                            <td className="px-3 py-2">{it.product_brand} — {it.product_name}</td>
                            <td className="text-center px-3 py-2">×{it.quantity}</td>
                            <td className="text-right px-3 py-2">{formatPrice(Number(it.subtotal))} DA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end gap-6 px-3 py-2 bg-gray-50 text-sm">
                      <span className="text-gray-500">Shipping: {formatPrice(Number(order.shipping_cost))} DA</span>
                      <span className="font-semibold">Total: {formatPrice(Number(order.total))} DA</span>
                    </div>
                  </div>

                  {NEXT_STATUS[order.status].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {NEXT_STATUS[order.status].map((s) => (
                        <button
                          key={s}
                          disabled={updating === order.id}
                          onClick={() => updateStatus(order.id, s)}
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50',
                            s === 'cancelled'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'btn-primary'
                          )}
                        >
                          {updating === order.id ? 'Saving…' : `Mark as ${s}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
