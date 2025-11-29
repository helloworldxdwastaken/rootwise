"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";
import { Calendar, TrendingUp, Heart, Shield, AlertCircle, Thermometer, Pill, Package, Activity, Brain, Baby, Smile, Leaf, BookOpen } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Note: Metadata export removed since this is now a client component
// Metadata should be handled in a separate layout or via next/head if needed

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
    method: "Sympto-Thermal Method",
    subtitle: "Perfect Use",
    effectiveness: 99.6,
    note: "With proper education and tracking",
    icon: Thermometer,
    color: "#174D3A",
  },
  {
    method: "Birth Control Pills",
    subtitle: "Typical Use",
    effectiveness: 93,
    note: "7% failure rate with typical use",
    icon: Pill,
    color: "#B6772F",
  },
  {
    method: "Condoms",
    subtitle: "Typical Use",
    effectiveness: 87,
    note: "13% failure rate with typical use",
    icon: Package,
    color: "#567D8B",
  },
  {
    method: "Billings Ovulation Method",
    subtitle: "Perfect Use",
    effectiveness: 98,
    note: "With proper training and consistent use",
    icon: Activity,
    color: "#174D3A",
  },
];

// Animated Number Counter Component
function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toFixed(1)}%</span>;
}

export default function WomensHealthPage() {
  return (
    <PageShell>
      <SectionContainer className="gap-10">
        {/* Hero Section */}
        <section className="grid gap-8 md:grid-cols-2 items-center py-8 md:py-12">
          {/* Left Side - Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#174D3A]">WOMEN'S HEALTH</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#174D3A]">
                Here to help you
                <br />
                trust <em className="italic">your instincts</em>
              </h1>
              <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-xl mx-auto md:mx-0">
                With Rootwise, you'll gain the tools to be the ultimate expert in your health. Spanning stress, sleep, your cycle, pregnancy, and more, Rootwise can provide revolutionary insights into your wellbeing to help you feel your best, every day.
              </p>
            </motion.div>
          </div>

          {/* Right Side - Two Overlapping Image Cards */}
          <div className="relative flex items-center justify-center md:justify-end min-h-[500px] md:min-h-[600px]">
            {/* Top Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-[280px] md:w-[320px] h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{ transform: "rotate(-2deg)" }}
            >
              <Image
                src="/Women health/womansmilingwithflower.webp"
                alt="Woman smiling with flowers"
                fill
                className="object-cover"
                priority
              />
              {/* Quote Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white">
                <p className="text-base md:text-lg font-medium italic mb-1">"I began listening to my body."</p>
                <p className="text-xs md:text-sm text-white/80">Les A.</p>
              </div>
            </motion.div>

            {/* Bottom Image Card - Overlapping */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute right-0 md:right-8 top-1/2 -translate-y-1/3 w-[280px] md:w-[320px] h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl z-0"
              style={{ transform: "translateY(-33%) rotate(2deg)" }}
            >
              <Image
                src="/Women health/women-taking-coffee-with-friends.webp"
                alt="Women taking coffee with friends"
                fill
                className="object-cover"
              />
              {/* Quote Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white">
                <p className="text-base md:text-lg font-medium italic mb-1">"It helps me be kinder to myself."</p>
                <p className="text-xs md:text-sm text-white/80">Michelle L.</p>
              </div>
            </motion.div>
          </div>
        </section>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Icon */}
                  <div 
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon 
                      className="h-7 w-7 transition-colors duration-300" 
                      style={{ color: item.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-lg font-semibold text-[#1A1A1A]">{item.method}</h4>
                      <p className="text-xs font-medium text-[#4A4A4A] mt-1">{item.subtitle}</p>
                    </div>
                    <p className="text-sm text-[#4A4A4A]">{item.note}</p>
                  </div>

                  {/* Effectiveness Number */}
                  <div className="mt-6 pt-6 border-t border-white/30">
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-4xl font-bold transition-colors duration-300"
                        style={{ color: item.color }}
                      >
                        <AnimatedNumber value={item.effectiveness} />
                      </span>
                    </div>
                    <p className="text-xs text-[#4A4A4A] mt-1">effectiveness</p>
                  </div>

                  {/* Hover gradient effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${item.color}, transparent)` }}
                  />
                </motion.div>
              );
            })}
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
        <section className="relative space-y-6 rounded-3xl border border-black/10 bg-[#050505] p-8 text-white overflow-hidden">
          {/* Large decorative icon on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 md:translate-x-1/3 opacity-10 pointer-events-none">
            <Heart className="h-96 w-96 md:h-[500px] md:w-[500px] text-white" strokeWidth={1.5} fill="currentColor" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-6">Why Track Your Cycle?</h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B6772F]/20 text-[#B6772F]">
                  <Brain className="h-5 w-5" />
                </div>
                <span>
                  <strong className="text-white">Better self-awareness:</strong> Understand how your cycle affects your mood, energy, and overall well-being
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B6772F]/20 text-[#B6772F]">
                  <Baby className="h-5 w-5" />
                </div>
                <span>
                  <strong className="text-white">Natural family planning:</strong> Make informed decisions about conception or contraception using evidence-based methods
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B6772F]/20 text-[#B6772F]">
                  <Smile className="h-5 w-5" />
                </div>
                <span>
                  <strong className="text-white">Predict mood changes:</strong> Anticipate and prepare for emotional shifts before they happen
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B6772F]/20 text-[#B6772F]">
                  <Leaf className="h-5 w-5" />
                </div>
                <span>
                  <strong className="text-white">No hormones or side effects:</strong> Work with your body's natural rhythms without introducing external hormones
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B6772F]/20 text-[#B6772F]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span>
                  <strong className="text-white">Empowerment through knowledge:</strong> Take control of your reproductive health with data-driven insights
                </span>
              </li>
            </ul>
          </div>
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

