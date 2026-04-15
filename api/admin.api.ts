import axiosInstance from "../config/axios";
import apiEndpoints from "./apiEndpoints";

export interface AdminStats {
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  orders: {
    total: number;
    byStatus: {
      PENDING: number;
      CONFIRMED: number;
      DELIVERED: number;
      CANCELLED: number;
    };
  };
  revenue: number;
  users: {
    total: number;
    active: number;
  };
}

interface StatsEnvelope {
  message: string;
  data?: AdminStats;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await axiosInstance.get<StatsEnvelope, StatsEnvelope>(
    apiEndpoints.admin.getStats,
  );
  if (!res.data) throw new Error("Stats missing from API response");
  return res.data;
}
