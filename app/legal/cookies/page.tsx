import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";

export const metadata: Metadata = {
  title: "Rootwise Cookie Notice",
  description: "Understand how Rootwise uses essential, functional, and analytics cookies with user-friendly consent controls.",
  keywords: [
    "Rootwise cookies",
    "cookie policy",
    "wellness analytics",
    "cookie consent",
    "functional cookies",
  ],
};

export default function CookiePage() {
  return (
    <PageShell>
      <SectionContainer className="gap-8">
        <article className="space-y-6 rounded-3xl border border-white/40 bg-white/85 p-8 text-[#2C2C2C] shadow-lg">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#667E9F]">Cookies</p>
            <h2 className="gradient-text text-3xl font-semibold">Cookie Notice</h2>
            <p>Rootwise uses cookies to keep the experience secure, smooth, and friendly. Here’s what you need to know.</p>
          </header>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Essential Cookies</h3>
            <p>These keep you signed in, maintain session security, and let the chat render properly. They are required to use Rootwise.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Functional Cookies</h3>
            <p>We use small files to remember preferred language, tone, and accessibility settings. They help Rootwise feel like “yours.”</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Analytics Cookies</h3>
            <p>Privacy-friendly analytics show us aggregate usage patterns—what sections people open, which plans are helpful—without selling personal data. These cookies are optional.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Consent & Control</h3>
            <p>You can accept or decline non-essential cookies via our in-app banner or through your browser settings. Disabling analytics may limit personalization insights, but core reading features remain accessible.</p>
          </section>
        </article>
      </SectionContainer>
    </PageShell>
  );
}
