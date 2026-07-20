import { ImageResponse } from "next/og";

import { routing } from "@/i18n/routing";
import { getSiteProfile } from "@/lib/data/public";
import { getPublicStorageUrl } from "@/lib/supabase/public";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wesley Maia — Desenvolvedor e Especialista em Soluções Digitais";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getSiteProfile();

  const title =
    locale === "en"
      ? (profile?.professional_title_en ??
        "Developer and Digital Solutions Specialist")
      : (profile?.professional_title_pt ??
        "Desenvolvedor e Especialista em Soluções Digitais");

  const photoUrl = profile?.profile_image_path
    ? getPublicStorageUrl("branding-public", profile.profile_image_path)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#05070B",
          color: "#E8E2D6",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.3em",
              color: "#8C7650",
              textTransform: "uppercase",
            }}
          >
            {`WM · EST. ${new Date().getFullYear()}`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              marginTop: 24,
              lineHeight: 1.05,
            }}
          >
            {profile?.name ?? "Wesley Maia"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              marginTop: 20,
              color: "#7EA4C1",
            }}
          >
            {title}
          </div>
        </div>

        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            width={360}
            height={450}
            style={{
              objectFit: "cover",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              border: "2px solid rgba(140, 118, 80, 0.6)",
            }}
          />
        ) : (
          <div
            style={{
              width: 320,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "2px solid #8C7650",
              color: "#8C7650",
              fontSize: 120,
            }}
          >
            WM
          </div>
        )}
      </div>
    ),
    size,
  );
}
