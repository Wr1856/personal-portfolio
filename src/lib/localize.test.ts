import { describe, expect, it } from "vitest";

import { localizeExperience, localizeProject } from "@/lib/localize";
import type { ExperienceRow, ProjectRow } from "@/types/database";

const projectRow: ProjectRow = {
  id: "p1",
  slug: "portal",
  title_pt: "Portal Corporativo",
  title_en: "Corporate Portal",
  summary_pt: "Resumo em português",
  summary_en: "",
  problem_pt: "Problema",
  problem_en: "Problem",
  solution_pt: "Solução",
  solution_en: "Solution",
  result_pt: "Resultado",
  result_en: null,
  category: "web",
  project_type: "professional",
  status: "completed",
  technologies: ["Next.js"],
  cover_path: null,
  video_url: null,
  demo_url: null,
  repository_url: null,
  original_url: null,
  featured: false,
  is_published: true,
  ai_visible: true,
  sort_order: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const experienceRow: ExperienceRow = {
  id: "e1",
  company: "Empresa",
  role_pt: "Analista",
  role_en: "Analyst",
  description_pt: "Descrição",
  description_en: "Description",
  start_date: "2024-01-01",
  end_date: null,
  is_current: true,
  skills: ["QA"],
  is_published: true,
  ai_visible: true,
  sort_order: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("localizeProject", () => {
  it("uses Portuguese fields for pt", () => {
    const project = localizeProject(projectRow, "pt");
    expect(project.title).toBe("Portal Corporativo");
    expect(project.result).toBe("Resultado");
  });

  it("uses English fields for en", () => {
    const project = localizeProject(projectRow, "en");
    expect(project.title).toBe("Corporate Portal");
  });

  it("falls back to Portuguese when the English field is empty", () => {
    const project = localizeProject(projectRow, "en");
    expect(project.summary).toBe("Resumo em português");
    // Nullable fields fall back too.
    expect(project.result).toBe("Resultado");
  });
});

describe("localizeExperience", () => {
  it("localizes role and description", () => {
    expect(localizeExperience(experienceRow, "pt").role).toBe("Analista");
    expect(localizeExperience(experienceRow, "en").role).toBe("Analyst");
  });
});
