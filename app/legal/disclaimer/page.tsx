import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Rootwise Safety & Medical Disclaimer",
  description:
    "Understand why Rootwise is educational only, not a medical device, and learn the safety guardrails built into every plan.",
  keywords: [
    "Rootwise disclaimer",
    "wellness safety",
    "educational only",
    "not medical advice",
    "AI wellness guide",
  ],
};

export default function SafetyDisclaimerPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-8">
        <article className="space-y-8 rounded-3xl border border-white/40 bg-white/80 p-8 text-[#2C2C2C] shadow-xl">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C38F4A]">Safety first</p>
            <h2 className="gradient-text text-3xl font-semibold">Safety & Medical Disclaimer</h2>
            <p>Rootwise is an AI-assisted wellness companion created strictly for educational purposes. It is not a medical device, does not diagnose, and never replaces personal medical care.</p>
            <div className="rounded-2xl border border-[#F26C63]/30 bg-[#F26C63]/10 p-4 mt-4">
              <p className="font-semibold text-[#F26C63]">FDA Disclaimer</p>
              <p className="mt-2 text-sm">This app is not intended to diagnose, treat, cure, or prevent any disease. It is not reviewed or approved by the FDA.</p>
            </div>
          </header>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">General Wellness Information Only</h3>
            <p>
              Rootwise provides general wellness information for educational purposes only. Suggestions inside Rootwise—foods, teas, herbs, habits, reflections—are informational tips that may help you explore gentle support for everyday wellbeing. They are not medical advice, not prescriptions, and not personalized treatment plans. Information provided may not apply to everyone, and you should interpret each idea within your own health context.
            </p>
            <p className="font-semibold text-[#1A1A1A]">
              Rootwise does not provide personalised medical treatment, does not replace clinical evaluation, and cannot assess symptoms or medical conditions. Rootwise does not assess symptoms, provide medical judgement, or offer individualized health treatment.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">No Guaranteed Outcomes</h3>
            <p>
              All suggestions are non-prescriptive and not guaranteed to achieve specific outcomes. Results may vary, and individual responses to foods, herbs, and lifestyle changes differ. We make no claims about effectiveness or specific health benefits.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Talk to Healthcare Professionals</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Consult a licensed healthcare provider before changing diet, herbs, supplements, medications, or movement routines.</li>
              <li>Share Rootwise notes with your care team so they can evaluate what is safe for your body, history, and culture.</li>
              <li>If you are pregnant, nursing, supporting a child, immunocompromised, or managing chronic conditions, professional guidance is essential.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Emergency Disclaimer</h3>
            <p>Rootwise cannot respond to emergencies. If you notice severe symptoms—chest pain, trouble breathing, sudden weakness, fainting, heavy bleeding, allergic reactions, or sudden severe headache—contact local emergency services immediately. When in doubt, seek urgent care.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Allergies & Interactions</h3>
            <p>People respond differently to foods, herbs, and routines. Some ingredients interact with medications; others trigger sensitivities or intolerances. Review labels, research contraindications, and discuss potential risks with your healthcare team before trying anything new.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Use at Your Discretion</h3>
            <p>You control what you try, modify, or skip. Rootwise offers gentle prompts to help you feel prepared for professional conversations, but implementing any idea is at your own discretion and risk. Cultural, regional, and personal contexts differ; adapt content responsibly.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Global Awareness</h3>
            <p>Rootwise is designed for a global community, with users in the EU, US, Israel, and beyond. Regulations and healthcare practices vary. Always follow local laws and prioritize advice from practitioners who know your medical history.</p>
          </section>

          <div className="rounded-2xl bg-[#050505] p-6 text-white">
            <h3 className="text-xl font-semibold">Need professional care?</h3>
            <p className="mt-2 text-sm text-white/80">Rootwise is a companion notebook for ideas—not a clinician. Use the content to prepare thoughtful questions, then connect with doctors, nurses, midwives, therapists, or registered dietitians for specific care.</p>
            <Button href="mailto:support@rootwise.example" className="mt-4 w-full justify-center" variant="secondary">
              Contact the Rootwise team
            </Button>
          </div>
        </article>
      </SectionContainer>
    </PageShell>
  );
}
