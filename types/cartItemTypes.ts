import { UnitType } from "./orderTypes";

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImage: string | null;
  unitType: UnitType;
  quantity: string;
  unitPrice: string;
  conversionFactor: string;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: string;
}

export interface AddCartItemPayload {
  productId: number;
  unitType: UnitType;
  quantity: string;
}

export interface UpdateCartItemPayload {
  quantity: string;
}

// Legacy UI-only type retained for compatibility.
export interface LegacyCartItem {
  id: number;
  imgUrl: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
}
