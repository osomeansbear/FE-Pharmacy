export type PaymentMethod = "CASH" | "CARD" | "ONLINE" | "INSURANCE";

export type UnitType = "TABLET" | "BOX";

export interface CreateOrderItemPayload {
  productId: number;
  unitType: UnitType;
  quantity: string;
}

export interface CreateOrderPayload {
  addressId: number;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemPayload[];
}

export interface AdminCreateOrderPayload {
  userId: number;
  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    detail: string;
  };
  paymentMethod: PaymentMethod;
  items: CreateOrderItemPayload[];
}

export interface OrderListType {
  id: number;
  status: string;
  items: ItemType[];
  paymentMethod: PaymentMethod;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  userEmail: string;
  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    detail: string;
  };
}

export interface ItemType {
  id: number;
  productId: number;
  productName: string;
  unitType: string;
  quantity: string | null;
  baseQty: string | null;
  unitPrice: string | null;
}
