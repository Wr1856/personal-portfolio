"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SECTION_IDS } from "@/lib/constants";
import type {
  LocalizedCertification,
  LocalizedExperience,
  LocalizedProject,
} from "@/lib/localize";
import { filterProjects, projectCategories } from "@/lib/archive-filters";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/sections/archive/ProjectsGrid";
import { ProjectModal } from "@/components/sections/archive/ProjectModal";
import { CertificationsList } from "@/components/sections/archive/CertificationsList";
import { ExperiencesList } from "@/components/sections/archive/ExperiencesList";

type ArchiveTab = "projects" | "certifications" | "experiences";

const tabs: ArchiveTab[] = ["projects", "certifications", "experiences"];

type ArchiveSectionProps = {
  projects: LocalizedProject[];
  certifications: LocalizedCertification[];
  experiences: LocalizedExperience[];
  coverUrls: Record<string, string>;
};

export function ArchiveSection({
  projects,
  certifications,
  experiences,
  coverUrls,
}: ArchiveSectionProps) {
  const t = useTranslations("archive");
  const reducedMotion = useReducedMotion();
  const baseId = useId();

  const [activeTab, setActiveTab] = useState<ArchiveTab>("projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const tabRefs = useRef<Map<ArchiveTab, HTMLButtonElement>>(new Map());

  // Deep link: ?project=slug opens the project after hydration. The store
  // snapshot is null on the server, so SSR output stays consistent.
  const initialSlug = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("project"),
    () => null,
  );
  const [userSlug, setUserSlug] = useState<string | null | undefined>(undefined);
  const openProjectSlug = userSlug === undefined ? initialSlug : userSlug;

  const syncUrl = useCallback((slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set("project", slug);
    } else {
      url.searchParams.delete("project");
    }
    window.history.replaceState(null, "", url);
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      setUserSlug(slug);
      syncUrl(slug);
    },
    [syncUrl],
  );

  const closeProject = useCallback(() => {
    setUserSlug(null);
    syncUrl(null);
  }, [syncUrl]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, { query, category }),
    [projects, query, category],
  );

  const categories = useMemo(() => projectCategories(projects), [projects]);

  const openProject_ = openProjectSlug
    ? (projects.find((project) => project.slug === openProjectSlug) ?? null)
    : null;

  const counts: Record<ArchiveTab, number> = {
    projects: projects.length,
    certifications: certifications.length,
    experiences: experiences.length,
  };

  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      setActiveTab(nextTab);
      tabRefs.current.get(nextTab)?.focus();
    }
  }

  return (
    <section
      id={SECTION_IDS.archive}
      aria-labelledby="acervo-titulo"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="acervo-titulo"
          number={t("sectionNumber")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div
          role="tablist"
          aria-label={t("title")}
          className="flex flex-wrap gap-1 border-b border-line"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(node) => {
                if (node) tabRefs.current.set(tab, node);
              }}
              role="tab"
              id={`${baseId}-tab-${tab}`}
              type="button"
              aria-selected={activeTab === tab}
              aria-controls={`${baseId}-panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`min-h-11 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors focus-ring sm:px-6 ${
                activeTab === tab
                  ? "border-b-2 border-brass text-ivory"
                  : "text-muted hover:text-ivory"
              }`}
            >
              {t(`tabs.${tab}`)}
              <span className="ml-2 text-brass">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            role="tabpanel"
            id={`${baseId}-panel-${activeTab}`}
            aria-labelledby={`${baseId}-tab-${activeTab}`}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="pt-8"
          >
            {activeTab === "projects" ? (
              <ProjectsGrid
                projects={filteredProjects}
                totalCount={projects.length}
                coverUrls={coverUrls}
                categories={categories}
                query={query}
                category={category}
                onQueryChange={setQuery}
                onCategoryChange={setCategory}
                onOpenProject={openProject}
              />
            ) : null}
            {activeTab === "certifications" ? (
              <CertificationsList certifications={certifications} />
            ) : null}
            {activeTab === "experiences" ? (
              <ExperiencesList experiences={experiences} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal
        project={openProject_}
        coverUrl={
          openProject_?.coverPath ? (coverUrls[openProject_.id] ?? null) : null
        }
        onClose={closeProject}
      />
    </section>
  );
}
