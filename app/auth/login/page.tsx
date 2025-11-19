"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-background)]">
      {/* Animated background gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#A6C7A3]/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-[#F4C977]/20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174D3A]/10">
              <Leaf className="h-6 w-6 text-[#174D3A]" />
            </div>
            <span className="text-2xl font-semibold text-[#174D3A]">Rootwise</span>
          </Link>

          <h1 className="text-3xl font-semibold text-center text-[#174D3A] mb-2">
            Welcome back
          </h1>
          <p className="text-center text-[#222222]/70 mb-8">
            Sign in to access your wellness journey
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 rounded-2xl border border-[#F26C63]/40 bg-[#F26C63]/10 p-4 text-sm text-[#F26C63]"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#174D3A] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#174D3A]/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-white/30 bg-white/70 pl-12 pr-4 py-3 text-sm text-[#222222] placeholder-[#222222]/40 transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#174D3A] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#174D3A]/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-white/30 bg-white/70 pl-12 pr-4 py-3 text-sm text-[#222222] placeholder-[#222222]/40 transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#222222]/70">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-[#174D3A] hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#222222]/60">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-[#174D3A]">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline hover:text-[#174D3A]">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

