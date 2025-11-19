"use client";

import { Hero } from "@/components/Hero";
import { SectionContainer } from "@/components/SectionContainer";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { FAQItem } from "@/components/FAQItem";
import { ConversationFlow } from "@/components/ConversationFlow";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

const howSteps = [
  {
    title: "Tell us how you feel",
    description: "Describe your symptoms, mood, or goals in your own words.",
    icon: "🗣️",
  },
  {
    title: "AI interprets your story",
    description: "Our AI turns it into nutrition, herbs and habit ideas – without diagnosing.",
    icon: "🧠",
  },
  {
    title: "Get a gentle support plan",
    description: "You see foods to consider, what to limit, simple routines and safety notes.",
    icon: "🌿",
  },
  {
    title: "Safety-first guidance",
    description: "Every plan includes red-flag signs and reminders to seek medical care when needed.",
    icon: "🛡️",
  },
];

const benefits = [
  "No extreme diets.",
  "No miracle promises.",
  "Just calm, practical suggestions.",
  "Helps you feel more in control of your choices.",
];

const audiences = [
  "People who want natural options first",
  "Busy people with mild symptoms",
  "Women navigating hormones & cycles",
  "People curious about food & herbs",
  "Anyone who likes understanding their body",
];

const examplePlans = [
  {
    label: "Example: Tension headache",
    summary:
      "A calm, restoring focus to ease muscle tension, rehydrate and soothe nerves.",
    foods: [
      "Water with a pinch of sea salt and lemon",
      "Herbal teas: chamomile, ginger, peppermint",
      "Leafy greens, berries, walnuts",
      "Warm soups with magnesium-rich veggies",
    ],
    habits: [
      "Step away from screens every 45 minutes",
      "Stretch neck and shoulders gently",
      "Try a slow, 10-minute walk outdoors",
    ],
    safety: [
      "Sudden, severe head pain or thunderclap headache",
      "Vision, speech or balance changes",
      "Headache after injury or with fever and stiff neck",
    ],
  },
  {
    label: "Example: Bloating after bread",
    summary:
      "Encourage digestion support while noting patterns and when to seek care.",
    foods: [
      "Warm lemon water with ginger",
      "Fermented veggies like sauerkraut or kimchi",
      "Low FODMAP veggies cooked in olive oil",
      "Soaked chia pudding with cinnamon",
    ],
    habits: [
      "Chew slowly and pause between bites",
      "Keep a gentle food journal for 1 week",
      "Relaxing breathwork before meals",
    ],
    safety: [
      "Persistent abdominal pain or vomiting",
      "Blood in stool or black, tarry stool",
      "Rapid weight loss or severe fatigue",
    ],
  },
  {
    label: "Example: Restless sleep",
    summary:
      "Create an evening ritual to wind down, nourish and note when help is needed.",
    foods: [
      "Warm oat milk with nutmeg or chamomile",
      "Protein + complex carbs at dinner",
      "Magnesium-rich pumpkin seeds",
      "Limit caffeine after 2 pm",
    ],
    habits: [
      "Dim lights one hour before bed",
      "Journaling to release looping thoughts",
      "Short yin stretches or legs up the wall",
    ],
    safety: [
      "Sleep apnea signs like loud snoring or choking",
      "Mood changes, depression or anxiety spikes",
      "Sleep loss over 3 weeks impacting daily life",
    ],
  },
];

