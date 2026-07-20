import { describe, expect, it } from "vitest";

import { filterProjects, projectCategories } from "@/lib/archive-filters";
import type { LocalizedProject } from "@/lib/localize";

function makeProject(overrides: Partial<LocalizedProject>): LocalizedProject {
  return {
    id: "1",
    slug: "projeto",
    title: "Projeto",
    summary: "",
    problem: "",
    solution: "",
    result: null,
    category: "web",
    projectType: "professional",
    status: "completed",
    technologies: [],
    coverPath: null,
    videoUrl: null,
    demoUrl: null,
    repositoryUrl: null,
    originalUrl: null,
    featured: false,
    ...overrides,
  };
}

const projects = [
  makeProject({
    id: "1",
    slug: "portal",
    title: "Portal Corporativo",
    category: "web",
    technologies: ["Next.js", "TypeScript"],
  }),
  makeProject({
    id: "2",
    slug: "automacao",
    title: "Automação Fiscal",
    category: "automacao",
    technologies: ["Node.js"],
  }),
  makeProject({
    id: "3",
    slug: "api",
    title: "API de Integração",
    category: "backend",
    technologies: ["C#", ".NET"],
  }),
];

describe("filterProjects", () => {
  it("returns everything without filters", () => {
    expect(filterProjects(projects, { query: "", category: null })).toHaveLength(3);
  });

  it("filters by title, ignoring accents and case", () => {
    const result = filterProjects(projects, { query: "automacao", category: null });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("automacao");
  });

  it("filters by technology", () => {
    const result = filterProjects(projects, { query: "typescript", category: null });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("portal");
  });

  it("filters by category", () => {
    const result = filterProjects(projects, { query: "", category: "backend" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("api");
  });

  it("combines query and category", () => {
    const result = filterProjects(projects, {
      query: "next",
      category: "backend",
    });
    expect(result).toHaveLength(0);
  });
});

describe("projectCategories", () => {
  it("returns unique sorted categories", () => {
    expect(projectCategories(projects)).toEqual(["automacao", "backend", "web"]);
  });
});
