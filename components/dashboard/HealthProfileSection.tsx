"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Save, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/contexts/ProfileContext";

type HealthProfileFormData = {
  // User level
  name: string;
  preferredLanguage: string;
  timezone: string;
  // Patient Profile
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
  heightCm: string;
  weightKg: string;
  lifestyleNotes: string;
  // UserProfile (wellness)
  hasDiabetes: boolean;
  hasThyroidIssue: boolean;
  hasHeartIssue: boolean;
  hasKidneyLiverIssue: boolean;
  isPregnantOrNursing: boolean;
  onBloodThinners: boolean;
  vegetarian: boolean;
  vegan: boolean;
  lactoseFree: boolean;
  glutenFree: boolean;
  nutAllergy: boolean;
  preferredLanguages: string;
  otherNotes: string;
};

export function HealthProfileSection() {
  const { data: profileData, refetch } = useProfile();
  const [formData, setFormData] = useState<HealthProfileFormData>({
    name: "",
    preferredLanguage: "",
    timezone: "",
    dateOfBirth: "",
    sex: "UNKNOWN",
    heightCm: "",
    weightKg: "",
    lifestyleNotes: "",
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
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "he", label: "Hebrew" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "ar", label: "Arabic" },
    { value: "hi", label: "Hindi" },
    { value: "zh", label: "Chinese (Mandarin)" },
  ];

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.user?.name || "",
        preferredLanguage: profileData.user?.preferredLanguage || "",
        timezone: profileData.user?.timezone || "",
        dateOfBirth: profileData.patientProfile?.dateOfBirth?.split("T")[0] || "",
        sex: profileData.patientProfile?.sex || "UNKNOWN",
        heightCm: profileData.patientProfile?.heightCm?.toString() || "",
        weightKg: profileData.patientProfile?.weightKg?.toString() || "",
        lifestyleNotes: profileData.patientProfile?.lifestyleNotes || "",
        hasDiabetes: profileData.profile?.hasDiabetes || false,
        hasThyroidIssue: profileData.profile?.hasThyroidIssue || false,
        hasHeartIssue: profileData.profile?.hasHeartIssue || false,
        hasKidneyLiverIssue: profileData.profile?.hasKidneyLiverIssue || false,
        isPregnantOrNursing: profileData.profile?.isPregnantOrNursing || false,
        onBloodThinners: profileData.profile?.onBloodThinners || false,
        vegetarian: profileData.profile?.vegetarian || false,
        vegan: profileData.profile?.vegan || false,
        lactoseFree: profileData.profile?.lactoseFree || false,
        glutenFree: profileData.profile?.glutenFree || false,
        nutAllergy: profileData.profile?.nutAllergy || false,
        preferredLanguages: profileData.profile?.preferredLanguages || "",
        otherNotes: profileData.profile?.otherNotes || "",
      });
      setLoading(false);
    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
          weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Refetch profile data to update shared context
        await refetch();
      } else {
        setMessage({ type: "error", text: "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-[#174D3A]">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <Card className="bg-white/40 space-y-5">
        <h3 className="text-lg font-semibold text-[#174D3A]">Personal Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Sex
            </label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            >
              <option value="UNKNOWN">Prefer not to say</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Preferred Language
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            >
              <option value="">Select language</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {formData.preferredLanguage &&
                !languageOptions.some((opt) => opt.value === formData.preferredLanguage) && (
                  <option value={formData.preferredLanguage}>{formData.preferredLanguage}</option>
                )}
            </select>
          </div>
        </div>
      </Card>

      {/* Vitals */}
      <Card className="bg-white/40 space-y-5">
        <h3 className="text-lg font-semibold text-[#174D3A]">Vitals</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
              placeholder="165"
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#174D3A] mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              placeholder="60"
              className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#174D3A] mb-2">
            Lifestyle Notes
          </label>
          <textarea
            value={formData.lifestyleNotes}
            onChange={(e) => setFormData({ ...formData, lifestyleNotes: e.target.value })}
            placeholder="Active lifestyle, exercises 3x/week..."
            rows={3}
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-[#174D3A]/60 focus:outline-none focus:ring-2 focus:ring-[#174D3A]/40"
          />
        </div>
      </Card>

      {/* Health Watchouts */}
      <Card className="bg-white/40 space-y-5 sm:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-semibold text-[#174D3A]">Clinical Watchouts</h3>
        
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { key: "hasDiabetes", label: "Diabetes" },
            { key: "hasThyroidIssue", label: "Thyroid Issue" },
            { key: "hasHeartIssue", label: "Heart Issue" },
            { key: "hasKidneyLiverIssue", label: "Kidney/Liver Issue" },
            { key: "isPregnantOrNursing", label: "Pregnant/Nursing" },
            { key: "onBloodThinners", label: "Blood Thinners" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer rounded-2xl border border-white/25 bg-white/35 px-4 py-3 transition-all hover:bg-white/50"
            >
              <input
                type="checkbox"
                checked={formData[key as keyof HealthProfileFormData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="h-4 w-4 rounded border-[#174D3A]/40 text-[#174D3A] focus:ring-[#174D3A]"
              />
              <span className="text-sm font-medium text-[#174D3A]">{label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Dietary Preferences */}
      <Card className="bg-white/40 space-y-5 sm:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-semibold text-[#174D3A]">Dietary Preferences</h3>
        
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            { key: "vegetarian", label: "Vegetarian" },
            { key: "vegan", label: "Vegan" },
            { key: "lactoseFree", label: "Lactose Free" },
            { key: "glutenFree", label: "Gluten Free" },
            { key: "nutAllergy", label: "Nut Allergy" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer rounded-2xl border border-white/25 bg-white/35 px-4 py-3 transition-all hover:bg-white/50"
            >
              <input
                type="checkbox"
                checked={formData[key as keyof HealthProfileFormData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="h-4 w-4 rounded border-[#174D3A]/40 text-[#174D3A] focus:ring-[#174D3A]"
              />
              <span className="text-sm font-medium text-[#174D3A]">{label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${
              message.type === "success"
                ? "bg-[#174D3A]/10 text-[#174D3A]"
                : "bg-[#F26C63]/10 text-[#F26C63]"
            }`}
          >
            {message.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="px-8">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
