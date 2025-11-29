import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";
import { Calendar, TrendingUp, Heart, Shield, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Women's Health | Rootwise",
  description: "Coming soon: Track your menstrual cycle, predict mood changes, and understand your fertility with evidence-based fertility awareness methods.",
  keywords: [
    "women's health",
    "menstrual cycle tracking",
    "fertility awareness",
    "period tracking",
    "natural family planning",
    "mood prediction",
  ],
};

const features = [
  {
    icon: Calendar,
    title: "Menstrual Period Tracking",
    description:
      "Accurately log and predict your menstrual cycles to better understand your body's natural rhythms. Track cycle length, period duration, and identify patterns over time.",
  },
  {
    icon: TrendingUp,
    title: "Mood Prediction & Awareness",
    description:
      "Identify and anticipate mood changes associated with different phases of your cycle. Understand how hormonal fluctuations affect your emotional well-being before they happen.",
  },
  {
    icon: Heart,
    title: "Fertility Window Identification",
    description:
      "Determine your most fertile and least fertile days through evidence-based tracking methods. Understand your body's natural fertility signals for informed family planning decisions.",
  },
];

const fertilityMethods = [
  {
    title: "Sympto-Thermal Method",
    effectiveness: "99.6%",
    description:
      "Combines basal body temperature tracking with cervical mucus observations. When used correctly with proper education, this method achieves up to 99.6% effectiveness—higher than many hormonal contraceptives.",
    note: "Requires daily tracking and understanding of fertility signs",
  },
  {
    title: "Billings Ovulation Method",
    effectiveness: "97-99%",
    description:
      "Focuses on cervical mucus patterns to identify fertile and infertile periods. With proper training and consistent tracking, effectiveness ranges from 97% to 99%.",
    note: "Based on natural fertility indicators your body provides",
  },
];

const comparisonData = [
  {
    method: "Sympto-Thermal Method (Perfect Use)",
    effectiveness: "99.6%",
    note: "With proper education and tracking",
  },
  {
    method: "Birth Control Pills (Typical Use)",
    effectiveness: "93%",
    note: "7% failure rate with typical use",
  },
  {
    method: "Condoms (Typical Use)",
    effectiveness: "87%",
    note: "13% failure rate with typical use",
  },
  {
    method: "Billings Ovulation Method (Perfect Use)",
    effectiveness: "97-99%",
    note: "With proper training and consistent use",
  },
];

export default function WomensHealthPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-10">
        <header className="space-y-4 text-center text-[#1A1A1A]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B6772F]">Coming Soon</p>
          <h2 className="gradient-text text-3xl font-semibold">Women's Health</h2>
          <p className="text-base text-[#4A4A4A]">
            Empowering you to understand and track your menstrual cycle, predict mood changes, and make informed decisions about your reproductive health through evidence-based fertility awareness methods.
          </p>
        </header>

        {/* Coming Soon Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B6772F]/30 bg-[#B6772F]/10 px-6 py-3">
            <AlertCircle className="h-5 w-5 text-[#B6772F]" />
            <span className="text-sm font-semibold text-[#B6772F]">Feature Coming Soon</span>
          </div>
        </div>

        {/* Features Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold text-center text-[#1A1A1A]">What to Expect</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174D3A]/10 text-[#174D3A]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1A1A1A]">{feature.title}</h4>
                  <p className="mt-2 text-sm text-[#4A4A4A]">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Fertility Awareness Section */}
        <section className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-lg">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Fertility Awareness as a Contraceptive Method</h3>
            <p className="text-[#4A4A4A]">
              Fertility Awareness-Based Methods (FABMs) involve tracking natural fertility signals to identify fertile and infertile periods. When used correctly with proper education, these methods can achieve effectiveness rates that exceed many traditional contraceptive methods.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {fertilityMethods.map((method) => (
              <div
                key={method.title}
                className="rounded-2xl border border-[#174D3A]/20 bg-[#174D3A]/5 p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-[#1A1A1A]">{method.title}</h4>
                  <span className="rounded-full bg-[#174D3A] px-3 py-1 text-xs font-bold text-white">
                    {method.effectiveness}
                  </span>
                </div>
                <p className="text-sm text-[#4A4A4A]">{method.description}</p>
                <p className="mt-3 text-xs italic text-[#4A4A4A]/80">{method.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Effectiveness Comparison */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">Effectiveness Comparison</h3>
            <p className="text-[#4A4A4A]">
              When used correctly with proper education and consistent tracking, fertility awareness methods can be highly effective. Here's how they compare:
            </p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg">
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-2xl border border-white/30 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{item.method}</p>
                    <p className="text-xs text-[#4A4A4A]">{item.note}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#174D3A]">{item.effectiveness}</p>
                      <p className="text-xs text-[#4A4A4A]">effectiveness</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#174D3A]/20 bg-[#174D3A]/5 p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#174D3A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Important Note</p>
                <p className="mt-1 text-sm text-[#4A4A4A]">
                  Fertility awareness methods require proper education, consistent daily tracking, and understanding of your body's natural signals. Effectiveness rates shown are for "perfect use" with proper training. Our upcoming feature will provide the tools and education needed to use these methods effectively and safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-6 rounded-3xl border border-black/10 bg-[#050505] p-8 text-white">
          <h3 className="text-2xl font-semibold">Why Track Your Cycle?</h3>
          <ul className="space-y-3 pl-5 text-white/80">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#B6772F]">•</span>
              <span>
                <strong className="text-white">Better self-awareness:</strong> Understand how your cycle affects your mood, energy, and overall well-being
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#B6772F]">•</span>
              <span>
                <strong className="text-white">Natural family planning:</strong> Make informed decisions about conception or contraception using evidence-based methods
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#B6772F]">•</span>
              <span>
                <strong className="text-white">Predict mood changes:</strong> Anticipate and prepare for emotional shifts before they happen
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#B6772F]">•</span>
              <span>
                <strong className="text-white">No hormones or side effects:</strong> Work with your body's natural rhythms without introducing external hormones
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#B6772F]">•</span>
              <span>
                <strong className="text-white">Empowerment through knowledge:</strong> Take control of your reproductive health with data-driven insights
              </span>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-[#4A4A4A]">
            Be the first to know when our Women's Health feature launches. Sign up to receive updates.
          </p>
          <Button href="/auth/register" className="justify-center">
            Join Rootwise to stay updated
          </Button>
        </div>
      </SectionContainer>
    </PageShell>
  );
}

