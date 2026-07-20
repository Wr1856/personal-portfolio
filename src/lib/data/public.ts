import { cache } from "react";

import { getPublicSupabase } from "@/lib/supabase/public";
import type {
  CertificationRow,
  ExperienceRow,
  ProjectRow,
  ServiceRow,
  SiteProfileRow,
} from "@/types/database";

function logQueryError(entity: string, message: string) {
  console.error(`[data] Failed to load ${entity}: ${message}`);
}

export const getSiteProfile = cache(
  async (): Promise<SiteProfileRow | null> => {
    const supabase = getPublicSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("site_profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) {
      logQueryError("site_profile", error.message);
      return null;
    }
    return data;
  },
);

export const getPublishedProjects = cache(
  async (): Promise<ProjectRow[]> => {
    const supabase = getPublicSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      logQueryError("projects", error.message);
      return [];
    }
    return data;
  },
);

export const getPublishedCertifications = cache(
  async (): Promise<CertificationRow[]> => {
    const supabase = getPublicSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("is_published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("issue_date", { ascending: false });
    if (error) {
      logQueryError("certifications", error.message);
      return [];
    }
    return data;
  },
);

export const getPublishedExperiences = cache(
  async (): Promise<ExperienceRow[]> => {
    const supabase = getPublicSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("start_date", { ascending: false });
    if (error) {
      logQueryError("experiences", error.message);
      return [];
    }
    return data;
  },
);

export const getPublishedServices = cache(
  async (): Promise<ServiceRow[]> => {
    const supabase = getPublicSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true });
    if (error) {
      logQueryError("services", error.message);
      return [];
    }
    return data;
  },
);
