import axiosInstance from "../config/axios";
import { LoginResponse, RegisterPayload, UserDetail } from "../types/userTypes";
import apiEndpoints from "./apiEndpoints";

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return axiosInstance.post(apiEndpoints.auth.login, { email, password });
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<{ message: string; user: UserDetail }> {
  return axiosInstance.post(apiEndpoints.auth.register, payload);
}
