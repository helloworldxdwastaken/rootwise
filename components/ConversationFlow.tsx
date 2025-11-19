"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, MessageCircle, User, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "guide" | "user";
  content: string;
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

const initialMessages: Message[] = [
  {
    id: "intro",
    role: "guide",
    content:
      "Hi, I'm Rootwise. Are we working through something that's bothering you, or moving toward a gentle goal?",
  },
];

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [mode, setMode] = useState<ConversationMode>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [sessionDraft, setSessionDraft] = useState<SessionDraft>({});
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => {
    if (mode === "issue") return issueFlow;
    if (mode === "goal") return goalFlow;
    return [];
  }, [mode]);

  const currentStep = steps[stepIndex];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function appendMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function handleModeSelect(selected: ConversationMode) {
    if (!selected || selected === mode) return;

    setMode(selected);
    setStepIndex(0);
    setSessionDraft({});
    setProfileDraft({});
    setIsComplete(false);
    setMessages([
      ...initialMessages,
      {
        id: crypto.randomUUID(),
        role: "user",
        content:
          selected === "issue"
            ? "I'm working through something bothering me."
            : "I'm working on a gentle goal.",
      },
      {
        id: crypto.randomUUID(),
        role: "guide",
        content:
          selected === "issue"
            ? "Thanks for trusting me with it. I'll ask a couple of quick things to tailor suggestions."
            : "Great! I'll keep the vibe encouraging. I'll ask a couple of quick things so we can guide you softly.",
      },
      {
        id: crypto.randomUUID(),
        role: "guide",
        content: (selected === "issue" ? issueFlow : goalFlow)[0].question,
      },
    ]);
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
      appendMessage({
        id: crypto.randomUUID(),
        role: "guide",
        content: nextStep.question,
      });
      setStepIndex(nextIndex);
      return;
    }

    finalizeConversation();
  }

  function finalizeConversation() {
    setIsComplete(true);
    appendMessage({
      id: crypto.randomUUID(),
      role: "guide",
      content:
        "Perfect. I'll tuck that away and draft a gentle plan with foods, herbs, rituals and safety notes tailored to you.",
    });
  }

  function handleReset() {
    setMessages(initialMessages);
    setMode(null);
    setSessionDraft({});
    setProfileDraft({});
    setStepIndex(0);
    setInputValue("");
    setIsComplete(false);
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
      <Card className="space-y-6 bg-white/30 flex flex-col" hoverEffect={false}>
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

        <div className="flex flex-1 flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-md transition-shadow hover:shadow-lg",
                  message.role === "guide"
                    ? "self-start bg-white/75 text-[#174D3A] border border-white/30"
                    : "self-end bg-[#174D3A]/90 text-[#F4EDE1]"
                )}
              >
                <div className="flex items-start gap-2">
                  {message.role === "guide" && <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  {message.role === "user" && <User className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  <span>{message.content}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              variant="secondary"
              className="w-full justify-center border-white/30 bg-white/40 text-[#174D3A] hover:bg-white/60"
              onClick={() => handleModeSelect("issue")}
            >
              I&apos;m working through something
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center border-white/30 bg-white/40 text-[#174D3A] hover:bg-white/60"
              onClick={() => handleModeSelect("goal")}
            >
              I&apos;m building toward a goal
            </Button>
          </motion.div>
        )}

        {mode && !isComplete && currentStep && (
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
            <p className="text-sm text-[#222222]/70 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#174D3A]" />
              We&apos;ll use this to craft foods, herbs, habits and safety notes you can trust.
            </p>
            <Button variant="secondary" className="sm:w-auto group" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Start another entry
            </Button>
          </motion.div>
        )}
      </Card>

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
