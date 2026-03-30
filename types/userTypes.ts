import { Address } from "./addressTypes";

export type AppRole = "PATIENT" | "ADMIN";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  id: number;
  userId: number;
  context: string;
  allergies?: string;
  chronicDiseases?: string;
}

export interface HealthProfile {
  allergies?: string;
  chronicDiseases?: string;
  context?: string;
}

export interface UserDetail extends User {
  addresses: Address[];
  patientProfile: PatientProfile | null;
}

export interface LoginResponse {
  message: string;
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: AppRole;
  isActive: boolean;
  addresses: Address[];
  token: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  role: "PATIENT";
}

export interface UserProfileType {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  // dob: string;
  // gender: boolean;
}
