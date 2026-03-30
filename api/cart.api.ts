import axiosInstance from "../config/axios";
import {
  AddCartItemPayload,
  Cart,
  UpdateCartItemPayload,
} from "../types/cartItemTypes";
import apiEndpoints from "./apiEndpoints";

interface CartResponse {
  message: string;
  cart: Cart;
}

export async function fetchMyCart(): Promise<Cart> {
  const res = await axiosInstance.get<CartResponse, CartResponse>(
    apiEndpoints.cart.getMyCart,
  );
  return res.cart;
}

export async function addCartItem(payload: AddCartItemPayload): Promise<Cart> {
  const res = await axiosInstance.post<CartResponse, CartResponse>(
    apiEndpoints.cart.addItem,
    payload,
  );
  return res.cart;
}

export async function updateCartItem(
  itemId: number,
  payload: UpdateCartItemPayload,
): Promise<Cart> {
  const res = await axiosInstance.patch<CartResponse, CartResponse>(
    apiEndpoints.cart.updateItem(itemId),
    payload,
  );
  return res.cart;
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const res = await axiosInstance.delete<CartResponse, CartResponse>(
    apiEndpoints.cart.removeItem(itemId),
  );
  return res.cart;
}
