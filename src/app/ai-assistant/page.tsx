"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send } from "lucide-react";
import { useState } from "react";

// Define a type for your messages if you plan to make this dynamic later

export default function ChatPage() {
  const [input, setInput] = useState<string>("");

  // Handler example with TypeScript event typing
  const handleSend = () => {
    if (!input.trim()) return;
    console.log("Sending message:", input);
    // Add logic to send message to API here
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className=" flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 my-8">
      {/* Header */}
      <div className="bg-success p-4 text-white flex items-center gap-3">
        <div className="p-1.5 rounded-full">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-semibold text-lg">Pharma Assistant</h1>
          <p className="text-xs opacity-80">
            Always verify with a professional.
          </p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Assistant Welcome Message */}
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="p-2 bg-success rounded-full text-white flex-shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm">
            <p>
              Hello! I&apos;m MediGenius, your pharmacy assistant. How can I
              help you today with your health or medication questions?
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question..."
            className="w-full py-6 pr-12 bg-gray-100 border-none rounded-full focus-visible:ring-1 focus-visible:ring-[#114232] text-gray-700 placeholder:text-gray-400"
          />
          <Button
            size="icon"
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-success justify-center"
          >
            <Send className="" />
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI can make mistakes. Please consult a real pharmacist for
          prescriptions.
        </p>
      </div>
    </div>
  );
}
