import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import "@/app/globals.css";

import { fontVariables } from "@/lib/fonts";
import { getAdminUser } from "@/lib/auth";
import { Monogram } from "@/components/ui/Monogram";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Wesley Maia",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#05070B",
  width: "device-width",
  initialScale: 1,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const user = await getAdminUser();
  const t = await getTranslations("admin.nav");

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={fontVariables}>
      <body className="min-h-screen bg-background font-sans text-ivory antialiased">
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-line bg-background-secondary">
              <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <Monogram size={36} className="text-brass" />
                  <span className="font-display text-lg">Wesley Maia — Admin</span>
                </div>
                {user ? (
                  <AdminNav
                    labels={{
                      projects: t("projects"),
                      certifications: t("certifications"),
                      experiences: t("experiences"),
                      viewSite: t("viewSite"),
                      logout: t("logout"),
                    }}
                  />
                ) : null}
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
