"use client";

import { useId } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { LocalizedProject } from "@/lib/localize";
import { Tag } from "@/components/ui/Tag";
import { Monogram } from "@/components/ui/Monogram";

type ProjectsGridProps = {
  projects: LocalizedProject[];
  totalCount: number;
  coverUrls: Record<string, string>;
  categories: string[];
  query: string;
  category: string | null;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onOpenProject: (slug: string) => void;
};

export function ProjectsGrid({
  projects,
  totalCount,
  coverUrls,
  categories,
  query,
  category,
  onQueryChange,
  onCategoryChange,
  onOpenProject,
}: ProjectsGridProps) {
  const t = useTranslations("archive.projects");
  const tCounters = useTranslations("archive.counters");
  const searchId = useId();
  const filterId = useId();

  if (totalCount === 0) {
    return (
      <p className="border border-line bg-surface px-4 py-12 text-center text-muted">
        {t("empty")}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={searchId} className="block text-sm text-muted">
            {t("searchLabel")}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="mt-1.5 w-full border border-line bg-surface px-4 py-3 text-sm text-ivory placeholder:text-muted/60 focus-ring"
          />
        </div>
        <div className="sm:w-64">
          <label htmlFor={filterId} className="block text-sm text-muted">
            {t("filterLabel")}
          </label>
          <select
            id={filterId}
            value={category ?? ""}
            onChange={(event) =>
              onCategoryChange(event.target.value === "" ? null : event.target.value)
            }
            className="mt-1.5 w-full border border-line bg-surface px-4 py-3 text-sm text-ivory focus-ring"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted">
        {tCounters("projects", { count: projects.length })}
      </p>

      {projects.length === 0 ? (
        <div className="mt-6 border border-line bg-surface px-4 py-12 text-center">
          <p className="text-muted">{t("noResults")}</p>
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onCategoryChange(null);
            }}
            className="mt-4 border border-line px-4 py-2 text-sm text-ivory hover:border-blue-light focus-ring"
          >
            {t("clearFilters")}
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const coverUrl = coverUrls[project.id];
            return (
              <li key={project.id}>
                <article className="frame-editorial group flex h-full flex-col bg-surface transition-colors hover:border-line-strong">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-background-secondary">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={t("coverAlt", { title: project.title })}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full items-center justify-center text-brass/50"
                      >
                        <Monogram size={64} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone="brass">{t(`types.${project.projectType}`)}</Tag>
                      <Tag>{t(`statuses.${project.status}`)}</Tag>
                    </div>
                    <h3 className="mt-3 font-display text-2xl text-ivory">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {project.summary}
                    </p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-blue-light">
                      {project.technologies.slice(0, 4).join(" · ")}
                      {project.technologies.length > 4 ? " · …" : ""}
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenProject(project.slug)}
                      className="mt-5 min-h-11 self-start border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-blue-light hover:text-blue-light focus-ring"
                    >
                      {t("viewDetails")}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
