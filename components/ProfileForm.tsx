"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Globe, FileText, Save, Heart } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

type ProfileBooleanField =
  | "hasDiabetes"
  | "hasThyroidIssue"
  | "hasHeartIssue"
  | "hasKidneyLiverIssue"
  | "isPregnantOrNursing"
  | "onBloodThinners"
  | "vegetarian"
  | "vegan"
  | "lactoseFree"
  | "glutenFree"
  | "nutAllergy";

type ProfileFormState = Record<ProfileBooleanField, boolean> & {
  preferredLanguages: string;
  otherNotes: string;
};

const conditionFields: Array<{ key: ProfileBooleanField; label: string }> = [
  { key: "hasDiabetes", label: "Diabetes or blood sugar condition" },
  { key: "hasThyroidIssue", label: "Thyroid or endocrine concerns" },
  { key: "hasHeartIssue", label: "Heart or blood pressure issues" },
  { key: "hasKidneyLiverIssue", label: "Kidney or liver considerations" },
  { key: "isPregnantOrNursing", label: "Pregnant or nursing" },
  { key: "onBloodThinners", label: "Taking blood thinners" },
];

const preferenceFields: Array<{ key: ProfileBooleanField; label: string }> = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "lactoseFree", label: "Lactose free" },
  { key: "glutenFree", label: "Gluten free" },
  { key: "nutAllergy", label: "Nut allergy" },
];

const initialState: ProfileFormState = {
  hasDiabetes: false,
  hasThyroidIssue: false,
  hasHeartIssue: false,
  hasKidneyLiverIssue: false,
  isPregnantOrNursing: false,
  onBloodThinners: false,
  vegetarian: false,
  vegan: false,
  lactoseFree: false,
  glutenFree: false,
  nutAllergy: false,
  preferredLanguages: "",
  otherNotes: "",
};

