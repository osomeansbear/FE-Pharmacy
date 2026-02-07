import axiosInstance from "../config/axios";
import { APIResponse } from "../types/apiTypes";
import { Category } from "../types/categoryTypes";
import apiEndpoints from "./apiEndpoints";

export async function fetchAllCategories(): Promise<Category[]> {
  const res = await axiosInstance.get<
    APIResponse<Category[]>,
    APIResponse<Category[]>
  >(apiEndpoints.category.getAllCategories);

  return res.data;
}
