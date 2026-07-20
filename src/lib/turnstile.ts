import "server-only";

import { getTurnstileSecretKey } from "@/lib/env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "invalid" | "network" };

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
): Promise<VerifyResult> {
  const secret = getTurnstileSecretKey();
  if (!secret) {
    return { ok: false, reason: "not_configured" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!response.ok) {
      return { ok: false, reason: "network" };
    }
    const result = (await response.json()) as { success: boolean };
    return result.success ? { ok: true } : { ok: false, reason: "invalid" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
