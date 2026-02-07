export interface OrderListType {
  id: number;
  status: string;
  items: ItemType[];
  totalAmount: number;
  createdAt: string;
}

export interface ItemType {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