const faqs = [
  {
    question: "Is this medical advice?",
    answer:
      "No. Rootwise shares general wellness and nutrition information. It does not diagnose, treat, cure, or prevent disease, and it’s not a substitute for professional medical advice.",
  },
  {
    question: "Can I use this instead of seeing my doctor?",
    answer:
      "No. Rootwise is not meant to replace professional medical care, especially for serious, long-lasting, or worrying symptoms. Always consult your healthcare provider.",
  },
  {
    question: "Which languages will you support?",
    answer:
      "We’re starting with English and are planning to support Spanish, Hebrew, and Russian next. Let us know which languages you’d like to see.",
  },
  {
    question: "What kind of suggestions will I see?",
    answer:
      "Expect foods, herbs, teas, gentle routines, and daily habits that may support your body, plus reminders for hydration, rest, and simple tracking.",
  },
  {
    question: "Is it safe to follow the suggestions?",
    answer:
      "Always consider your allergies, medications, and health history. Check with a qualified healthcare professional before trying anything new, and seek medical care when uncertain.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <main className="flex w-full flex-1 flex-col items-stretch gap-4 pb-16">
        <Hero />
        <ConversationSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ExamplesSection />
        <SafetySection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </PageShell>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
      {eyebrow && (
        <span className="rounded-full border border-white/25 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A]">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="text-3xl font-semibold sm:text-4xl text-[#0a0a0a]">
        {title}
      </h2>
      {description && <p className="text-base leading-7 text-[#222222]/80">{description}</p>}
    </div>
  );
}

function ConversationSection() {
  return (
    <AnimatedSection>
      <SectionContainer
        id="conversation"
        aria-labelledby="conversation-heading"
        className="gap-10"
      >
        <SectionHeading
          id="conversation-heading"
          eyebrow="Your voice matters"
          title="A chat that feels human, structure that stays smart"
          description="Tell Rootwise what's happening in everyday language. As we talk, we quietly build the plan scaffolding—session context plus your evolving body profile."
        />
        <ConversationFlow />
      </SectionContainer>
    </AnimatedSection>
  );
}

function HowItWorksSection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer id="how-it-works" aria-labelledby="how-it-works-heading" className="gap-10">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="Guided with care"
          title="How Rootwise works"
          description="From how you feel to a gentle, natural support plan."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {howSteps.map((step) => (
            <Card key={step.title} className="h-full bg-white/25">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-xl">
                {step.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#174D3A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#222222]/80">{step.description}</p>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </AnimatedSection>
  );
}

function BenefitsSection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer
        id="benefits"
        aria-labelledby="benefits-heading"
        className="gap-12 md:flex-row md:items-start"
      >
        <div className="flex-1 space-y-5 rounded-3xl border border-white/20 bg-white/30 p-8 shadow-lg backdrop-blur-md hover:shadow-xl transition-shadow">
          <h2 id="benefits-heading" className="text-2xl font-semibold text-[#174D3A]">
            Built for real life
          </h2>
          <ul className="space-y-3 text-base leading-7 text-[#222222]/85">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 text-[#174D3A]">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 space-y-5 rounded-3xl border border-white/20 bg-white/30 p-8 shadow-lg backdrop-blur-md hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-[#174D3A]">Who is Rootwise for?</h3>
          <div className="flex flex-wrap gap-3">
            {audiences.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-white/30 bg-white/30 px-4 py-2 text-sm font-medium text-[#174D3A] transition duration-200 hover:-translate-y-0.5 hover:bg-white/50 cursor-pointer"
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </SectionContainer>
    </AnimatedSection>
  );
}

function ExamplesSection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer aria-labelledby="examples-heading" className="gap-10">
        <SectionHeading
          id="examples-heading"
          eyebrow="Gentle previews"
          title="What your plan might look like"
        />
        <div className="grid gap-6 lg:grid-cols-3">
        {examplePlans.map((plan) => (
          <Card key={plan.label} className="h-full bg-white/25">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#174D3A]/80">
              {plan.label}
            </span>
            <p className="mt-3 text-sm leading-6 text-[#222222]/80">{plan.summary}</p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-[#222222]/80">
              <div>
                <p className="font-semibold text-[#174D3A]">Foods & drinks that may support you</p>
                <ul className="mt-2 space-y-1">
                  {plan.foods.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#174D3A]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[#174D3A]">Habits to experiment with</p>
                <ul className="mt-2 space-y-1">
                  {plan.habits.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#174D3A]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#F26C63]/40 bg-[#F26C63]/15 p-4 text-sm text-[#222222]/90">
              <p className="font-semibold text-[#F26C63]">When to talk to a doctor</p>
              <ul className="mt-2 space-y-1">
                {plan.safety.map((item) => (
                  <li key={item} className="flex gap-2 text-[#222222]/80">
                    <span className="text-[#F26C63]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </SectionContainer>
    </AnimatedSection>
  );
}

function SafetySection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer id="safety" aria-labelledby="safety-heading" className="gap-8" maxWidthClass="max-w-6xl">
        <div className="relative rounded-[32px] md:rounded-[40px] border border-white/50 bg-white p-6 sm:p-8 md:p-10 shadow-[0_30px_80px_rgba(20,16,12,0.15)] overflow-hidden">
          {/* Gradient balls inside container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Left ball - Green */}
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
              className="absolute -left-32 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full opacity-40 blur-3xl"
              style={{
                background: `radial-gradient(circle, #88F3AC 0%, #88F3AC 50%, transparent 100%)`
              }}
            />
            {/* Right ball - Yellow-green */}
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
              className="absolute -right-32 top-1/3 w-[32rem] h-[32rem] rounded-full opacity-40 blur-3xl"
              style={{
                background: `radial-gradient(circle, #ECFE74 0%, #ECFE74 50%, transparent 100%)`
              }}
            />
          </div>

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-4 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#174D3A]/20 bg-[#174D3A]/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A]">
              Safety first
            </span>
            <h2 id="safety-heading" className="text-3xl font-semibold text-[#0a0a0a] sm:text-4xl">
              Safety first, always
            </h2>
            <p className="text-base leading-7 text-[#0a0a0a]">
              Rootwise provides general wellness and nutrition information only. It does not offer medical advice, diagnosis or treatment.
            </p>
            <p className="text-base leading-7 text-[#0a0a0a]">
              We encourage you to talk to healthcare professionals, not avoid them. Every plan includes a safety section with red-flag symptoms to watch for.
            </p>
          </div>
          <div className="relative z-10 mt-6 rounded-2xl border border-[#F26C63]/30 bg-[#F26C63]/10 px-6 py-4 text-sm font-semibold text-[#0a0a0a] shadow-lg">
            In an emergency, contact your local emergency services immediately.
          </div>
          <div className="relative z-10 mt-6 flex justify-center">
            <Button
              href="/legal/disclaimer"
              variant="primary"
              className="border border-black/10"
            >
              Read full safety notes
            </Button>
          </div>
        </div>
      </SectionContainer>
    </AnimatedSection>
  );
}

function PricingSection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer
        id="pricing"
        aria-labelledby="pricing-heading"
        className="gap-12"
      >
        <SectionHeading
          id="pricing-heading"
          eyebrow="Early access"
          title="Start free. Upgrade when it feels right."
          description="During early access, you can try Rootwise for free. We're working on gentle monthly pricing for unlimited personalized plans."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[36px] border border-[#E9E0D7] bg-gradient-to-br from-[#FEFCFA] via-[#FBF7F2] to-[#F4EADC] p-10 shadow-[0_25px_65px_rgba(20,16,12,0.14)]">
            <div className="flex h-full flex-col">
              <div>
                <p className="text-[38px] font-semibold text-[#1E140D]">Free</p>
                <p className="mt-4 text-lg text-[#4A3F39]">
                  Explore Rootwise while we learn from your feedback and keep improving.
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-6 pt-10">
                <div className="flex flex-col text-[#1E140D]">
                  <span className="text-sm uppercase tracking-[0.3em] text-[#C0B7AF]">Intro</span>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-[50px] font-semibold leading-none">₪0</span>
                    <span className="text-base text-[#948A83]">/ month</span>
                  </div>
                </div>
                <div>
                  <Button
                    variant="unstyled"
                    href="#pricing"
                    className="w-full max-w-[200px] justify-center rounded-full bg-black px-9 py-3 text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:bg-black/95"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-[36px] p-[3px] bg-gradient-to-r from-[#F6D365] via-[#9FE080] to-[#8BC6FF] animate-gradient-rotate">
            <div className="rounded-[33px] bg-[#050505] p-10 text-[#F8F5F0] h-full">
            <div className="flex h-full flex-col">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[38px] font-semibold tracking-tight text-white">Rootwise</span>
                  <span className="rounded-full bg-gradient-to-r from-[#F6D365] via-[#9FE080] to-[#8BC6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#050505]">
                    Plus
                  </span>
                </div>
                <p className="mt-4 text-lg text-white/80">
                  Gentle monthly plan with unlimited personalized guidance and new safety features.
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-6 pt-10">
                <div>
                  <p className="text-sm text-white/40 line-through">₪29.2</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[50px] font-semibold leading-none text-white">₪17.5</span>
                    <span className="text-base text-white/70">/ month</span>
                  </div>
                </div>
                <Button
                  variant="unstyled"
                  href="#pricing"
                  className="w-full max-w-[200px] justify-center rounded-full bg-white/95 px-9 py-3 text-[#050505] shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition hover:bg-white"
                >
                  Upgrade to Plus
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </AnimatedSection>
  );
}


function FAQSection() {
  return (
    <AnimatedSection delay={0.1}>
      <SectionContainer
        id="faq"
        aria-labelledby="faq-heading"
        className="gap-10"
        maxWidthClass="max-w-none"
      >
        <SectionHeading id="faq-heading" title="Questions you might have" />
        <div className="mx-auto flex w-full flex-col gap-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </SectionContainer>
    </AnimatedSection>
  );
}
