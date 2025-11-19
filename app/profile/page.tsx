"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Heart, Languages } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/Button";

const features = [
  {
    icon: Shield,
    title: "Safety watchouts",
    description: "Clinical conditions & medications we should remember",
  },
  {
    icon: Heart,
    title: "Food preferences",
    description: "Dietary choices, allergies & what makes you feel good",
  },
  {
    icon: Languages,
    title: "Your language",
    description: "Communicate in what feels natural to you",
  },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading || status === "loading") {
    return (
      <PageShell contentClassName="px-4">
        <main className="flex flex-1 items-center justify-center pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174D3A]/10 mb-4">
              <Shield className="h-6 w-6 text-[#174D3A] animate-pulse" />
            </div>
            <p className="text-[#174D3A]">Loading your profile...</p>
          </motion.div>
        </main>
      </PageShell>
    );
  }

  if (status === "unauthenticated") {
    return (
      <PageShell contentClassName="px-4">
        <main className="flex flex-1 items-center justify-center pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-3xl font-semibold text-[#174D3A]">Please sign in</h1>
            <p className="text-[#222222]/70">You need to be logged in to access your profile</p>
            <Button href="/auth/login" className="justify-center">
              Sign in
            </Button>
          </motion.div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell contentClassName="px-4">
      <main className="flex flex-1 items-center justify-center pb-16">
        <SectionContainer className="w-full max-w-5xl justify-center gap-12 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto inline-flex items-center justify-center rounded-full border border-white/20 bg-white/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A] backdrop-blur-sm shadow-lg"
            >
              <Shield className="mr-2 h-3 w-3" />
              Steady care
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-semibold text-[#174D3A] sm:text-4xl lg:text-5xl"
            >
              Keep Rootwise in sync
              <br />
              <span className="bg-gradient-to-r from-[#F6D365] to-[#8BC6FF] bg-clip-text text-transparent">
                with your body
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto max-w-2xl text-sm text-[#222222]/75 sm:text-base"
            >
              Fill in what we should remember so every plan automatically respects your safety, preferences, and
              languages. Update it anytime—your answers stay private and power only your Rootwise experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/20 p-6 text-center backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174D3A]/10">
                    <Icon className="h-6 w-6 text-[#174D3A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#174D3A]">{feature.title}</h3>
                    <p className="mt-1 text-xs text-[#222222]/70">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ProfileForm />
          </motion.div>
        </SectionContainer>
      </main>
    </PageShell>
  );
}
