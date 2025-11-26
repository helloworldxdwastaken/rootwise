"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type OverviewChatProps = {
  energyScore?: number | null;
  sleepHours?: string | null;
  hydrationGlasses?: number;
  symptoms?: string[];
  caloriesConsumed?: number;
  onDataUpdated?: () => void;
};

export function OverviewChat({ 
  energyScore = null, 
  sleepHours = null,
  hydrationGlasses = 0,
  symptoms = [],
  caloriesConsumed = 0,
  onDataUpdated
}: OverviewChatProps) {
  // Generate personalized welcome message
  const getWelcomeMessage = () => {
    if (energyScore !== null && energyScore < 5) {
      return "I notice your energy is a bit low today. Let's talk about what might help - whether it's nutrition, rest, or gentle movement. How are you feeling?";
    }
    if (energyScore !== null && energyScore >= 7) {
      return "Your energy looks great today! That's wonderful. I'm here if you want to maintain this momentum or explore new wellness habits.";
    }
    if (symptoms.length > 0) {
      return `I see you're tracking ${symptoms.join(", ")} today. I'm here to help you understand what might support your body. What would you like to know?`;
    }
    return "Hi! I'm here to help you track and understand your wellness. You can log your daily metrics or ask me anything about your health, energy, sleep, or nutrition.";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            energyScore,
            sleepHours,
            hydrationGlasses,
            symptoms,
            caloriesConsumed,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, aiMessage]);
        
        // If AI extracted health data, trigger parent to refresh
        if (data.dataExtracted && onDataUpdated) {
          setTimeout(() => onDataUpdated(), 1000); // Small delay for backend processing
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I couldn't process that right now. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    "Why is my energy low today?",
    "Tips for better sleep",
    "What should I eat for energy?",
    "Explain my symptoms",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/50 bg-white/80 shadow-[0_8px_24px_rgba(15,40,34,0.08)] backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-white/50 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Wellness Assistant</h3>
            <p className="text-xs text-slate-500">Ask about your health data</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user"
                  ? "bg-[#174D3A] text-white"
                  : "bg-slate-100 text-slate-900"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={cn(
                  "mt-1 text-[0.65rem]",
                  message.role === "user" ? "text-white/60" : "text-slate-400"
                )}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174D3A]">
                <span className="text-xs font-semibold text-white">You</span>
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </div>
            <div className="max-w-[75%] rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 2 && (
        <div className="border-t border-white/50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-white/50 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your wellness..."
            disabled={sending}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#174D3A] text-white transition-all hover:bg-[#174D3A]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

