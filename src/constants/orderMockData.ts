export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  patientName: string;
  date: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  rxAttached: boolean;
};

export const orders: Order[] = [
  {
    id: "ORD-1001",
    patientName: "James Wilson",
    date: "2025-12-31",
    itemsCount: 3,
    total: 45.5,
    status: "Pending",
    rxAttached: true,
  },
  {
    id: "ORD-1002",
    patientName: "Sarah Chen",
    date: "2025-12-30",
    itemsCount: 1,
    total: 15.99,
    status: "Delivered",
    rxAttached: true,
  },
  {
    id: "ORD-1003",
    patientName: "Maria Garcia",
    date: "2025-12-30",
    itemsCount: 2,
    total: 22.4,
    status: "Processing",
    rxAttached: false,
  },
  {
    id: "ORD-1004",
    patientName: "Robert Taylor",
    date: "2025-12-29",
    itemsCount: 5,
    total: 112.0,
    status: "Shipped",
    rxAttached: true,
  },
  {
    id: "ORD-1005",
    patientName: "Linda Moore",
    date: "2025-12-29",
    itemsCount: 1,
    total: 8.5,
    status: "Cancelled",
    rxAttached: false,
  },
  // Add more entries for pagination testing...
];