export function ProfileForm() {
  const { data: session } = useSession();
  const [formState, setFormState] = useState<ProfileFormState>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setFormState({
              hasDiabetes: data.profile.hasDiabetes,
              hasThyroidIssue: data.profile.hasThyroidIssue,
              hasHeartIssue: data.profile.hasHeartIssue,
              hasKidneyLiverIssue: data.profile.hasKidneyLiverIssue,
              isPregnantOrNursing: data.profile.isPregnantOrNursing,
              onBloodThinners: data.profile.onBloodThinners,
              vegetarian: data.profile.vegetarian,
              vegan: data.profile.vegan,
              lactoseFree: data.profile.lactoseFree,
              glutenFree: data.profile.glutenFree,
              nutAllergy: data.profile.nutAllergy,
              preferredLanguages: data.profile.preferredLanguages || "",
              otherNotes: data.profile.otherNotes || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    if (session) {
      loadProfile();
    }
  }, [session]);

  function toggleField(key: ProfileBooleanField) {
    setFormState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setStatusMessage("Body profile saved. We'll use it every time we build a plan.");
    } catch (error) {
      setStatusMessage("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const activeFlags = useMemo(
    () =>
      [...conditionFields, ...preferenceFields]
        .filter(({ key }) => formState[key])
        .map(({ label }) => label),
    [formState]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-8 bg-white/30" hoverEffect={false}>
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-[#174D3A] flex items-center justify-center gap-2">
            <Heart className="h-6 w-6" />
            My body profile
          </h1>
          <p className="text-sm text-[#222222]/75 max-w-xl mx-auto">
            A lightweight snapshot that keeps your safety notes, dietary preferences and languages close by for
            every Rootwise session.
          </p>
        </header>

        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#174D3A] flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Clinical watchouts
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {conditionFields.map(({ key, label }, index) => {
              const id = `condition-${key}`;
              const isChecked = formState[key];
              return (
                <motion.label
                  key={key}
                  htmlFor={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-white/25 bg-white/35 px-4 py-3.5 text-sm font-medium text-[#174D3A] shadow-inner transition-all hover:bg-white/50 hover:shadow-md",
                    isChecked && "border-[#174D3A]/40 bg-[#174D3A]/15 shadow-md"
                  )}
                >
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      id={id}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleField(key)}
                      className="peer sr-only"
                    />
                    <div
                      className={cn(
                        "h-5 w-5 rounded border-2 transition-all",
                        isChecked
                          ? "border-[#174D3A] bg-[#174D3A]"
                          : "border-white/40 bg-white/70"
                      )}
                    />
                    <AnimatePresence>
                      {isChecked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute"
                        >
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {label}
                </motion.label>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#174D3A] flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Diet & preferences
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {preferenceFields.map(({ key, label }, index) => {
              const id = `preference-${key}`;
              const isChecked = formState[key];
              return (
                <motion.label
                  key={key}
                  htmlFor={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-white/25 bg-white/35 px-4 py-3.5 text-sm font-medium text-[#174D3A] shadow-inner transition-all hover:bg-white/50 hover:shadow-md",
                    isChecked && "border-[#174D3A]/40 bg-[#174D3A]/15 shadow-md"
                  )}
                >
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      id={id}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleField(key)}
                      className="peer sr-only"
                    />
                    <div
                      className={cn(
                        "h-5 w-5 rounded border-2 transition-all",
                        isChecked
                          ? "border-[#174D3A] bg-[#174D3A]"
                          : "border-white/40 bg-white/70"
                      )}
                    />
                    <AnimatePresence>
                      {isChecked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute"
                        >
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {label}
                </motion.label>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <label
            className="block text-sm font-semibold uppercase tracking-[0.3em] text-[#174D3A] flex items-center gap-2"
            htmlFor="preferred-languages"
          >
            <Globe className="h-4 w-4" />
            Preferred languages
          </label>
          <p className="text-xs text-[#222222]/70">
            Add comma-separated languages so Rootwise can respond in what feels natural (e.g. en, es, he).
          </p>
          <input
            id="preferred-languages"
            value={formState.preferredLanguages}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                preferredLanguages: event.target.value,
              }))
            }
            placeholder="en, es, he"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-[#222222] shadow-inner transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40 focus:shadow-lg"
          />
        </section>

        <section className="space-y-4">
          <label
            className="block text-sm font-semibold uppercase tracking-[0.3em] text-[#174D3A] flex items-center gap-2"
            htmlFor="profile-notes"
          >
            <FileText className="h-4 w-4" />
            Other notes
          </label>
          <p className="text-xs text-[#222222]/70">
            Allergies, meds, routines or tone preferences you&apos;d like us to remember.
          </p>
          <textarea
            id="profile-notes"
            rows={4}
            value={formState.otherNotes}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                otherNotes: event.target.value,
              }))
            }
            placeholder="e.g. Avoid grapefruit, respond in Hebrew when possible, prefer evening routines."
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-[#222222] shadow-inner transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40 focus:shadow-lg"
          />
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/20">
          <AnimatePresence mode="wait">
            {statusMessage && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 text-sm text-[#174D3A] font-medium"
              >
                <Check className="h-4 w-4" />
                {statusMessage}
              </motion.p>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            disabled={isSaving}
            className="sm:w-auto group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save profile"}
            </span>
            {isSaving && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#A6C7A3] to-[#174D3A]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {(activeFlags.length > 0 || formState.preferredLanguages || formState.otherNotes) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white/20">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#174D3A] flex items-center gap-2">
                <Check className="h-4 w-4" />
                What Rootwise keeps in mind
              </h2>
              <div className="mt-5 space-y-5 text-sm text-[#222222]/80">
                {activeFlags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A]/80 mb-2">
                      Safety flags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeFlags.map((flag, index) => (
                        <motion.span
                          key={flag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + index * 0.03 }}
                          className="rounded-full border border-[#174D3A]/30 bg-[#174D3A]/10 px-3 py-1 text-xs font-medium text-[#174D3A]"
                        >
                          {flag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
                {formState.preferredLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A]/80 mb-1">
                      Languages
                    </p>
                    <p className="text-sm text-[#222222]/80">{formState.preferredLanguages}</p>
                  </motion.div>
                )}
                {formState.otherNotes && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#174D3A]/80 mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-[#222222]/80 leading-relaxed">{formState.otherNotes}</p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeFlags.length && !formState.preferredLanguages && !formState.otherNotes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/15 text-center" hoverEffect={false}>
            <p className="text-sm text-[#222222]/60">
              As you add watchouts and preferences, we surface caution notes and tailor suggestions automatically.
            </p>
          </Card>
        </motion.div>
      )}
    </form>
  );
}
