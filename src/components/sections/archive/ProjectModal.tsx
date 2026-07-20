"use client";

import { useId } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { LocalizedProject } from "@/lib/localize";
import { Modal } from "@/components/ui/Modal";
import { Tag } from "@/components/ui/Tag";

type ProjectModalProps = {
  project: LocalizedProject | null;
  coverUrl: string | null;
  onClose: () => void;
};

export function ProjectModal({ project, coverUrl, onClose }: ProjectModalProps) {
  const t = useTranslations("archive.projects");
  const tCommon = useTranslations("common");
  const titleId = useId();

  const externalLinks = project
    ? ([
        { key: "visitOriginal", url: project.originalUrl },
        { key: "viewRepository", url: project.repositoryUrl },
        { key: "viewDemo", url: project.demoUrl },
        { key: "watchVideo", url: project.videoUrl },
      ] as const).filter((link) => link.url)
    : [];

  return (
    <Modal open={project !== null} onClose={onClose} labelledBy={titleId} wide>
      {project ? (
        <article>
          <div className="flex flex-wrap items-center gap-2 pr-12">
            <Tag tone="brass">{t(`types.${project.projectType}`)}</Tag>
            <Tag>{t(`statuses.${project.status}`)}</Tag>
            <Tag tone="blue">{project.category}</Tag>
          </div>

          <h2 id={titleId} className="mt-4 font-display text-3xl text-ivory sm:text-4xl">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted">{project.summary}</p>

          {coverUrl ? (
            <div className="relative mt-6 aspect-video overflow-hidden border border-line">
              <Image
                src={coverUrl}
                alt={t("coverAlt", { title: project.title })}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          ) : null}

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                {t("modal.problem")}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ivory">
                {project.problem}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                {t("modal.solution")}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ivory">
                {project.solution}
              </dd>
            </div>
            {project.result ? (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                  {t("modal.result")}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ivory">
                  {project.result}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                {t("modal.technologies")}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <Tag key={technology} tone="blue">
                    {technology}
                  </Tag>
                ))}
              </dd>
            </div>
          </dl>

          {externalLinks.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              {externalLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-blue-light hover:text-blue-light focus-ring"
                  >
                    {t(`modal.${link.key}`)}
                    <span className="sr-only"> ({tCommon("externalLink")})</span>
                    <span aria-hidden="true" className="ml-2">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ) : null}
    </Modal>
  );
}
