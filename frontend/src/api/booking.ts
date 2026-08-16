import { apiClient } from "./client";
import type { Booking, AdminBooking } from "../types";

export const createBooking = async (data: { event_id: number; number_of_tickets: number }) => {
  const res = await apiClient.post<Booking>("/bookings/", data);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await apiClient.get<Booking[]>("/bookings/");
  return res.data;
};

export const getAllBookings = async () => {
  const res = await apiClient.get<AdminBooking[]>("/bookings/all");
  return res.data;
};

export const cancelBooking = async (id: number) => {
  const res = await apiClient.delete<Booking>(`/bookings/${id}`);
  return res.data;
};