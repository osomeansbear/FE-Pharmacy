import axiosInstance from "../config/axios";
import { APIResponse } from "../types/apiTypes";
import { Product } from "../types/productTypes";
import apiEndpoints from "./apiEndpoints";

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await axiosInstance.get<
    APIResponse<Product[]>,
    APIResponse<Product[]>
  >(apiEndpoints.product.getAllProducts);

  return res.data;
}
