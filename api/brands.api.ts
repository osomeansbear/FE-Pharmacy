import axiosInstance from "../config/axios";
import { Brand } from "../types/brandTypes";
import apiEndpoints from "./apiEndpoints";

interface BrandResponse {
  message: string;
  brand: Brand;
}

interface BrandsResponse {
  message: string;
  brands: Brand[];
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

export async function fetchAllBrands(): Promise<Brand[]> {
  const res = await axiosInstance.get<BrandsResponse, BrandsResponse>(
    apiEndpoints.brands.getAllBrands,
  );

  return Array.isArray(res.brands) ? res.brands : [];
}

export async function fetchBrandById(id: number): Promise<Brand> {
  const res = await axiosInstance.get<BrandResponse, BrandResponse>(
    apiEndpoints.brands.getBrandById(id),
  );

  return res.brand;
}

export async function createBrand(payload: CreateBrandPayload): Promise<Brand> {
  const res = await axiosInstance.post<BrandResponse, BrandResponse>(
    apiEndpoints.brands.createBrand,
    payload,
  );

  return res.brand;
}

export async function updateBrand(
  id: number,
  payload: UpdateBrandPayload,
): Promise<Brand> {
  const res = await axiosInstance.patch<BrandResponse, BrandResponse>(
    apiEndpoints.brands.updateBrand(id),
    payload,
  );

  return res.brand;
}

export async function deleteBrand(id: number): Promise<void> {
  await axiosInstance.delete(apiEndpoints.brands.deleteBrand(id));
}
