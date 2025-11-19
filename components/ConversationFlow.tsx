"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, MessageCircle, User, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "guide" | "user";
  content: string;
  isTyping?: boolean;
  citations?: string[];
};

type FlowStep = {
  field: keyof SessionDraft;
  question: string;
  helper?: string;
};

type ConversationMode = "issue" | "goal" | null;

type SessionDraft = {
  focus?: string;
  nuance?: string;
  timeframe?: string;
  desiredChange?: string;
  successPicture?: string;
  notes?: string;
};

type ProfileDraft = {
  watchouts?: string;
  preferredTone?: string;
};

const issueFlow: FlowStep[] = [
  {
    field: "focus",
    question: "Alright, tell me what symptom or discomfort is showing up right now.",
  },
  {
    field: "nuance",
    question: "How is it impacting your day? Anything that makes it feel better or worse?",
  },
  {
    field: "timeframe",
    question: "When did this begin and is there anything important we should note (meds, diagnoses, red flags)?",
    helper: "Quick reminders help Rootwise surface safety notes.",
  },
  {
    field: "notes",
    question: "Anything else your future self would want us to remember for next time?",
  },
];

const goalFlow: FlowStep[] = [
  {
    field: "desiredChange",
    question: "Lovely. What gentle change are you hoping for?",
  },
  {
    field: "successPicture",
    question: "Paint me a picture of what success feels like in your body or day.",
  },
  {
    field: "timeframe",
    question: "Is there a timeframe or rhythm you're working with?",
  },
  {
    field: "notes",
    question: "Any watchouts (meds, allergies) or preferences we should keep in mind?",
  },
];

type DemoMessage = {
  role: "guide" | "user";
  content: string;
  delay: number;
  citations?: string[];
};

const demoConversation: DemoMessage[] = [
  {
    role: "guide",
    content: "Hi, I'm Rootwise. What's going on in your body today?",
    delay: 0,
  },
  {
    role: "user",
    content: "I get menstrual cramps. Any suggestions?",
    delay: 2000,
  },
  {
    role: "guide",
    content: "Got you. Warm foot baths can relax pelvic muscles, and some research supports it. Ginger tea and magnesium-rich foods may also ease cramping for many people.",
    delay: 1500,
    citations: ["Mayo Clinic", "American Hospital"],
  },
  {
    role: "guide",
    content: "I'll put these into a gentle plan with safety notes.\n\nIf the pain becomes intense or bleeding is heavy, it's important to get checked quickly.",
    delay: 1500,
  },
];

