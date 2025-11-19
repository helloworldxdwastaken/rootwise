"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/Button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { HealthProfileSection } from "@/components/dashboard/HealthProfileSection";
import { ConditionsSection } from "@/components/dashboard/ConditionsSection";
import { MemoriesSection } from "@/components/dashboard/MemoriesSection";
import { ChatHistorySection } from "@/components/dashboard/ChatHistorySection";

type Tab = "overview" | "health" | "conditions" | "memories" | "chat";

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
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
            <p className="text-[#174D3A]">Loading your space...</p>
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
            <p className="text-[#222222]/70">You need to be logged in to access your dashboard</p>
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
      <main className="flex flex-1 pb-16">
        <SectionContainer className="w-full justify-center gap-8 pt-16">
          <DashboardLayout>
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="py-8">
              {activeTab === "overview" && <OverviewSection />}
              {activeTab === "health" && <HealthProfileSection />}
              {activeTab === "conditions" && <ConditionsSection />}
              {activeTab === "memories" && <MemoriesSection />}
              {activeTab === "chat" && <ChatHistorySection />}
            </div>
          </DashboardLayout>
        </SectionContainer>
      </main>
    </PageShell>
  );
}
