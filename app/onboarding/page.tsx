"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send, Loader2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type OnboardingProgress = {
  name: boolean;
  dateOfBirth: boolean;
  sex: boolean;
  conditions: boolean;
  allergies: boolean;
  dietary: boolean;
  lifestyle: boolean;
  goals: boolean;
};

const progressSteps = [
  { key: "name", label: "Personal Info" },
  { key: "dateOfBirth", label: "Basic Details" },
  { key: "sex", label: "Health Profile" },
  { key: "conditions", label: "Medical History" },
  { key: "allergies", label: "Allergies" },
  { key: "dietary", label: "Diet Preferences" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "goals", label: "Wellness Goals" },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Rootwise, your wellness companion. Let's get to know each other. This will only take 5-10 minutes, and we'll have a natural conversation - no boring forms! What's your full name?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<Partial<OnboardingProgress>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

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
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          currentProgress: progress,
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
        
        // Update progress
        if (data.progress) {
          setProgress(data.progress);
        }
        
        // If onboarding complete, redirect
        if (data.completed) {
          setTimeout(() => {
            router.push("/personal/overview");
          }, 2000);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
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

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSteps = progressSteps.length;
  const progressPercent = (completedCount / totalSteps) * 100;

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdf8f3]">
        <Loader2 className="h-8 w-8 animate-spin text-[#174D3A]" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#fdf8f3]">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-[80px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#F4C977]/30 blur-[90px]" />
      </div>

      {/* Header with progress */}
      <div className="relative z-10 border-b border-white/50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome to Rootwise</h1>
          <p className="text-sm text-slate-500">Let's set up your wellness profile</p>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>{completedCount} of {totalSteps} completed</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Progress steps */}
          <div className="mt-4 flex flex-wrap gap-2">
            {progressSteps.map((step) => {
              const isComplete = progress[step.key as keyof OnboardingProgress];
              return (
                <div
                  key={step.key}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs",
                    isComplete
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                  <span className="text-sm font-semibold text-white">R</span>
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-3xl px-6 py-4",
                  message.role === "user"
                    ? "bg-[#174D3A] text-white"
                    : "bg-white/80 text-slate-900 backdrop-blur-sm border border-white/50"
                )}
              >
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs",
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
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#174D3A]">
                  <span className="text-sm font-semibold text-white">You</span>
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
              <div className="max-w-[70%] rounded-3xl border border-white/50 bg-white/80 px-6 py-4 backdrop-blur-sm">
                <p className="text-slate-500">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-white/50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <form onSubmit={handleSend} className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={sending}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#174D3A] text-white transition-all hover:bg-[#174D3A]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

