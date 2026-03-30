import axiosInstance from "../config/axios";
import { Category } from "../types/categoryTypes";
import apiEndpoints from "./apiEndpoints";

interface CategoriesEnvelope {
  message: string;
  categories?: Category[];
  data?: Category[] | { categories?: Category[] };
}

interface CategoryResponse {
  message: string;
  category?: Category;
  data?: Category;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  parentId?: number | null;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export async function fetchAllCategories(): Promise<Category[]> {
  const res = await axiosInstance.get<CategoriesEnvelope, CategoriesEnvelope>(
    apiEndpoints.category.getAllCategories,
  );

  if (Array.isArray(res.categories)) {
    return res.categories;
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (
    res.data &&
    Array.isArray((res.data as { categories?: Category[] }).categories)
  ) {
    return (res.data as { categories: Category[] }).categories;
  }

  return [];
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const res = await axiosInstance.post<CategoryResponse, CategoryResponse>(
    apiEndpoints.category.createCategory,
    payload,
  );
  return res.category ?? res.data!;
}

export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const res = await axiosInstance.patch<CategoryResponse, CategoryResponse>(
    apiEndpoints.category.updateCategory(id),
    payload,
  );
  return res.category ?? res.data!;
}

export async function deleteCategory(id: number): Promise<void> {
  await axiosInstance.delete(apiEndpoints.category.deleteCategory(id));
}
