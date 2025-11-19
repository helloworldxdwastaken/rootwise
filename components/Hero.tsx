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
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 w-full h-full">
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
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col md:flex-row gap-8 lg:gap-16 px-6 sm:px-8 items-center pt-40 sm:pt-48 md:pt-56 pb-48 sm:pb-56 md:pb-64"
      >
        <div className="w-full md:w-5/12 space-y-8 text-center md:text-left flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#174D3A] backdrop-blur-md shadow-lg"
          >
            <Sparkles className="h-3 w-3" />
            Listening matters
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="hero-heading"
            className="gradient-text text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Listen to your body. We help you respond gently.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base leading-7 text-[#222222]/80 sm:text-lg sm:leading-8 max-w-2xl mx-auto md:mx-0"
          >
            Describe how you feel and Rootwise suggests foods, herbs and daily habits that may support your body – always with safety notes and zero pharma.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-[#174D3A]/20 bg-white/40 px-4 py-2 text-sm font-medium text-[#174D3A] backdrop-blur-sm"
              >
                <Icon className="h-4 w-4" />
                {feature.text}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start"
        >
          <Button href="#conversation" className="w-full md:w-auto group relative overflow-hidden">
            <span className="relative z-10">Try Rootwise free</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#A6C7A3] to-[#174D3A]"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Button>
          <Button href="#how-it-works" variant="secondary" className="w-full md:w-auto">
            See how it works
          </Button>
        </motion.div>
      </div>

      {/* Animation on the right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full md:w-7/12 flex items-center justify-center md:justify-end flex-shrink-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
        >
          <source src="/Homepage /nutrianimation.webm" type="video/webm" />
        </video>
      </motion.div>
      </div>
    </section>
  );
}
