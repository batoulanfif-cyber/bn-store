"use client";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-heading-lg text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-body-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[180px]">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>
      </div>
    </div>
  );
}