import type { LocalizedProject } from "@/lib/localize";

export type ProjectFilters = {
  query: string;
  category: string | null;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Filters projects by free-text query (title or technology) and category.
 * Accent-insensitive so "automacao" matches "Automação".
 */
export function filterProjects(
  projects: LocalizedProject[],
  filters: ProjectFilters,
): LocalizedProject[] {
  const query = normalize(filters.query.trim());

  return projects.filter((project) => {
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    if (query === "") return true;

    const haystacks = [project.title, ...project.technologies];
    return haystacks.some((value) => normalize(value).includes(query));
  });
}

export function projectCategories(projects: LocalizedProject[]): string[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort(
    (a, b) => a.localeCompare(b),
  );
}
