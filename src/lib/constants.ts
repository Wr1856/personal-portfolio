export const BRAND = {
  name: "Wesley Maia",
  monogram: "WM",
  whatsappNumber: "5571991797751",
  whatsappDisplay: "+55 71 99179-7751",
  email: "W.maia.1856@gmail.com",
  githubUrl: "https://github.com/Wr1856",
  githubHandle: "Wr1856",
} as const;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function isWesleyAiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WESLEY_AI_ENABLED === "true";
}

export const TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "Angular",
  "Vue.js",
  "React",
  "Next.js",
  "Node.js",
  "C#",
  ".NET",
  "SQL",
  "Git",
  "GitHub",
  "Shell Script",
  "Linux",
  "Windows Server",
  "Redes",
  "ERP",
  "NetApp",
  "Cloud",
  "QA",
  "Scrum",
  "Kanban",
] as const;

export const SECTION_IDS = {
  home: "inicio",
  profile: "perfil",
  archive: "acervo",
  lab: "wesley-lab",
  contact: "contato",
} as const;
