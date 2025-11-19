import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Why You Can Trust Rootwise",
  description: "See how Rootwise blends humans, AI, and evidence-informed practices to stay compassionate, safe, and privacy-first.",
  keywords: [
    "trust Rootwise",
    "evidence informed wellness",
    "privacy first AI",
    "safe wellness app",
    "gentle wellness guidance",
  ],
};

const trustSignals = [
  {
    title: "Transparency",
    detail: "We explain how each suggestion is created, referencing curated research notes, traditions, and monitored AI outputs.",
  },
  {
    title: "Humans + AI",
    detail: "Medical-safety reviewers, herbal enthusiasts, and writers set the guardrails. AI organizes the ideas—we keep the tone compassionate.",
  },
  {
    title: "No sensationalism",
    detail: "No miracle promises, detox buzzwords, or extreme diets. Calm, realistic guidance only.",
  },
  {
    title: "Privacy-first",
    detail: "We never sell data and honor GDPR-style rights. You decide what stays, edits, or disappears.",
  },
  {
    title: "Safety-first",
    detail: "Red-flag reminders, referral cues, and allergy notes live inside every plan.",
  },
  {
    title: "Culturally inclusive",
    detail: "Designed for English, Spanish, Hebrew, and Russian speakers—with neutral language that respects diverse traditions.",
  },
];

export default function WhyTrustPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-10">
        <header className="space-y-4 text-center text-[#1A1A1A]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6B7BA5]">Trust signals</p>
          <h2 className="gradient-text text-3xl font-semibold">Why You Can Trust Rootwise</h2>
          <p className="text-base text-[#4A4A4A]">We stay compassionate, transparent, and evidence-informed so you can explore wellness ideas with confidence.</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {trustSignals.map((signal) => (
            <article key={signal.title} className="rounded-3xl border border-white/35 bg-white/80 p-6 text-left shadow-lg">
              <h3 className="text-xl font-semibold text-[#1A1A1A]">{signal.title}</h3>
              <p className="mt-2 text-sm text-[#4A4A4A]">{signal.detail}</p>
            </article>
          ))}
        </section>

        <section className="space-y-3 rounded-3xl border border-[#174D3A]/20 bg-[#174D3A]/10 p-6 text-[#174D3A]">
          <h3 className="text-2xl font-semibold">Compassion &gt; sensationalism</h3>
          <p>Rootwise was built for calm daily life. We champion gentle experiments, not dramatic overnight promises. Every plan invites you to check in with yourself and your clinicians.</p>
        </section>

        <div className="text-center">
          <Button href="/how-rootwise-works" className="justify-center">
            Learn how it works
          </Button>
        </div>
      </SectionContainer>
    </PageShell>
  );
}
