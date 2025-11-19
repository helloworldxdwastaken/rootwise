"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { User, Activity, MessageCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

type ProfileData = {
  user: {
    name?: string | null;
    email: string;
    preferredLanguage?: string | null;
    timezone?: string | null;
  };
  conditions: Array<{ name: string; category: string; isActive: boolean }>;
  memories: Array<{ key: string; value: unknown; importance: string }>;
};

export function OverviewSection() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/me/profile");
        if (response.ok) {
          const profileData = await response.json();
          setData(profileData);
        }
      } catch (error) {
        console.error("Failed to load overview:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#174D3A]">Loading your space...</div>
      </div>
    );
  }

  const activeConditions = data?.conditions?.filter((c) => c.isActive) || [];
  const mainConditions = activeConditions.map((c) => c.name).slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* User Info */}
      <Card className="bg-white/40">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#174D3A]/10">
            <User className="h-5 w-5 text-[#174D3A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174D3A]">
              Account
            </h3>
            <p className="mt-2 text-lg font-semibold text-[#0a0a0a]">
              {data?.user?.name || "User"}
            </p>
            <p className="text-sm text-[#222222]/70">{data?.user?.email}</p>
            {data?.user?.preferredLanguage && (
              <p className="mt-2 text-xs text-[#222222]/60">
                Language: {data.user.preferredLanguage}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Health Summary */}
      <Card className="bg-white/40">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#174D3A]/10">
            <Activity className="h-5 w-5 text-[#174D3A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174D3A]">
              Health Summary
            </h3>
            <p className="mt-2 text-2xl font-semibold text-[#0a0a0a]">
              {activeConditions.length}
            </p>
            <p className="text-sm text-[#222222]/70">Active conditions</p>
            {mainConditions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {mainConditions.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-[#174D3A]/10 px-2.5 py-1 text-xs font-medium text-[#174D3A]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/40">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#174D3A]/10">
            <MessageCircle className="h-5 w-5 text-[#174D3A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174D3A]">
              Memories
            </h3>
            <p className="mt-2 text-2xl font-semibold text-[#0a0a0a]">
              {data?.memories?.length || 0}
            </p>
            <p className="text-sm text-[#222222]/70">Facts stored</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

