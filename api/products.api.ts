import axiosInstance from "../config/axios";
import { Product, ProductDetail, ProductUnit } from "../types/productTypes";
import apiEndpoints from "./apiEndpoints";

export interface AddUnitPayload {
  unitType: "TABLET" | "BOX";
  price: string;
  conversionFactor: string;
  isDefault?: boolean;
}

export interface UpdateUnitPayload {
  price?: string;
  conversionFactor?: string;
  isDefault?: boolean;
}

export interface UpsertDetailPayload {
  description?: string | null;
  usage?: string | null;
  ingredients?: string | null;
}

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

interface UnitEnvelope {
  message: string;
  data?: ProductUnit;
}

export async function addProductUnit(
  productId: number,
  payload: AddUnitPayload,
): Promise<ProductUnit> {
  const res = await axiosInstance.post<UnitEnvelope, UnitEnvelope>(
    apiEndpoints.product.addUnit(productId),
    payload,
  );
  return res.data!;
}

export async function updateProductUnit(
  productId: number,
  unitId: number,
  payload: UpdateUnitPayload,
): Promise<ProductUnit> {
  const res = await axiosInstance.patch<UnitEnvelope, UnitEnvelope>(
    apiEndpoints.product.updateUnit(productId, unitId),
    payload,
  );
  return res.data!;
}

export async function deleteProductUnit(
  productId: number,
  unitId: number,
): Promise<void> {
  await axiosInstance.delete(apiEndpoints.product.deleteUnit(productId, unitId));
}

export async function createProductDetail(
  productId: number,
  payload: UpsertDetailPayload,
): Promise<void> {
  await axiosInstance.post(apiEndpoints.product.createDetail(productId), payload);
}

export async function updateProductDetail(
  productId: number,
  payload: UpsertDetailPayload,
): Promise<void> {
  await axiosInstance.patch(apiEndpoints.product.updateDetail(productId), payload);
}

export async function assignProductCategory(
  productId: number,
  categoryId: number,
): Promise<void> {
  await axiosInstance.post(apiEndpoints.product.assignCategory(productId), { categoryId });
}

export async function removeProductCategory(
  productId: number,
  categoryId: number,
): Promise<void> {
  await axiosInstance.delete(apiEndpoints.product.removeCategory(productId, categoryId));
}
