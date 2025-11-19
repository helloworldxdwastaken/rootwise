import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Our Approach to Wellness | Rootwise",
  description: "Discover Rootwise’s gentle, safety-first philosophy: support, not cures, and empowerment alongside professional care.",
  keywords: [
    "Rootwise approach",
    "gentle wellness philosophy",
    "safety first wellness",
    "support not cure",
    "empowered wellness",
  ],
};

const beliefs = [
  {
    title: "Gentle & patient-centered",
    body:
      "We believe wellness shifts happen when people feel calm and supported. Rootwise nudges you toward tiny experiments, reflective journaling, and tender self-awareness.",
  },
  {
    title: "Support, not cure",
    body:
      "Foods, herbs, and habits are presented as supportive ideas. We do not frame them as cures, treatments, or replacements for professional care.",
  },
  {
    title: "Red-flag awareness",
    body:
      "Every plan highlights warning signs that demand urgent medical attention. When you spot a red flag, Rootwise tells you to contact clinicians immediately.",
  },
  {
    title: "Doctors are teammates",
    body:
      "We encourage you to bring Rootwise notes to appointments, ask better questions, and co-create care strategies with licensed professionals.",
  },
  {
    title: "Safe boundaries",
    body:
      "We focus on mild symptoms and everyday goals only. Anything beyond that is outside our scope. Staying in our lane keeps everyone safe.",
  },
  {
    title: "You stay in control",
    body:
      "Rootwise offers ideas; you decide what to try, pause, or skip. You can edit entries, delete data, and steer your own wellness story.",
  },
];

export default function OurApproachPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-8">
        <header className="space-y-4 text-center text-[#1A1A1A]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B6772F]">Our philosophy</p>
          <h2 className="gradient-text text-3xl font-semibold">Our Approach to Wellness</h2>
          <p className="text-base text-[#4A4A4A]">Slow, safe, culturally sensitive, and always pro-doctor. Rootwise is the calm voice that helps you make thoughtful decisions.</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {beliefs.map((belief) => (
            <article key={belief.title} className="rounded-3xl border border-white/35 bg-white/80 p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1A1A1A]">{belief.title}</h3>
              <p className="mt-2 text-sm text-[#4A4A4A]">{belief.body}</p>
            </article>
          ))}
        </section>

        <section className="space-y-3 rounded-3xl border border-black/15 bg-black/90 p-6 text-white">
          <h3 className="text-2xl font-semibold">When to call a professional</h3>
          <ul className="list-disc space-y-2 pl-5 text-white/80">
            <li>Sudden severe pain, bleeding, or neurological changes.</li>
            <li>Persistent symptoms that interfere with daily life.</li>
            <li>Any time your intuition says “this needs a doctor.”</li>
          </ul>
          <p className="text-sm text-white/70">Rootwise is your supportive notebook. Medical professionals are your care team.</p>
        </section>

        <div className="text-center">
          <Button href="/" className="justify-center">
            Join Rootwise gently
          </Button>
        </div>
      </SectionContainer>
    </PageShell>
  );
}
