import { apiClient } from "./client";
import type { AuthResponse, User } from "../types";

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await apiClient.post<User>("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await apiClient.post<AuthResponse>("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};