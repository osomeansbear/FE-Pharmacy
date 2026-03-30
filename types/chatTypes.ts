export interface ChatProduct {
  id: number;
  name: string;
  slug: string;
  shortDesc: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: ChatProduct[];
}

export interface ChatResponse {
  message: string;
  reply: string;
  products: ChatProduct[];
}
