"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../../api/chat.api";
import { useAuthStore } from "../../../stores/authStore";
import { ChatMessage, ChatProduct } from "../../../types/chatTypes";

function ProductCard({ product }: { product: ChatProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="block bg-white border border-border rounded-lg p-3 hover:border-success transition-all"
    >
      <p className="font-medium text-sm text-foreground">{product.name}</p>
      {product.shortDesc && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {product.shortDesc}
        </p>
      )}
      <span className="text-xs text-success font-medium mt-2 inline-block">
        View product →
      </span>
    </Link>
  );
}

type Segment =
  | { type: "list"; items: string[] }
  | { type: "line"; text: string };

function renderInline(text: string): React.ReactNode {
  // Split on **bold** and _italic_ tokens
  const tokens = text.split(/(\*\*.*?\*\*|_[^_]+_)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4)
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("_") && token.endsWith("_") && token.length > 2)
      return <em key={i}>{token.slice(1, -1)}</em>;
    return token;
  });
}

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  const lines = msg.content.split("\n");

  // Group consecutive numbered-list lines into a single segment
  const segments: Segment[] = [];
  for (const line of lines) {
    const listMatch = line.match(/^\d+\.\s+(.*)/);
    if (listMatch) {
      const last = segments[segments.length - 1];
      if (last?.type === "list") {
        last.items.push(listMatch[1]);
      } else {
        segments.push({ type: "list", items: [listMatch[1]] });
      }
    } else {
      segments.push({ type: "line", text: line });
    }
  }

  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <div className="p-2 bg-success rounded-full text-white flex-shrink-0 mt-1">
        <Bot className="h-4 w-4" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-none text-sm text-foreground">
          {segments.map((seg, i) => {
            if (seg.type === "list") {
              return (
                <ol key={i} className="list-decimal list-inside space-y-1 my-1 pl-2">
                  {seg.items.map((item, j) => (
                    <li key={j}>{renderInline(item)}</li>
                  ))}
                </ol>
              );
            }
            if (!seg.text.trim()) return <br key={i} />;
            return (
              <p key={i} className="mb-1 last:mb-0">
                {renderInline(seg.text)}
              </p>
            );
          })}
        </div>
        {msg.products && msg.products.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {msg.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
      <div className="p-2 bg-muted rounded-full flex-shrink-0 mt-1">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="bg-success text-white p-4 rounded-2xl rounded-tr-none text-sm">
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm MediGenius, your pharmacy assistant. I can help you find non-prescription medications for common symptoms like headaches, colds, allergies, stomach issues, and more. What symptoms are you experiencing?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendChatMessage(text, history);
      const botMsg: ChatMessage = {
        role: "assistant",
        content: res.reply,
        products: res.products,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl mx-auto bg-white rounded-xl overflow-hidden border border-border my-8">
      {/* Header */}
      <div className="bg-success p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">MediGenius</h1>
            <p className="text-xs opacity-80">Pharmacy Assistant</p>
          </div>
        </div>
        {isAuthenticated && (
          <Link
            href="/users/profile/health"
            className="text-xs opacity-80 hover:opacity-100 underline"
          >
            Manage health profile →
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 bg-secondary overflow-y-auto space-y-4">
        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <AssistantMessage key={i} msg={msg} />
          ) : (
            <UserMessage key={i} msg={msg} />
          ),
        )}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="p-2 bg-success rounded-full text-white flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-border">
        <div className="relative flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            disabled={isLoading}
            className="w-full py-6 pr-12 bg-white border border-border rounded-full focus-visible:ring-1 focus-visible:ring-success text-black placeholder:text-muted-foreground"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-success hover:bg-transparent"
          >
            <Send />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          AI can make mistakes. Always consult a real pharmacist for
          prescriptions.
        </p>
      </div>
    </div>
  );
}
