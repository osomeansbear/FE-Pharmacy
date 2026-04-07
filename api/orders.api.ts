import axiosInstance from "../config/axios";
import { AdminCreateOrderPayload, CreateOrderPayload, OrderListType } from "../types/orderTypes";
import apiEndpoints from "./apiEndpoints";

interface OrdersResponse {
  message: string;
  orders: OrderListType[];
}

interface OrderResponse {
  message: string;
  order: OrderListType;
}

export async function fetchMyOrders(): Promise<OrderListType[]> {
  const res = await axiosInstance.get<OrdersResponse, OrdersResponse>(
    apiEndpoints.order.getMyOrders,
  );
  return res.orders;
}

export async function fetchAllOrders(): Promise<OrderListType[]> {
  const res = await axiosInstance.get<OrdersResponse, OrdersResponse>(
    apiEndpoints.order.getAllOrders,
  );
  return res.orders;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderListType> {
  const res = await axiosInstance.post<OrderResponse, OrderResponse>(
    apiEndpoints.order.createOrder,
    payload,
  );
  return res.order;
}

export async function adminCreateOrder(
  payload: AdminCreateOrderPayload,
): Promise<OrderListType> {
  const res = await axiosInstance.post<OrderResponse, OrderResponse>(
    apiEndpoints.order.adminCreateOrder,
    payload,
  );
  return res.order;
}

export async function payOrder(orderId: number): Promise<OrderListType> {
  const res = await axiosInstance.post<OrderResponse, OrderResponse>(
    apiEndpoints.order.payOrder(orderId),
  );
  return res.order;
}

export async function cancelOrder(orderId: number): Promise<OrderListType> {
  const res = await axiosInstance.patch<OrderResponse, OrderResponse>(
    apiEndpoints.order.cancelOrder(orderId),
  );
  return res.order;
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
): Promise<OrderListType> {
  const res = await axiosInstance.patch<OrderResponse, OrderResponse>(
    apiEndpoints.order.updateOrderStatus(orderId),
    { status },
  );
  return res.order;
}
