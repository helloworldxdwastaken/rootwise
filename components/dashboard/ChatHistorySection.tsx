"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Send, MessageCircle, User, Sparkles, Plus, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatSession = {
  id: string;
  startedAt: string;
  endedAt?: string | null;
  messages?: Array<{
    role: string;
    content: string;
    createdAt: string;
  }>;
  _count?: {
    messages: number;
  };
};

type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
};

export function ChatHistorySection() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const renderMessageContent = (message: ChatMessage) => {
    if (message.role === "ASSISTANT") {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-message text-sm leading-relaxed">
          {message.content}
        </ReactMarkdown>
      );
    }

    return <span className="whitespace-pre-wrap">{message.content}</span>;
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession);
    }
  }, [selectedSession]);

  async function loadSessions(preserveSelection: boolean = true) {
    try {
      const response = await fetch("/api/chat/session");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        setSelectedSession((prev) => {
          if (
            preserveSelection &&
            prev &&
            data.sessions?.some((s: ChatSession) => s.id === prev)
          ) {
            return prev;
          }

          return data.sessions && data.sessions.length > 0
            ? data.sessions[0].id
            : null;
        });
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const response = await fetch(`/api/chat/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.session?.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  async function handleCreateSession() {
    try {
      const response = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "web" }),
      });
      
      if (response.ok) {
        const data = await response.json();
        await loadSessions(false);
        setSelectedSession(data.session.id);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSession) return;

    const userMsg = messageInput;
    setMessageInput("");
    setSending(true);

    try {
      // Call AI response endpoint (saves user message + generates AI response)
      const response = await fetch("/api/chat/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession,
          userMessage: userMsg,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Reload messages to show both user message and AI response
        loadMessages(selectedSession);
        
        // If AI extracted conditions, show notification
        if (data.extracted?.conditions?.length > 0) {
          console.log("Auto-added conditions:", data.extracted.conditions);
        }
      } else {
        console.error("AI response failed");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (!sessionId || deletingId) return;
    const confirmDelete = confirm("Delete this chat session and its messages?");
    if (!confirmDelete) return;

    setDeletingId(sessionId);
    try {
      const response = await fetch(`/api/chat/session/${sessionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const wasActive = selectedSession === sessionId;

        setSessions((prev) => {
          const updated = prev.filter((session) => session.id !== sessionId);
          setSelectedSession((current) => {
            if (current === sessionId) {
              const next = updated[0]?.id ?? null;
              return next;
            }
            return current;
          });
          return updated;
        });

        if (wasActive) {
          setMessages([]);
        }
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-[#174D3A]">Loading chat history...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174D3A]">
            Sessions
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateSession}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174D3A]/10 text-[#174D3A] hover:bg-[#174D3A]/20"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => selectedSession && handleDeleteSession(selectedSession)}
              disabled={!selectedSession || deletingId === selectedSession}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F26C63]/30 text-[#F26C63] transition hover:bg-[#F26C63]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <Card className="bg-white/20 text-center py-8">
            <p className="text-xs text-[#222222]/60">No chat history yet</p>
            <Button onClick={handleCreateSession} variant="secondary" className="mt-4 text-xs">
              Start First Chat
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session.id)}
                className={`w-full text-left rounded-2xl border p-3 transition-all ${
                  selectedSession === session.id
                    ? "border-[#174D3A] bg-[#174D3A]/10"
                    : "border-white/30 bg-white/40 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-3 w-3 text-[#174D3A]" />
                  <span className="text-xs font-medium text-[#174D3A]">
                    {new Date(session.startedAt).toLocaleDateString()}
                  </span>
                  {!session.endedAt && (
                    <span className="rounded-full bg-[#174D3A] px-1.5 py-0.5 text-[0.6rem] text-white">
                      Active
                    </span>
                  )}
                </div>
                {session.messages && session.messages[0] && (
                  <p className="text-xs text-[#222222]/70 truncate">
                    {session.messages[0].content}
                  </p>
                )}
                {session._count && (
                  <p className="text-[0.65rem] text-[#222222]/50 mt-1">
                    {session._count.messages} messages
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages View */}
      <Card className="bg-white/40 flex h-[520px] flex-col sm:h-[580px] lg:h-[640px]">
        {!selectedSession ? (
          <div className="flex-1 flex items-center justify-center text-[#222222]/60">
            Select a session to view messages
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center text-[#222222]/60 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        message.role === "USER"
                          ? "bg-[#174D3A]/90 text-white"
                          : "bg-white/75 text-[#174D3A] border border-white/40"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "ASSISTANT" && <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        {message.role === "USER" && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        {renderMessageContent(message)}
                      </div>
                      <p className="text-[0.65rem] opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-white/20 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
                />
                <Button type="submit" disabled={sending || !messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-[#222222]/60 mt-2">
                💡 AI responses powered by Groq Llama 3.1. Messages auto-save to your history.
              </p>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
