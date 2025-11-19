import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";

export const metadata: Metadata = {
  title: "Rootwise Privacy Policy",
  description: "Learn how Rootwise collects, protects, and uses data with a privacy-first mindset.",
  keywords: [
    "Rootwise privacy",
    "AI wellness data",
    "GDPR wellness",
    "privacy-first wellness platform",
    "delete Rootwise data",
  ],
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-8">
        <article className="space-y-6 rounded-3xl border border-white/40 bg-white/85 p-8 text-[#2C2C2C] shadow-xl">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#4281A4]">Privacy-first</p>
            <h2 className="gradient-text text-3xl font-semibold">Privacy Policy</h2>
            <p>We treat every personal detail with care. This policy explains what we collect, how we use it, and the rights you have over your data.</p>
          </header>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Information We Collect</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Account details:</strong> name, email, language, time zone.</li>
              <li><strong>Conversation inputs:</strong> wellness goals, mild symptoms, routines, preferences, watchouts you choose to share. Please avoid sharing highly sensitive identifiers.</li>
              <li><strong>Usage data:</strong> IP address, device type, session timestamps, feature usage, crash logs.</li>
              <li><strong>Cookies/local storage:</strong> keeps you signed in and remembers preferences.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">How We Use Data</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>To deliver personalized yet educational wellness content.</li>
              <li>To improve plan quality, safety messaging, and product features.</li>
              <li>To respond to support requests and keep the platform secure.</li>
            </ul>
            <p>Your data may be processed by automated systems to generate wellness summaries. Human reviewers may inspect anonymized snippets to monitor safety and accuracy.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Cookies & Session Storage</h3>
            <p>Essential cookies maintain secure sessions. Functional cookies remember language and theme. Analytics cookies (privacy-conscious tools) help us understand aggregate usage. You can disable non-essential cookies through in-app controls or browser settings, but essential cookies are required for core functionality.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Third-Party Providers</h3>
            <p>We rely on hosting partners, analytics vendors, email services, and occasional human-in-the-loop reviewers. Each partner follows confidentiality agreements and strong security practices. We never sell personal data.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Data Rights</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Access, update, or correct your profile information.</li>
              <li>Request deletion or export of your data by contacting privacy@rootwise.example.</li>
              <li>For EU/EEA residents: GDPR rights (access, rectification, erasure, restriction, portability, objection) apply.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Security</h3>
            <p>We use encryption in transit, role-based access, and regular security reviews. No system is 100% secure, so please use unique passwords and log out on shared devices.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Data Retention & Deletion</h3>
            <p>We store conversation data as long as needed to provide the Service or until you request deletion. Aggregated or anonymized data may be retained for analytics and safety improvements. To delete your account, email <a href="mailto:privacy@rootwise.example">privacy@rootwise.example</a> and we will verify your identity.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">International Transfers</h3>
            <p>Your information may be processed on servers located in the EU, US, Israel, or other regions. We apply appropriate safeguards such as Standard Contractual Clauses for cross-border data flows.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Data Privacy (Israel)</h3>
            <p>For users located in Israel, personal data is handled in accordance with the Israeli Protection of Privacy Law (5741-1981) and relevant guidance from the Israeli Privacy Protection Authority.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">External Links</h3>
            <p>Rootwise may link to other sites. We are not responsible for their privacy practices. When leaving Rootwise, review the privacy policy of the destination site.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold">Contact</h3>
            <p>Email <a href="mailto:privacy@rootwise.example">privacy@rootwise.example</a> with any privacy questions.</p>
          </section>
        </article>
      </SectionContainer>
    </PageShell>
  );
}
