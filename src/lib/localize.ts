import type { Locale } from "@/i18n/routing";
import type {
  CertificationRow,
  ExperienceRow,
  ProjectRow,
  ServiceRow,
  SiteProfileRow,
} from "@/types/database";

export type LocalizedProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  result: string | null;
  category: string;
  projectType: ProjectRow["project_type"];
  status: ProjectRow["status"];
  technologies: string[];
  coverPath: string | null;
  videoUrl: string | null;
  demoUrl: string | null;
  repositoryUrl: string | null;
  originalUrl: string | null;
  featured: boolean;
};

export type LocalizedCertification = {
  id: string;
  title: string;
  issuer: string;
  category: string;
  issueDate: string;
  expirationDate: string | null;
  credentialCode: string | null;
  credentialUrl: string | null;
  featured: boolean;
};

export type LocalizedExperience = {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  skills: string[];
};

export type LocalizedService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ServiceRow["category"];
  scope: string;
  startingPrice: number | null;
  remoteAvailable: boolean;
  onsiteAvailable: boolean;
  featured: boolean;
};

export type LocalizedProfile = {
  name: string;
  professionalTitle: string;
  bio: string;
  email: string;
  whatsapp: string;
  githubUrl: string;
  resumePath: string | null;
  profileImagePath: string | null;
};

function pick(locale: Locale, pt: string, en: string): string {
  // English falls back to Portuguese when a translation is missing.
  if (locale === "en") return en.trim() !== "" ? en : pt;
  return pt;
}

function pickNullable(
  locale: Locale,
  pt: string | null,
  en: string | null,
): string | null {
  if (locale === "en") return en ?? pt;
  return pt;
}

export function localizeProject(
  row: ProjectRow,
  locale: Locale,
): LocalizedProject {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.title_pt, row.title_en),
    summary: pick(locale, row.summary_pt, row.summary_en),
    problem: pick(locale, row.problem_pt, row.problem_en),
    solution: pick(locale, row.solution_pt, row.solution_en),
    result: pickNullable(locale, row.result_pt, row.result_en),
    category: row.category,
    projectType: row.project_type,
    status: row.status,
    technologies: row.technologies,
    coverPath: row.cover_path,
    videoUrl: row.video_url,
    demoUrl: row.demo_url,
    repositoryUrl: row.repository_url,
    originalUrl: row.original_url,
    featured: row.featured,
  };
}

export function localizeCertification(
  row: CertificationRow,
): LocalizedCertification {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    category: row.category,
    issueDate: row.issue_date,
    expirationDate: row.expiration_date,
    credentialCode: row.credential_code,
    credentialUrl: row.credential_url,
    featured: row.featured,
  };
}

export function localizeExperience(
  row: ExperienceRow,
  locale: Locale,
): LocalizedExperience {
  return {
    id: row.id,
    company: row.company,
    role: pick(locale, row.role_pt, row.role_en),
    description: pick(locale, row.description_pt, row.description_en),
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    skills: row.skills,
  };
}

export function localizeService(row: ServiceRow, locale: Locale): LocalizedService {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.title_pt, row.title_en),
    description: pick(locale, row.description_pt, row.description_en),
    category: row.category,
    scope: pick(locale, row.scope_pt, row.scope_en),
    startingPrice: row.starting_price,
    remoteAvailable: row.remote_available,
    onsiteAvailable: row.onsite_available,
    featured: row.featured,
  };
}

export function localizeProfile(
  row: SiteProfileRow,
  locale: Locale,
): LocalizedProfile {
  return {
    name: row.name,
    professionalTitle: pick(
      locale,
      row.professional_title_pt,
      row.professional_title_en,
    ),
    bio: pick(locale, row.bio_pt, row.bio_en),
    email: row.email,
    whatsapp: row.whatsapp,
    githubUrl: row.github_url,
    resumePath: row.resume_path,
    profileImagePath: row.profile_image_path,
  };
}
