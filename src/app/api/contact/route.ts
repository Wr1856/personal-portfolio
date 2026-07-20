import { NextResponse, type NextRequest } from "next/server";

import { isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { contactRequestSchema } from "@/lib/validation/contact";
import { getServiceSupabase } from "@/lib/supabase/admin";

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "validation", fieldErrors },
      { status: 400 },
    );
  }

  const { form, turnstileToken } = parsed.data;

  const turnstile = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstile.ok) {
    // Log the failure category only — no tokens, no visitor data.
    console.warn(`[contact] Turnstile verification failed: ${turnstile.reason}`);
    return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    console.error("[contact] Service client unavailable (missing env)");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const { error } = await supabase.from("contact_requests").insert({
    name: form.name,
    email: form.email,
    whatsapp: form.whatsapp,
    category: form.category,
    message: form.message,
    preferred_contact: form.preferredContact,
    locale: form.locale,
    consent_at: new Date().toISOString(),
  });

  if (error) {
    // Log the error code only — never the message content or contact data.
    console.error(`[contact] Insert failed: ${error.code}`);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
