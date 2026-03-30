import axiosInstance from "../config/axios";
import { Address } from "../types/addressTypes";
import { HealthProfile, User, UserDetail } from "../types/userTypes";
import apiEndpoints from "./apiEndpoints";

interface UsersResponse {
  message: string;
  users: User[];
}

interface UserDetailResponse {
  message: string;
  user: UserDetail;
}

interface CreateAddressPayload {
  province: string;
  district: string;
  ward: string;
  detail: string;
}

interface CreateAddressResponse {
  message: string;
  address: Address;
}

interface GetAddressesResponse {
  message: string;
  addresses: Address[];
}

interface UpdateUserPayload {
  fullName?: string;
  phone?: string;
}

interface UpdateUserResponse {
  message: string;
  user: User;
}

export async function fetchAllUsers(): Promise<User[]> {
  const res = await axiosInstance.get<UsersResponse, UsersResponse>(
    apiEndpoints.user.getAllUsers,
  );
  return res.users;
}

export async function fetchUserById(id: number): Promise<UserDetail> {
  const res = await axiosInstance.get<UserDetailResponse, UserDetailResponse>(
    apiEndpoints.user.getUserById(id),
  );
  return res.user;
}

export async function createAddress(
  payload: CreateAddressPayload,
): Promise<Address> {
  const res = await axiosInstance.post<
    CreateAddressResponse,
    CreateAddressResponse
  >(apiEndpoints.user.createAddress, payload);
  return res.address;
}

export async function fetchMyAddresses(): Promise<Address[]> {
  const res = await axiosInstance.get<
    GetAddressesResponse,
    GetAddressesResponse
  >(apiEndpoints.user.getAddresses);
  return res.addresses;
}

export async function updateUserById(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  const res = await axiosInstance.patch<UpdateUserResponse, UpdateUserResponse>(
    apiEndpoints.user.updateUserById(id),
    payload,
  );
  return res.user;
}

export async function updateUserStatus(
  id: number,
  isActive: boolean,
): Promise<User> {
  const res = await axiosInstance.patch<UpdateUserResponse, UpdateUserResponse>(
    apiEndpoints.user.updateUserStatus(id),
    { isActive },
  );
  return res.user;
}

export async function updateUserRole(
  id: number,
  role: string,
): Promise<User> {
  const res = await axiosInstance.patch<UpdateUserResponse, UpdateUserResponse>(
    apiEndpoints.user.updateUserRole(id),
    { role },
  );
  return res.user;
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  const res = await axiosInstance.delete<
    { message: string },
    { message: string }
  >(apiEndpoints.user.deleteUser(id));
  return res;
}

interface HealthProfileResponse {
  message: string;
  healthProfile: HealthProfile;
}

export async function getHealthProfile(): Promise<HealthProfile> {
  const res = await axiosInstance.get<
    HealthProfileResponse,
    HealthProfileResponse
  >(apiEndpoints.user.healthProfile);
  return res.healthProfile;
}

export async function updateHealthProfile(
  data: Partial<HealthProfile>,
): Promise<HealthProfile> {
  const res = await axiosInstance.put<
    HealthProfileResponse,
    HealthProfileResponse
  >(apiEndpoints.user.healthProfile, data);
  return res.healthProfile;
}
