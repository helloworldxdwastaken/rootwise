"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Safety", href: "/#safety" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const profileMenuLinks = [
  { label: "Overview", href: "/personal/overview" },
  { label: "Health Profile", href: "/profile?tab=health" },
  { label: "Conditions", href: "/profile?tab=conditions" },
  { label: "Memories", href: "/profile?tab=memories" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) > 10) {
          setScrolled(currentScrollY > 20);
          lastScrollY = currentScrollY;
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4"
    >
      <motion.div
        animate={{
          boxShadow: scrolled
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
        className={cn(
          "flex w-full max-w-6xl items-center justify-between gap-6 rounded-full border border-white/40 px-6 py-3 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 shadow-lg",
          scrolled 
            ? "bg-white/85 shadow-xl" 
            : "bg-white/70"
        )}
      >
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#174D3A] group md:flex-shrink-0">
          <motion.span
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#174D3A]/10 text-[#174D3A] group-hover:bg-[#174D3A]/20 transition-colors"
          >
            <Leaf className="h-5 w-5" />
          </motion.span>
          <span className="text-base hidden sm:inline">Rootwise</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-[#174D3A] md:flex md:flex-1 md:justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition-all hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A] relative group"
            >
              {link.label}
              <motion.span
                className="absolute bottom-1 left-1/2 h-0.5 w-0 bg-[#174D3A] group-hover:w-3/4 transition-all duration-300 rounded-full"
                style={{ x: "-50%" }}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex md:flex-shrink-0">
          {status === "authenticated" ? (
            <>
              <div
                className="relative"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
                onFocus={() => setProfileMenuOpen(true)}
                onBlur={() => setProfileMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black/80 hover:scale-105 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A]"
                >
                  <User className="h-4 w-4" />
                  {session?.user?.name || "My profile"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/30 bg-white/90 p-3 text-sm text-[#174D3A] shadow-xl backdrop-blur"
                    >
                      {profileMenuLinks.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition hover:bg-white"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="mt-2 border-t border-white/40 pt-2">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-[#C0392B] transition hover:bg-[#C0392B]/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-white/20 bg-white/30 px-4 py-2 text-sm font-semibold text-[#174D3A] shadow-sm transition-all hover:bg-white/50 hover:scale-105 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A]"
              >
                Sign in
              </Link>
              <Button href="/auth/register" className="text-sm px-5 py-2">
                Try free
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/30 text-[#174D3A] shadow-sm backdrop-blur-md transition-all hover:bg-white/50 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[calc(100%+0.75rem)] rounded-3xl border border-white/40 bg-white/85 backdrop-blur-md backdrop-saturate-150 p-5 text-sm text-[#174D3A] shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                className="border-t border-white/30 pt-2 mt-2 space-y-2"
              >
                {status === "authenticated" ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#174D3A]/70 px-4">
                      My Space
                    </p>
                    {profileMenuLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174D3A]"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-white/40 text-left text-[#C0392B]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-white/40"
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Button href="/auth/register" className="w-full justify-center" onClick={() => setOpen(false)}>
                      Try free
                    </Button>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
