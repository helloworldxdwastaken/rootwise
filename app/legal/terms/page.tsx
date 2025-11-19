import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";

export const metadata: Metadata = {
  title: "Rootwise Terms of Use",
  description: "Read the Rootwise Terms of Use: eligibility, responsibilities, safety-first wellness scope, and contact info.",
  keywords: [
    "Rootwise terms",
    "wellness terms of service",
    "AI wellness guide",
    "non medical terms",
    "responsible wellness platform",
  ],
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body:
      "By accessing or using Rootwise (\"Service\"), you agree to these Terms of Use. If you do not agree, please stop using the Service immediately. We may update these terms from time to time; continued use means you accept the latest version.",
  },
  {
    title: "2. Eligibility",
    body:
      "You must be at least 18 years old (or the legal age of majority in your location) to use Rootwise. If you use the Service on behalf of another person, you confirm you have authority to do so and that all responsibilities here apply to you and that person.",
  },
  {
    title: "3. Description of Service",
    body:
      "Rootwise is an AI-assisted wellness guide that shares educational information about gentle lifestyle support for mild symptoms and everyday goals. Rootwise is not a medical device and does not diagnose, treat, or replace healthcare professionals.",
  },
  {
    title: "4. No Medical Guarantees",
    body:
      "We make no promise that any suggestion will achieve specific results. All suggestions are non-prescriptive and not guaranteed to achieve specific outcomes. The Service provides general information \"as is\" and may not apply to every user. Always confirm ideas with licensed healthcare providers.",
  },
  {
    title: "4a. FDA Disclaimer",
    body:
      "This app is not intended to diagnose, treat, cure, or prevent any disease. It is not reviewed or approved by the FDA. Rootwise provides general wellness information for educational purposes only.",
  },
  {
    title: "5. User Responsibilities",
    body:
      "Provide honest information if you choose to share preferences or watchouts. Use the Service respectfully, keep credentials private, and verify suggestions before trying them. You remain responsible for your decisions and wellbeing.",
  },
  {
    title: "6. Prohibited Uses",
    body:
      "Do not misuse the Service by reverse-engineering, reselling, scraping, or interfering with its operation. Do not upload unlawful, discriminatory, or harmful content, and do not attempt unauthorized access to Rootwise systems or other user data.",
  },
  {
    title: "7. Intellectual Property",
    body:
      "All trademarks, logos, copy, illustrations, chat flows, and compiled data belong to Rootwise or its licensors. You receive a personal, non-transferable, revocable license to use the Service. Reproduction requires prior written permission.",
  },
  {
    title: "8. Content You Provide",
    body:
      "When you submit inputs, you grant Rootwise a non-exclusive worldwide license to use that content solely to operate, maintain, and improve the Service, subject to our Privacy Policy. You remain responsible for the accuracy and legality of what you share.",
  },
  {
    title: "9. Limitation of Liability",
    body:
      "Rootwise, its affiliates, and team members are not liable for indirect, incidental, or consequential damages arising from your use of the Service. If a dispute arises, your sole remedy is to discontinue the Service.",
  },
  {
    title: "10. No Warranty",
    body:
      "The Service is provided without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, accuracy, or non-infringement.",
  },
  {
    title: "11. Dispute Resolution",
    body:
      "We aim to resolve concerns through good-faith conversations. If a dispute persists, you agree to seek resolution through informal negotiations or, if mutually agreed, arbitration. Because Rootwise operates globally (EU, US, Israel, and beyond), mandatory consumer rights in your jurisdiction may override parts of this clause.",
  },
  {
    title: "12. Contact",
    body:
      "Questions about these Terms? Email support@rootwise.example or write to Rootwise Wellness, 123 Mindful Way, Tel Aviv & Los Angeles.",
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-8">
        <article className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-8 text-[#2C2C2C] shadow-xl">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C38F4A]">Legal</p>
            <h2 className="gradient-text text-3xl font-semibold">Terms of Use</h2>
            <p className="text-base">These Terms help keep Rootwise compassionate, safe, and responsible for every community member.</p>
          </header>
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h3 className="text-2xl font-semibold text-[#1A1A1A]">{section.title}</h3>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
      </SectionContainer>
    </PageShell>
  );
}
