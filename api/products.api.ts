import axiosInstance from "../config/axios";
import { Product, ProductDetail } from "../types/productTypes";
import apiEndpoints from "./apiEndpoints";

interface ProductsEnvelope {
  message: string;
  data?: Product[];
}

interface ProductDetailEnvelope {
  message: string;
  data?: ProductDetail;
}

interface ProductResponse {
  message: string;
  data?: Product;
}

export async function fetchAllProducts(
  filters?: { category?: string; brand?: string; search?: string },
): Promise<Product[]> {
  const res = await axiosInstance.get<ProductsEnvelope, ProductsEnvelope>(
    apiEndpoints.product.getAllProducts,
    { params: filters },
  );

  return Array.isArray(res.data) ? res.data : [];
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await axiosInstance.get<
    ProductDetailEnvelope,
    ProductDetailEnvelope
  >(apiEndpoints.product.getProductBySlug(slug));

  if (!res.data) {
    throw new Error("Product detail is missing from API response");
  }

  return {
    ...res.data,
    units: Array.isArray(res.data.units) ? res.data.units : [],
  };
}

export async function createProduct(
  payload: Partial<Product>,
): Promise<Product> {
  const res = await axiosInstance.post<ProductResponse, ProductResponse>(
    apiEndpoints.product.createProduct,
    payload,
  );
  return res.data!;
}

export async function updateProduct(
  id: number,
  payload: Partial<Product>,
): Promise<Product> {
  const res = await axiosInstance.patch<ProductResponse, ProductResponse>(
    apiEndpoints.product.updateProduct(id),
    payload,
  );
  return res.data!;
}

export async function deleteProduct(id: number): Promise<void> {
  await axiosInstance.delete(apiEndpoints.product.deleteProduct(id));
}
