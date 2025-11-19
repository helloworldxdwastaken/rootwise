import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rootwise | Gentle natural support for your body",
  description:
    "Rootwise helps you describe how you feel and receive calm, safety-first suggestions for foods, herbs and daily habits.",
  openGraph: {
    title: "Rootwise | Gentle natural support for your body",
    description:
      "Describe how you feel and get thoughtful, safety-first nutrition and habit suggestions from Rootwise.",
    url: "https://rootwise.example",
    siteName: "Rootwise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rootwise | Gentle natural support for your body",
    description:
      "From how you feel to a gentle, natural support plan. Rootwise keeps safety first.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased overflow-x-hidden`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
