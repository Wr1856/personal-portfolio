export type ConsentState = {
  analytics: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "wm-cookie-consent";

let cached: ConsentState | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      analytics: parsed.analytics,
      decidedAt:
        typeof parsed.decidedAt === "string"
          ? parsed.decidedAt
          : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Client snapshot: lazily reads localStorage once, then serves the cache. */
export function getConsentSnapshot(): ConsentState | null {
  if (!initialized) {
    initialized = true;
    try {
      cached = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cached = null;
    }
  }
  return cached;
}

/** Server snapshot: no decision is known during SSR. */
export function getConsentServerSnapshot(): ConsentState | null {
  return null;
}

export function writeConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    analytics,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode); consent then lasts one page view.
  }
  cached = state;
  initialized = true;
  emit();
  return state;
}
