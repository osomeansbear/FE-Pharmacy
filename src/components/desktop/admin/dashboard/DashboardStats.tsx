"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats, AdminStats } from "../../../../../api/admin.api";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function OrderStatusRow({
  label,
  count,
  icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{count}</span>
    </div>
  );
}

export default function DashboardStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5 h-24 animate-pulse bg-secondary/40" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        {error || "No data available."}
      </div>
    );
  }

  const revenueFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(stats.revenue);

  return (
    <div className="space-y-6">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.products.total}
          sub={`${stats.products.active} active`}
          icon={<Package size={18} className="text-blue-600" />}
          accent="bg-blue-50"
        />
        <StatCard
          label="Low Stock"
          value={stats.products.lowStock}
          sub="items below 10 units"
          icon={<AlertTriangle size={18} className="text-amber-600" />}
          accent="bg-amber-50"
        />
        <StatCard
          label="Total Orders"
          value={stats.orders.total}
          sub={`${stats.orders.byStatus.PENDING} pending`}
          icon={<ShoppingCart size={18} className="text-purple-600" />}
          accent="bg-purple-50"
        />
        <StatCard
          label="Revenue"
          value={revenueFormatted}
          sub="confirmed + delivered"
          icon={<CheckCircle size={18} className="text-green-600" />}
          accent="bg-green-50"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Orders by status */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Orders by Status</h3>
          <OrderStatusRow
            label="Pending"
            count={stats.orders.byStatus.PENDING}
            icon={<Clock size={15} />}
            color="text-amber-500"
          />
          <OrderStatusRow
            label="Confirmed"
            count={stats.orders.byStatus.CONFIRMED}
            icon={<CheckCircle size={15} />}
            color="text-blue-500"
          />
          <OrderStatusRow
            label="Delivered"
            count={stats.orders.byStatus.DELIVERED}
            icon={<Truck size={15} />}
            color="text-green-500"
          />
          <OrderStatusRow
            label="Cancelled"
            count={stats.orders.byStatus.CANCELLED}
            icon={<XCircle size={15} />}
            color="text-red-400"
          />
        </div>

        {/* Users */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Users</h3>
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Total registered</span>
            </div>
            <span className="text-sm font-semibold">{stats.users.total}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-green-500" />
              <span className="text-sm text-foreground">Active accounts</span>
            </div>
            <span className="text-sm font-semibold">{stats.users.active}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
