"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield } from "lucide-react";
import { Button } from "@/components/Button";
import { SectionContainer } from "@/components/SectionContainer";

const features = [
  {
    icon: Heart,
    text: "Listen to your body",
  },
  {
    icon: Sparkles,
    text: "Gentle, natural support",
  },
  {
    icon: Shield,
    text: "Safety-first always",
  },
];

export function Hero() {
  return (
    <section 
      id="home" 
      aria-labelledby="hero-heading"
      className="relative w-screen overflow-hidden -mt-28 sm:-mt-32 md:-mt-36 left-1/2 right-1/2 -mx-[50vw]"
    >
      {/* Decorative Gradient Balls */}
      <div className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-5">
        {/* Green ball - Top Middle (half outside top) */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] rounded-full opacity-75 blur-3xl"
          style={{
            background: `radial-gradient(circle, #88F3AC 0%, #88F3AC 50%, transparent 100%)`
          }}
        />
        {/* Yellowish-Green ball - Middle Right (half outside) */}
        <motion.div
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-[45rem] h-[45rem] rounded-full opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(circle, #ECFE74 0%, #ECFE74 50%, transparent 100%)`
          }}
        />
      </div>

      {/* Background Image - Full Width */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/Homepage /HEROBG.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* White overlay to lighten the image */}
        <div className="absolute inset-0 bg-white/90" />
        {/* Gradient overlay matching background color #fcf9f7 */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(252, 249, 247, 0.3) 70%, rgba(252, 249, 247, 0.7) 85%, rgb(252, 249, 247) 100%)'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-col-reverse md:flex-row gap-8 md:gap-12 lg:gap-20 px-4 sm:px-6 md:px-8 items-center pt-32 sm:pt-40 md:pt-56 pb-32 sm:pb-40 md:pb-64"
      >
        <div className="w-full md:w-1/2 space-y-5 md:space-y-6 text-center md:text-left flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[#0a0a0a] tracking-tight"
          >
            Listen to your body.
            <br />
            We help you respond gently.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl leading-relaxed text-[#0a0a0a] max-w-xl mx-auto md:mx-0"
          >
            Describe how you feel and Rootwise suggests foods, herbs and daily habits that may support your body – always with safety notes and zero pharma.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:items-center md:justify-start"
        >
          <Button href="/auth/register" className="w-full sm:w-auto px-8 py-3.5 text-base">
            Get started free
          </Button>
          <Button href="#how-it-works" variant="secondary" className="w-full sm:w-auto px-8 py-3.5 text-base">
            Learn more
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-[#222222]/60"
              >
                <Icon className="h-4 w-4 text-[#174D3A]" />
                {feature.text}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Animation on the right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full md:w-1/2 flex items-center justify-center md:justify-end flex-shrink-0 relative"
      >
        <div className="relative w-full">
          {/* White shadow behind SVG */}
          <div className="absolute inset-0 blur-3xl opacity-40 bg-white rounded-[36px] translate-y-8" />
          
          {/* SVG Screen with drop shadow */}
          <div className="relative" style={{ filter: 'drop-shadow(0px 50px 100px rgba(54, 54, 54, 0.6))' }}>
            <Image
              src="/Homepage /screen.svg"
              alt="Screen mockup"
              width={2066}
              height={1344}
              className="w-full h-auto relative z-10"
              priority
            />
          </div>
          {/* Video overlaid on top of screen */}
          <div className="absolute inset-0 flex items-center justify-center pl-[25%] pr-[0%] pt-[10%] pb-[0%]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg"
            >
              <source src="/Homepage /nutrianimation.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
