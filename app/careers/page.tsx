import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at Rootwise | Join Our Wellness Mission",
  description: "Explore career opportunities at Rootwise in Los Angeles and Tel Aviv. Join us in building gentle, evidence-informed wellness guidance.",
  keywords: [
    "Rootwise careers",
    "wellness jobs",
    "health tech careers",
    "Los Angeles jobs",
    "Tel Aviv jobs",
  ],
};

const values = [
  "Compassion first",
  "Safety above all",
  "Evidence-informed",
  "Privacy-focused",
  "Globally inclusive",
  "Human + AI collaboration",
];

export default function CareersPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-12">
        <header className="space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A6C7A3]">Join us</p>
          <h1 className="gradient-text text-4xl font-semibold sm:text-5xl">
            Build the future of gentle wellness
          </h1>
          <p className="mx-auto max-w-2xl text-base text-[#222222]/80">
            We're creating a calm, compassionate space where people can explore natural support for their bodies.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-[#174D3A] pt-4">
            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Los Angeles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Tel Aviv</span>
            </div>
          </div>
        </header>

        {/* Company Values */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#174D3A]">What we stand for</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {values.map((value) => (
              <div
                key={value}
                className="rounded-full border border-white/30 bg-white/50 px-5 py-2.5 text-sm font-medium text-[#174D3A] shadow-sm backdrop-blur-sm transition-all hover:bg-white/70 hover:scale-105"
              >
                {value}
              </div>
            ))}
          </div>
        </section>

        {/* No Open Positions */}
        <section className="mt-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 to-white/50 p-12 text-center shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#174D3A]/10">
                <span className="text-5xl">😔</span>
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-[#174D3A] mb-4">
              No open positions at this time
            </h2>
            <p className="text-base leading-7 text-[#222222]/80 mb-8">
              We're not actively hiring right now, but we're always excited to meet passionate people who share our mission. Send us your story and we'll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                href="mailto:careers@rootwise.example?subject=Future Opportunities at Rootwise"
                className="justify-center"
              >
                Get in touch
              </Button>
              <Button 
                href="/" 
                variant="secondary"
                className="justify-center"
              >
                Explore Rootwise
              </Button>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center space-y-3 pt-8">
          <p className="text-sm text-[#222222]/70">
            📧 <a href="mailto:careers@rootwise.example" className="font-medium text-[#174D3A] hover:underline">careers@rootwise.example</a>
          </p>
          <p className="text-xs text-[#222222]/60">
            Based in Los Angeles & Tel Aviv
          </p>
        </section>
      </SectionContainer>
    </PageShell>
  );
}

