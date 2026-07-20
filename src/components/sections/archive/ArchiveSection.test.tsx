import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";
import { ArchiveSection } from "@/components/sections/archive/ArchiveSection";
import type {
  LocalizedCertification,
  LocalizedExperience,
  LocalizedProject,
} from "@/lib/localize";

const project: LocalizedProject = {
  id: "p1",
  slug: "portal",
  title: "Portal Corporativo",
  summary: "Resumo do projeto.",
  problem: "Problema.",
  solution: "Solução.",
  result: null,
  category: "web",
  projectType: "professional",
  status: "completed",
  technologies: ["Next.js"],
  coverPath: null,
  videoUrl: null,
  demoUrl: null,
  repositoryUrl: null,
  originalUrl: null,
  featured: false,
};

const certification: LocalizedCertification = {
  id: "c1",
  title: "Certificação de Redes",
  issuer: "Instituição X",
  category: "Redes",
  issueDate: "2023-05-01",
  expirationDate: null,
  credentialCode: null,
  credentialUrl: null,
  featured: false,
};

const experience: LocalizedExperience = {
  id: "e1",
  company: "Empresa Y",
  role: "Analista de Sistemas",
  description: "Atuação em sistemas corporativos.",
  startDate: "2024-01-01",
  endDate: null,
  isCurrent: true,
  skills: ["ERP"],
};

function renderArchive() {
  return renderWithIntl(
    <ArchiveSection
      projects={[project]}
      certifications={[certification]}
      experiences={[experience]}
      coverUrls={{}}
    />,
  );
}

describe("ArchiveSection tabs", () => {
  it("shows the projects tab by default", () => {
    renderArchive();
    expect(screen.getByRole("tab", { name: /Projetos/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("heading", { name: "Portal Corporativo" }),
    ).toBeInTheDocument();
  });

  it("switches to certifications", async () => {
    const user = userEvent.setup();
    renderArchive();
    await user.click(screen.getByRole("tab", { name: /Certificações/ }));
    expect(
      await screen.findByRole("heading", { name: "Certificação de Redes" }),
    ).toBeInTheDocument();
  });

  it("switches to experiences", async () => {
    const user = userEvent.setup();
    renderArchive();
    await user.click(screen.getByRole("tab", { name: /Experiências/ }));
    expect(
      await screen.findByRole("heading", { name: "Analista de Sistemas" }),
    ).toBeInTheDocument();
  });

  it("supports arrow-key navigation between tabs", async () => {
    const user = userEvent.setup();
    renderArchive();
    const projectsTab = screen.getByRole("tab", { name: /Projetos/ });
    projectsTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Certificações/ })).toHaveFocus();
  });

  it("filters projects by search query", async () => {
    const user = userEvent.setup();
    renderArchive();
    const search = screen.getByRole("searchbox");
    await user.type(search, "inexistente");
    expect(
      await screen.findByText(/Nenhum projeto corresponde/),
    ).toBeInTheDocument();
  });
});
