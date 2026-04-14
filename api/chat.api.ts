import axiosInstance from "../config/axios";
import { ChatMessage, ChatResponse } from "../types/chatTypes";
import apiEndpoints from "./apiEndpoints";

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<ChatResponse> {
  const res = await axiosInstance.post<ChatResponse, ChatResponse>(
    apiEndpoints.chat.sendMessage,
    { message, history },
    { timeout: 60000 },
  );
  return res;
}

export type { ChatMessage };
