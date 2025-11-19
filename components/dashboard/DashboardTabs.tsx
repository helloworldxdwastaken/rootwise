"use client";

import { motion } from "framer-motion";
import { User, Heart, Activity, Brain, MessageCircle } from "lucide-react";

type Tab = "overview" | "health" | "conditions" | "memories" | "chat";

type DashboardTabsProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs = [
  { id: "overview" as Tab, label: "Overview", icon: User },
  { id: "health" as Tab, label: "Health Profile", icon: Heart },
  { id: "conditions" as Tab, label: "Conditions", icon: Activity },
  { id: "memories" as Tab, label: "Memories", icon: Brain },
  { id: "chat" as Tab, label: "Chat History", icon: MessageCircle },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-white/20">
      <nav className="flex gap-2 overflow-x-auto scrollbar-hide -mb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium
                border-b-2 transition-colors whitespace-nowrap
                ${isActive 
                  ? "border-[#174D3A] text-[#174D3A]" 
                  : "border-transparent text-[#222222]/60 hover:text-[#174D3A] hover:border-[#174D3A]/30"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#174D3A]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

