export type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Delivered"
  | "Cancelled";

export const ALL_STATUSES: AdminOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Delivered",
  "Cancelled",
];

export const statusMap: Record<string, AdminOrderStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const statusToApi: Record<AdminOrderStatus, string> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
};

export const validTransitions: Record<string, AdminOrderStatus[]> = {
  PENDING: ["Confirmed", "Cancelled"],
  CONFIRMED: ["Delivered", "Cancelled"],
  DELIVERED: [],
  CANCELLED: [],
};

export type NewOrderStep = "user" | "products" | "details";

export interface OrderItem {
  productId: number;
  productName: string;
  unitType: string;
  quantity: string;
  unitPrice: string;
  availableUnits: { unitType: string; price: string; isDefault: boolean }[];
}

export const getStatusStyle = (status: AdminOrderStatus) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Confirmed":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-muted text-foreground border-slate-200";
    default:
      return "bg-muted text-foreground";
  }
};

export const getDisplayStatus = (apiStatus: string): AdminOrderStatus =>
  statusMap[apiStatus] || "Pending";
