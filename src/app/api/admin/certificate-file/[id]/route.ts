import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Admin-only preview of a private certificate file via short-lived signed URL.
 * The file itself is never publicly reachable.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: certification } = await supabase
    .from("certifications")
    .select("private_file_path")
    .eq("id", id)
    .maybeSingle();

  if (!certification?.private_file_path) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("certificates-private")
    .createSignedUrl(certification.private_file_path, 60);

  if (error || !data) {
    return NextResponse.json({ error: "signing_failed" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl, 302);
}
