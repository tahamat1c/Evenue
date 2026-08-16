import { apiClient } from "./client";
import type { Event } from "../types";

export const getEvents = async (filters?: { category?: string; location?: string }) => {
  const res = await apiClient.get<Event[]>("/events/", { params: filters });
  return res.data;
};

export const getEventById = async (id: number) => {
  const res = await apiClient.get<Event>(`/events/${id}`);
  return res.data;
};

export const createEvent = async (data: Omit<Event, "id" | "created_at" | "image_url">) => {
  const res = await apiClient.post<Event>("/events/", data);
  return res.data;
};

export const updateEvent = async (id: number, data: Partial<Event>) => {
  const res = await apiClient.put<Event>(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: number) => {
  const res = await apiClient.delete(`/events/${id}`);
  return res.data;
};

export const uploadEventImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post<Event>(`/events/${id}/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};