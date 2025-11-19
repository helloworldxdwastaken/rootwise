import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "How Rootwise Works | Gentle AI Wellness Conversations",
  description:
    "See how Rootwise blends compassionate chat, supervised AI, and safety-first plans to support everyday wellbeing.",
  keywords: [
    "how Rootwise works",
    "AI wellness guide",
    "gentle wellness chat",
    "safety first plan",
    "fast experiments",
  ],
};

const planExamples = [
  {
    title: "Tension headache",
    content:
      "Mineral-rich hydration reminders, contrast hydrotherapy notes for neck/shoulder release, magnesium-friendly foods, posture resets, and clear red-flag cues for sudden or severe pain.",
  },
  {
    title: "Bloating after bread",
    content:
      "Mindful chewing prompts, gentle digestive teas, low-key food journaling, probiotic-inspired sides, and warnings about persistent abdominal pain or blood in stool.",
  },
  {
    title: "Restless sleep",
    content:
      "Warm evening drinks, low-light rituals, breathing practices, restorative stretches, and reminders to seek help if insomnia pairs with mood changes or extreme fatigue.",
  },
];

const experiments = [
  {
    title: "Contrast hydrotherapy",
    detail:
      "Short alternating warm/cool water on shoulders or calves may help some people feel the tension melt away. Rootwise explains how to try it gently and when to stop.",
  },
  {
    title: "Breathing for stress",
    detail:
      "Longer exhales and belly breathing can nudge the parasympathetic response. We frame it as a simple, evidence-informed experiment—never a cure.",
  },
  {
    title: "Oral hydration",
    detail:
      "Sipping mineral-rich water throughout the day may support steadier energy. We pair hydration reminders with electrolyte-friendly ideas.",
  },
];

export default function HowRootwiseWorksPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-10">
        <header className="space-y-4 text-center text-[#1A1A1A]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#567D8B]">Rootwise flow</p>
          <h2 className="gradient-text text-3xl font-semibold">How Rootwise Works</h2>
          <p className="text-base text-[#4A4A4A]">We listen with care, ask a couple of thoughtful questions, and offer gentle experiments backed by evidence-informed references.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg">
            <h3 className="text-xl font-semibold">1. Conversational intake</h3>
            <p className="mt-2 text-sm text-[#4A4A4A]">You type how you feel in your own words. Rootwise mirrors your tone, captures context, and builds a mini session profile behind the scenes.</p>
          </article>
          <article className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg">
            <h3 className="text-xl font-semibold">2. Why we ask questions</h3>
            <p className="mt-2 text-sm text-[#4A4A4A]">A few gentle prompts prevent silly suggestions, surface safety watchouts, and learn your vibe—encouraging, calming, or straight-to-the-point.</p>
          </article>
          <article className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg">
            <h3 className="text-xl font-semibold">3. Humans + AI</h3>
            <p className="mt-2 text-sm text-[#4A4A4A]">AI drafts the plan, but human coaches and medical-safety reviewers design the guardrails, tone, and fast experiments.</p>
          </article>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-[#1A1A1A]">Pill-shaped UI modules</h3>
          <p className="text-[#4A4A4A]">Each plan appears in friendly, pill-shaped cards: hydration cues, herbal ideas, nervous-system rituals, and safety alerts.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {planExamples.map((example) => (
              <div key={example.title} className="rounded-3xl border border-white/30 bg-white/70 p-5 shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C38F4A]">Example</p>
                <h4 className="mt-2 text-xl font-semibold">{example.title}</h4>
                <p className="mt-2 text-sm text-[#4A4A4A]">{example.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-[#1A1A1A]">Fast Experiments</h3>
          <p className="text-[#4A4A4A]">Mini body-friendly tests you can try for a few days. We explain how to listen to your body, when to stop, and which red flags signal professional care.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {experiments.map((exp) => (
              <div key={exp.title} className="rounded-3xl border border-white/30 bg-white/70 p-5 shadow-lg">
                <h4 className="text-lg font-semibold">{exp.title}</h4>
                <p className="mt-2 text-sm text-[#4A4A4A]">{exp.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-black/10 bg-[#050505] p-8 text-white">
          <h3 className="text-2xl font-semibold">Safety-first, always</h3>
          <ul className="list-disc space-y-2 pl-5 text-white/80">
            <li>Every plan includes red-flag reminders urging professional care.</li>
            <li>No extreme diets, cleanses, or miracle cures—ever.</li>
            <li>Privacy-first: we never sell personal data.</li>
          </ul>
          <Button href="/legal/disclaimer" className="mt-4 w-full justify-center">
            Read full safety notes
          </Button>
        </section>

        <div className="text-center">
          <Button href="/" className="justify-center">
            Try Rootwise gently
          </Button>
        </div>
      </SectionContainer>
    </PageShell>
  );
}
