import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";
import { ProjectModal } from "@/components/sections/archive/ProjectModal";
import type { LocalizedProject } from "@/lib/localize";

const project: LocalizedProject = {
  id: "p1",
  slug: "portal",
  title: "Portal Corporativo",
  summary: "Um portal para gestão interna.",
  problem: "Processos manuais lentos.",
  solution: "Aplicação web centralizada.",
  result: "Fluxo digitalizado.",
  category: "web",
  projectType: "professional",
  status: "completed",
  technologies: ["Next.js", "TypeScript"],
  coverPath: null,
  videoUrl: null,
  demoUrl: "https://example.com/demo",
  repositoryUrl: null,
  originalUrl: null,
  featured: false,
};

describe("ProjectModal", () => {
  it("renders project details when open", () => {
    renderWithIntl(
      <ProjectModal project={project} coverUrl={null} onClose={() => {}} />,
    );

    expect(
      screen.getByRole("heading", { name: "Portal Corporativo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Processos manuais lentos.")).toBeInTheDocument();
    expect(screen.getByText("Aplicação web centralizada.")).toBeInTheDocument();
    expect(screen.getByText("Fluxo digitalizado.")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();

    const demoLink = screen.getByRole("link", { name: /demonstração/i });
    expect(demoLink).toHaveAttribute("href", "https://example.com/demo");
    expect(demoLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders nothing when no project is selected", () => {
    renderWithIntl(<ProjectModal project={null} coverUrl={null} onClose={() => {}} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(
      <ProjectModal project={project} coverUrl={null} onClose={onClose} />,
    );

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalled();
  });
});
