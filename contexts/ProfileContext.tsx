"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ProfileData = {
  user: {
    id?: string;
    name?: string | null;
    email: string;
    preferredLanguage?: string | null;
    timezone?: string | null;
  };
  profile?: {
    hasDiabetes?: boolean;
    hasThyroidIssue?: boolean;
    hasHeartIssue?: boolean;
    hasKidneyLiverIssue?: boolean;
    isPregnantOrNursing?: boolean;
    onBloodThinners?: boolean;
    vegetarian?: boolean;
    vegan?: boolean;
    lactoseFree?: boolean;
    glutenFree?: boolean;
    nutAllergy?: boolean;
    preferredLanguages?: string | null;
    otherNotes?: string | null;
  } | null;
  patientProfile?: {
    dateOfBirth?: string | null;
    sex?: string;
    heightCm?: number | null;
    weightKg?: number | null;
    lifestyleNotes?: string | null;
  } | null;
  conditions: Array<{
    id: string;
    name: string;
    category: string;
    notes?: string | null;
    diagnosedAt?: string | null;
    isActive: boolean;
    createdAt: string;
  }>;
  memories: Array<{
    id: string;
    key: string;
    value: unknown;
    importance: string;
    lastUsedAt?: string | null;
    createdAt: string;
  }>;
};

type ProfileContextType = {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchProfile = async (force = false) => {
    try {
      // OPTIMIZATION: Client-side caching - only refetch if > 5 minutes old
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (!force && data && (now - lastFetch) < CACHE_DURATION) {
        // Return cached data without fetching
        return;
      }

      setLoading(true);
      setError(null);
      const response = await fetch("/api/me/profile", {
        // Add cache control for browser caching
        cache: force ? 'no-store' : 'default',
      });
      if (response.ok) {
        const profileData = await response.json();
        setData(profileData);
        setLastFetch(now);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider 
      value={{ 
        data, 
        loading, 
        error, 
        refetch: () => fetchProfile(true) // Force refetch when manually called
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

