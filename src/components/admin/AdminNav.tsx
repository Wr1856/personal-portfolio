"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { logoutAction } from "@/app/(admin)/admin/actions";

type AdminNavProps = {
  labels: {
    projects: string;
    certifications: string;
    experiences: string;
    viewSite: string;
    logout: string;
  };
};

const links = [
  { href: "/admin/projetos", key: "projects" },
  { href: "/admin/certificacoes", key: "certifications" },
  { href: "/admin/experiencias", key: "experiences" },
] as const;

export function AdminNav({ labels }: AdminNavProps) {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
      {links.map(({ href, key }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname.startsWith(href) ? "page" : undefined}
          className={`px-3 py-2 text-sm transition-colors focus-ring ${
            pathname.startsWith(href)
              ? "bg-navy text-ivory"
              : "text-muted hover:text-ivory"
          }`}
        >
          {labels[key]}
        </Link>
      ))}
      <Link
        href="/admin/perfil"
        aria-current={pathname.startsWith("/admin/perfil") ? "page" : undefined}
        className={`px-3 py-2 text-sm transition-colors focus-ring ${
          pathname.startsWith("/admin/perfil")
            ? "bg-navy text-ivory"
            : "text-muted hover:text-ivory"
        }`}
      >
        {t("profile")}
      </Link>
      <Link
        href="/pt"
        className="px-3 py-2 text-sm text-muted transition-colors hover:text-ivory focus-ring"
      >
        {labels.viewSite}
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="border border-line px-3 py-2 text-sm text-muted transition-colors hover:text-ivory focus-ring"
        >
          {labels.logout}
        </button>
      </form>
    </nav>
  );
}
