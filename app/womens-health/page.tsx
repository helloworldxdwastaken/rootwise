"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
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
    method: "Sympto-Thermal",
    subtitle: "Perfect Use",
    effectiveness: 99.6,
    note: "With proper education and tracking",
    icon: Thermometer,
    color: "#5a9a7c",
  },
  {
    method: "Birth Control Pills",
    subtitle: "Typical Use",
    effectiveness: 93,
    note: "7% failure rate with typical use",
    icon: Pill,
    color: "#d4a574",
  },
  {
    method: "Condoms",
    subtitle: "Typical Use",
    effectiveness: 87,
    note: "13% failure rate with typical use",
    icon: Package,
    color: "#9b8ab8",
  },
  {
    method: "Billings Ovulation",
    subtitle: "Perfect Use",
    effectiveness: 98,
    note: "With proper training and consistent use",
    icon: Activity,
    color: "#6ba3b5",
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
        <section className="grid gap-8 md:grid-cols-2 items-center -mt-8 md:-mt-12 pb-8 md:pb-12">
          {/* Left Side - Text Content */}
          <div className="space-y-6 text-left">
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
              <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-xl">
                With Rootwise, you'll gain the tools to be the ultimate expert in your health. Spanning stress, sleep, your cycle, pregnancy, and more, Rootwise can provide revolutionary insights into your wellbeing to help you feel your best, every day.
              </p>
            </motion.div>
          </div>

          {/* Right Side - Two Overlapping Image Cards */}
          <div className="relative flex items-center justify-end min-h-[480px] md:min-h-[520px]">
            {/* Back Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20, rotate: 3 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute w-[260px] md:w-[300px] h-[340px] md:h-[380px] rounded-3xl overflow-hidden shadow-2xl z-0 right-[20px] top-[60px]"
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

            {/* Front Image Card */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: -20, rotate: -3 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute w-[260px] md:w-[300px] h-[340px] md:h-[380px] rounded-3xl overflow-hidden shadow-2xl z-10 left-[20px] top-0"
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
          </div>
        </section>

        {/* Coming Soon Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#174D3A]/20 bg-[#174D3A]/10 px-6 py-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-[#174D3A]" />
            <span className="text-sm font-semibold text-[#174D3A]">Feature Coming Soon</span>
          </div>
        </motion.div>

        {/* Features Section */}
        <section className="space-y-6 text-left">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-[#174D3A]"
          >
            What to Expect
          </motion.h3>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-3xl border border-[#174D3A]/10 bg-white/90 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-left"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174D3A] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#174D3A]">{feature.title}</h4>
                  <p className="mt-2 text-sm text-[#4A4A4A] leading-relaxed">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Fertility Awareness Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 rounded-3xl border border-[#174D3A]/15 bg-gradient-to-br from-white/95 to-[#174D3A]/5 p-8 shadow-lg"
        >
          <div className="text-left space-y-2">
            <h3 className="text-2xl font-semibold text-[#174D3A]">Fertility Awareness as a Contraceptive Method</h3>
            <p className="text-[#4A4A4A] max-w-2xl leading-relaxed">
              Fertility Awareness-Based Methods (FABMs) involve tracking natural fertility signals to identify fertile and infertile periods. When used correctly with proper education, these methods can achieve effectiveness rates that exceed many traditional contraceptive methods.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {fertilityMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-[#174D3A]/20 bg-white/80 p-6 hover:shadow-md transition-shadow duration-300 text-left"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-[#174D3A]">{method.title}</h4>
                  <span className="rounded-full bg-[#174D3A] px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                    {method.effectiveness}
                  </span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{method.description}</p>
                <p className="mt-3 text-xs italic text-[#174D3A]/60">{method.note}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Effectiveness Comparison */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-semibold text-[#174D3A]"
            >
              Effectiveness Comparison
            </motion.h3>
            <p className="text-[#4A4A4A] max-w-2xl leading-relaxed">
              When used correctly with proper education, fertility awareness methods can be highly effective. Here's how they compare:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.map((item, index) => {
              const Icon = item.icon;
              const isHighlighted = item.effectiveness > 95;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: item.color }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/2" />
                  
                  {/* Highlight badge for high effectiveness */}
                  {isHighlighted && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Top Choice</span>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Big Number */}
                    <div className="mb-4">
                      <span className="text-6xl md:text-7xl font-bold text-white leading-none">
                        <AnimatedNumber value={item.effectiveness} />
                      </span>
                      <p className="text-sm font-medium text-white/70 mt-1">effectiveness rate</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 pt-4 border-t border-white/20">
                      <h4 className="text-lg font-bold text-white">{item.method}</h4>
                      <p className="text-xs font-medium text-white/60">{item.subtitle}</p>
                      <p className="text-sm text-white/80 mt-2">{item.note}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border-2 border-[#174D3A]/30 bg-gradient-to-r from-[#174D3A]/10 to-[#174D3A]/5 p-6 md:p-8 max-w-4xl"
          >
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#174D3A] text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-[#174D3A] text-lg">Important Note</p>
                <p className="mt-2 text-[#4A4A4A] leading-relaxed">
                  Fertility awareness methods require proper education, consistent daily tracking, and understanding of your body's natural signals. Effectiveness rates shown are for "perfect use" with proper training. Our upcoming feature will provide the tools and education needed to use these methods effectively and safely.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative space-y-6 rounded-3xl border border-[#174D3A]/20 bg-gradient-to-br from-[#174D3A] to-[#0d2d22] p-8 text-white overflow-hidden"
        >
          {/* Large decorative emoji on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 md:translate-x-1/3 opacity-40 pointer-events-none select-none">
            <span className="text-[12rem] md:text-[16rem] leading-none">♀️</span>
          </div>

          <div className="relative z-10 text-left max-w-3xl">
            <h3 className="text-2xl font-semibold mb-6">Why Track Your Cycle?</h3>
            <ul className="space-y-4 text-white/90">
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span>
                  <strong className="text-white">Better self-awareness:</strong> Understand how your cycle affects your mood, energy, and overall well-being
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Baby className="h-5 w-5 text-white" />
                </div>
                <span>
                  <strong className="text-white">Natural family planning:</strong> Make informed decisions about conception or contraception using evidence-based methods
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Smile className="h-5 w-5 text-white" />
                </div>
                <span>
                  <strong className="text-white">Predict mood changes:</strong> Anticipate and prepare for emotional shifts before they happen
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span>
                  <strong className="text-white">No hormones or side effects:</strong> Work with your body's natural rhythms without introducing external hormones
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span>
                  <strong className="text-white">Empowerment through knowledge:</strong> Take control of your reproductive health with data-driven insights
                </span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left space-y-4 py-4"
        >
          <p className="text-[#4A4A4A] text-lg">
            Be the first to know when our Women's Health feature launches.
          </p>
          <Button href="/auth/register" className="justify-center px-8 py-3">
            Join Rootwise to stay updated
          </Button>
        </motion.div>
      </SectionContainer>
      <Footer />
    </PageShell>
  );
}

