import type { Metadata } from "next";

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

export default function WomensHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