const initialMessages: Message[] = [];

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [mode, setMode] = useState<ConversationMode>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [sessionDraft, setSessionDraft] = useState<SessionDraft>({});
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-play demo conversation
  useEffect(() => {
    playDemoConversation();
  }, []);

  function playDemoConversation() {
    let currentDelay = 500; // Start delay
    let messageCounter = 0;
    
    demoConversation.forEach((msg, index) => {
      currentDelay += msg.delay;
      
      setTimeout(() => {
        if (msg.role === "guide") {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            messageCounter++;
            // Add message fully formed (no typing animation to prevent layout shift)
            setMessages((prev) => [...prev, {
              id: `demo-guide-${index}-${messageCounter}`,
              role: "guide",
              content: msg.content,
              citations: msg.citations,
            }]);
          }, 800);
        } else {
          messageCounter++;
          // User messages appear instantly
          setMessages((prev) => [...prev, {
            id: `demo-user-${index}-${messageCounter}`,
            role: "user",
            content: msg.content,
          }]);
        }
        
        if (index === demoConversation.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            // Auto-restart after 5 seconds
            setTimeout(() => {
              handleReset();
            }, 5000);
          }, 2000);
        }
      }, currentDelay);
    });
  }

  const steps = useMemo(() => {
    if (mode === "issue") return issueFlow;
    if (mode === "goal") return goalFlow;
    return [];
  }, [mode]);

  const currentStep = steps[stepIndex];

  // Removed auto-scroll to prevent page jumping

  function appendMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function appendMessageWithTyping(message: Message, delay: number = 800) {
    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { ...message, isTyping: true }]);
      
      // After message appears, simulate typing effect completion
      setTimeout(() => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === message.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, 50);
    }, delay);
  }

  function handleModeSelect(selected: ConversationMode) {
    if (!selected || selected === mode) return;

    setMode(selected);
    setStepIndex(0);
    setSessionDraft({});
    setProfileDraft({});
    setIsComplete(false);
    
    // User message appears immediately
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content:
        selected === "issue"
          ? "I'm working through something bothering me."
          : "I'm working on a gentle goal.",
    };
    
    const response1 = {
      id: crypto.randomUUID(),
      role: "guide" as const,
      content:
        selected === "issue"
          ? "Thanks for trusting me with it. I'll ask a couple of quick things to tailor suggestions."
          : "Great! I'll keep the vibe encouraging. I'll ask a couple of quick things so we can guide you softly.",
    };
    
    const response2 = {
      id: crypto.randomUUID(),
      role: "guide" as const,
      content: (selected === "issue" ? issueFlow : goalFlow)[0].question,
    };
    
    setMessages([...initialMessages, userMessage]);
    
    // Add responses with typing delay
    appendMessageWithTyping(response1, 1000);
    setTimeout(() => {
      appendMessageWithTyping(response2, 1200);
    }, 2200);
  }

  function handleSubmit() {
    if (!mode || !currentStep || !inputValue.trim()) {
      return;
    }

    const value = inputValue.trim();
    setInputValue("");

    appendMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: value,
    });

    setSessionDraft((prev) => {
      const next: SessionDraft = { ...prev };
      next[currentStep.field] = value;
      return next;
    });

    if (currentStep.field === "notes") {
      setProfileDraft((prev) => ({
        ...prev,
        watchouts: value,
      }));
    }

    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      appendMessageWithTyping({
        id: crypto.randomUUID(),
        role: "guide",
        content: nextStep.question,
      }, 1000);
      setStepIndex(nextIndex);
      return;
    }

    setTimeout(() => {
      finalizeConversation();
    }, 800);
  }

  function finalizeConversation() {
    setIsComplete(true);
    appendMessageWithTyping({
      id: crypto.randomUUID(),
      role: "guide",
      content:
        "Perfect. I'll tuck that away and draft a gentle plan with foods, herbs, rituals and safety notes tailored to you.",
    }, 1000);
  }

  function handleReset() {
    setMessages([]);
    setMode(null);
    setSessionDraft({});
    setProfileDraft({});
    setStepIndex(0);
    setInputValue("");
    setIsComplete(false);
    setIsDemoRunning(false);
    setDemoIndex(0);
    
    // Restart demo
    setTimeout(() => {
      setIsDemoRunning(true);
      playDemoConversation();
    }, 500);
  }

  const sessionSummary = useMemo(() => {
    if (!mode) return null;

    if (mode === "issue") {
      return {
        entryType: "issue",
        focus: sessionDraft.focus ?? "",
        nuance: sessionDraft.nuance ?? "",
        timeframe: sessionDraft.timeframe ?? "",
        notes: sessionDraft.notes ?? "",
      };
    }

    return {
      entryType: "goal",
      desiredChange: sessionDraft.desiredChange ?? "",
      successPicture: sessionDraft.successPicture ?? "",
      timeframe: sessionDraft.timeframe ?? "",
      notes: sessionDraft.notes ?? "",
    };
  }, [mode, sessionDraft]);

  const profileSummary = useMemo(() => {
    if (!profileDraft.watchouts) return null;
    return {
      watchouts: profileDraft.watchouts,
      preferredTone: profileDraft.preferredTone ?? "soft + encouraging",
    };
  }, [profileDraft]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)]">
      <div className="relative">
        {/* Animated gradient balls behind chat - contained */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-24 top-1/4 w-[22rem] h-[22rem] rounded-full opacity-30 blur-3xl"
            style={{
              background: `radial-gradient(circle, #88F3AC 0%, #88F3AC 50%, transparent 100%)`
            }}
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -right-24 bottom-1/4 w-[24rem] h-[24rem] rounded-full opacity-25 blur-3xl"
            style={{
              background: `radial-gradient(circle, #ECFE74 0%, #ECFE74 50%, transparent 100%)`
            }}
          />
        </div>
        
      <Card className="space-y-6 bg-white/30 flex flex-col relative z-10" hoverEffect={false}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#174D3A]/10"
            >
              <MessageCircle className="h-5 w-5 text-[#174D3A]" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-[#174D3A]">Start a Rootwise check-in</h3>
              <p className="text-xs text-[#222222]/70">
                Warm conversation, smart structure behind the scenes
              </p>
            </div>
          </div>
          {mode && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-[#174D3A]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#174D3A]"
            >
              {mode === "issue" ? "Issue focus" : "Goal focus"}
            </motion.span>
          )}
        </div>

        <div className="flex flex-col gap-3 h-[400px] overflow-y-auto scrollbar-hide">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                layout
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-md will-change-auto",
                  message.role === "guide"
                    ? "self-start bg-white/75 text-[#174D3A] border border-white/30"
                    : "self-end bg-[#174D3A]/90 text-[#F4EDE1]"
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    {message.role === "guide" && <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    {message.role === "user" && <User className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  </div>
                  {message.citations && message.citations.length > 0 && (
                    <div className="ml-6 mt-2 flex flex-wrap gap-2">
                      {message.citations.map((citation, idx) => (
                        <div key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-[#174D3A] px-2.5 py-1 text-[0.65rem] font-medium text-white border border-[#174D3A]">
                          <Globe className="h-3 w-3" />
                          <span>{citation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>


        {false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 border-t border-white/20 pt-5"
          >
            {currentStep.helper && (
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#174D3A]/70 flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                {currentStep.helper}
              </p>
            )}
            <label className="sr-only" htmlFor="conversation-input">
              {currentStep.question}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="conversation-input"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type your reply..."
                className="flex-1 rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-[#222222] shadow-inner transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40 focus:shadow-lg"
                autoFocus
              />
              <Button
                className="w-full justify-center sm:w-auto group"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
              >
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Send
              </Button>
            </div>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/20 pt-5"
          >
            <p className="text-xs text-[#222222]/60 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-[#174D3A]" />
              This is a preview of how Rootwise conversations feel—warm, supportive and safety-first.
            </p>
          </motion.div>
        )}
      </Card>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/20" hoverEffect={false}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#174D3A] flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Session profile
            </h4>
            <AnimatePresence mode="wait">
              {sessionSummary ? (
                <motion.dl
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-4 text-sm text-[#222222]/80"
                >
                  {Object.entries(sessionSummary)
                    .filter(([, value]) => value)
                    .map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="pb-3 border-b border-white/20 last:border-0"
                      >
                        <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-[#174D3A]/80 mb-1.5">
                          {humanizeKey(key)}
                        </dt>
                        <dd className="text-sm leading-relaxed">{value as string}</dd>
                      </motion.div>
                    ))}
                </motion.dl>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-[#222222]/60 text-center py-6"
                >
                  Start a conversation to see the behind-the-scenes structure fill in automatically.
                </motion.p>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/15" hoverEffect={false}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#174D3A] flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile draft
            </h4>
            <AnimatePresence mode="wait">
              {profileSummary ? (
                <motion.dl
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-4 text-sm text-[#222222]/80"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pb-3 border-b border-white/20"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-[#174D3A]/80 mb-1.5">
                      Watchouts
                    </dt>
                    <dd className="text-sm leading-relaxed">{profileSummary.watchouts}</dd>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-[#174D3A]/80 mb-1.5">
                      Preferred tone
                    </dt>
                    <dd className="text-sm leading-relaxed">{profileSummary.preferredTone}</dd>
                  </motion.div>
                </motion.dl>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-[#222222]/60 text-center py-6"
                >
                  Rootwise listens for patterns to update your body profile—like medications, allergies, or tone
                  preferences.
                </motion.p>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function humanizeKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function TypewriterText({ text, isTyping }: { text: string; isTyping?: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // 30ms per character for smooth typing

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isTyping]);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayedText("");
  }, [text]);

  // Render text with proper whitespace handling
  return (
    <span className="whitespace-pre-wrap">
      {displayedText || text}
    </span>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-[85%] self-start rounded-2xl px-4 py-3 bg-white/75 text-[#174D3A] border border-white/30 shadow-md"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 flex-shrink-0" />
        <div className="flex gap-1">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-[#174D3A]"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-[#174D3A]"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-[#174D3A]"
          />
        </div>
      </div>
    </motion.div>
  );
}
