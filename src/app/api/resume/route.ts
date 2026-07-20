import { NextResponse } from "next/server";

import { getSiteProfile } from "@/lib/data/public";
import { getPublicStorageUrl } from "@/lib/supabase/public";

export async function GET() {
  const profile = await getSiteProfile();
  if (!profile?.resume_path) {
    return NextResponse.json({ error: "resume_not_available" }, { status: 404 });
  }

  const url = getPublicStorageUrl("resumes-public", profile.resume_path);
  if (!url) {
    return NextResponse.json({ error: "resume_not_available" }, { status: 404 });
  }

  return NextResponse.redirect(url, 302);
}
