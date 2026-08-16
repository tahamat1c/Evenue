import { apiClient } from "./client";

export const sendChatMessage = async (message: string) => {
  const res = await apiClient.post<{ reply: string }>("/chatbot/", { message });
  return res.data;
};