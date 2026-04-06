export type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export const ALL_STATUSES: AdminOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const statusMap: Record<string, AdminOrderStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

export const statusToApi: Record<AdminOrderStatus, string> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Processing: "PROCESSING",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
  Returned: "RETURNED",
};

export const validTransitions: Record<string, AdminOrderStatus[]> = {
  PENDING: ["Confirmed", "Cancelled"],
  CONFIRMED: ["Processing", "Cancelled"],
  PROCESSING: ["Delivered"],
  DELIVERED: ["Returned"],
  CANCELLED: [],
  RETURNED: [],
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
    case "Processing":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-muted text-foreground border-slate-200";
    case "Returned":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-muted text-foreground";
  }
};

export const getDisplayStatus = (apiStatus: string): AdminOrderStatus =>
  statusMap[apiStatus] || "Pending";
