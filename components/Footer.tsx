"use client";

import Link from "next/link";
import Image from "next/image";
import { Leaf, Heart, Shield, Mail } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";

const footerLinks = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Women's Health", href: "/womens-health" },
    { label: "My Profile", href: "/profile" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Safety & Disclaimer", href: "/legal/disclaimer" },
    { label: "Terms of Use", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Cookie Notice", href: "/legal/cookies" },
  ],
  trust: [
    { label: "Why Trust Us", href: "/why-trust-rootwise" },
    { label: "Our Approach", href: "/our-approach" },
    { label: "Safety First", href: "#safety" },
  ],
};

const socialIcons = [
  { icon: Heart, label: "Community", href: "#" },
  { icon: Mail, label: "Contact", href: "mailto:support@rootwise.example" },
];

export function Footer() {
  return (
    <footer className="relative w-full mt-20">
      <SectionContainer
        as="div"
        className="gap-12"
        maxWidthClass="max-w-7xl"
      >
        <div className="relative w-full rounded-[32px] overflow-hidden px-4 py-10 sm:px-8 sm:py-14 md:px-10 md:py-16 shadow-2xl">
          {/* Background Image - Same as Hero */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/Homepage /HEROBG.png"
              alt="Footer background"
              fill
              className="object-cover object-center"
              quality={90}
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Content */}
          <div className="relative z-10"
          >
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2 order-1">
            <Link href="#home" className="flex items-center gap-2 text-lg font-semibold text-white group">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white">
                <Leaf className="h-6 w-6" />
              </span>
              Rootwise
            </Link>
            <p className="max-w-sm text-sm leading-6 text-white/90">
              Rootwise helps you explore gentle, natural ways to support your body with food, herbs and daily habits. Listen to your body—we help you respond with care.
            </p>
            <div className="flex items-center gap-3">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white transition-all hover:bg-white/30 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* App Downloads - Show second on mobile */}
          <div className="space-y-4 order-2 md:order-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Get the app</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 shadow transition hover:-translate-y-0.5 hover:bg-black/90"
                aria-label="Download on the App Store"
              >
                <AppStoreBadge />
              </Link>
              <Link
                href="#"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 shadow transition hover:-translate-y-0.5 hover:bg-black/90"
                aria-label="Get it on Google Play"
              >
                <GooglePlayBadge />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4 order-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 order-4 md:order-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Legal & Trust</h3>
            <ul className="space-y-3">
              {[...footerLinks.legal, ...footerLinks.trust].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="grid gap-4 sm:grid-cols-3 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl p-6 mb-4 mt-8 md:mt-12">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Safety-First</p>
              <p className="text-xs text-white/80">Red flags in every plan</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Privacy-First</p>
              <p className="text-xs text-white/80">We never sell your data</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Evidence-Informed</p>
              <p className="text-xs text-white/80">Rooted in science & tradition</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center">
          <p className="mx-auto max-w-3xl text-[0.78rem] leading-relaxed text-white/90">
            <span className="mr-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white">
              Important
            </span>
            Rootwise provides general wellness and nutrition information only. It does not offer medical advice, diagnosis or treatment. Always consult a qualified healthcare professional about your health. In an emergency, contact your local emergency services.
          </p>
          <p className="mt-2 text-xs text-white/70">
            © {new Date().getFullYear()} Rootwise. Made with care for your wellness journey.
          </p>
        </div>
        </div>
        </div>
      </SectionContainer>
    </footer>
  );
}

function AppStoreBadge() {
  return (
    <div className="flex w-full items-center justify-center gap-3 text-white">
      <Image
        src="/download-badges/app_store.png"
        alt="Apple App Store logo"
        width={48}
        height={48}
        className="h-8 w-8 flex-shrink-0"
        priority={false}
      />
      <div className="text-left text-white">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/70">Download on</p>
        <p className="text-lg font-semibold leading-none">App Store</p>
      </div>
    </div>
  );
}

function GooglePlayBadge() {
  return (
    <div className="flex w-full items-center justify-center gap-3 text-white">
      <Image
        src="/download-badges/google_play.png"
        alt="Google Play logo"
        width={48}
        height={48}
        className="h-8 w-8 flex-shrink-0"
        priority={false}
      />
      <div className="text-left text-white">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/70">Get it on</p>
        <p className="text-lg font-semibold leading-none">Google Play</p>
      </div>
    </div>
  );
}
