import { API_BASE_URL } from "../config";
import type {
  AnalysisResult,
  CommunityReport,
  Organization,
  RegistryMatch,
} from "./types";

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// --- Warm-up ---------------------------------------------------------------
// The free backend sleeps after ~15 min idle and cold-starts in ~30-50s. We ping
// /health the moment the app loads (from Layout, before the user even reaches a
// submit box) and again on later signs of intent, then poll briefly until it
// responds. The UI reads `warmState` to show a calm "getting ready" message
// instead of a technical "server unreachable" one — see useWarmState() below.
export type WarmState = "idle" | "warming" | "ready";

const READY_TTL_MS = 12 * 60 * 1000; // just under Render's 15-min sleep window
const POLL_EVERY_MS = 6_000;
const GIVE_UP_AFTER_MS = 70_000; // stop tracking; the real request wakes it regardless

let warmState: WarmState = "idle";
let readyAt = 0;
const listeners = new Set<() => void>();

function setState(s: WarmState) {
  warmState = s;
  if (s === "ready") readyAt = Date.now();
  listeners.forEach((cb) => cb());
}

export function subscribeWarmState(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getWarmState(): WarmState {
  return warmState;
}

async function pingOnce(timeoutMs: number): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: ctrl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/** Wake the backend and track readiness. Safe to call often — it is a no-op
 * while already warming, and re-checks once a prior "ready" goes stale. */
export function warmUp(): void {
  if (warmState === "warming") return;
  if (warmState === "ready" && Date.now() - readyAt < READY_TTL_MS) return;

  setState("warming");
  const startedAt = Date.now();

  const poll = async () => {
    const ok = await pingOnce(8_000);
    if (ok) {
      setState("ready");
      return;
    }
    if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
      // Stop showing "getting ready" even if we never confirmed it — the actual
      // analyze request will still wake the server, just possibly slowly.
      setState("ready");
      return;
    }
    setTimeout(poll, POLL_EVERY_MS);
  };
  void poll();
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let code = "error";
    let message = res.statusText;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      /* non-json error */
    }
    throw new ApiError(res.status, code, message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async analyzeText(text: string, consent = false): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, consent_store: consent }),
    });
    return handle<AnalysisResult>(res);
  },

  async analyzeFile(file: File, consent = false): Promise<AnalysisResult> {
    const form = new FormData();
    form.append("file", file);
    form.append("consent_store", String(consent));
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: "POST",
      body: form,
    });
    return handle<AnalysisResult>(res);
  },

  async getAnalysis(id: string): Promise<AnalysisResult> {
    return handle<AnalysisResult>(
      await fetch(`${API_BASE_URL}/api/v1/analyze/${id}`),
    );
  },

  async listOrganizations(
    q = "",
  ): Promise<{ total: number; items: Organization[] }> {
    const url = new URL(`${API_BASE_URL}/api/v1/organizations`);
    if (q) url.searchParams.set("q", q);
    return handle(await fetch(url));
  },

  async getOrganization(slug: string): Promise<Organization> {
    return handle(await fetch(`${API_BASE_URL}/api/v1/organizations/${slug}`));
  },

  async verifySender(
    channel_type: string,
    value: string,
  ): Promise<RegistryMatch> {
    const res = await fetch(`${API_BASE_URL}/api/v1/verify-sender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_type, value }),
    });
    return handle<RegistryMatch>(res);
  },

  async registerOrganization(payload: unknown): Promise<{
    organization: Organization;
    api_key: string;
    note: string;
  }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async listReports(
    region?: string,
  ): Promise<{ items: CommunityReport[] }> {
    const url = new URL(`${API_BASE_URL}/api/v1/reports`);
    if (region) url.searchParams.set("region", region);
    return handle(await fetch(url));
  },

  async createReport(payload: {
    category: string;
    body: string;
    region?: string;
  }): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async confirmReport(
    id: string,
  ): Promise<{ confirmations: number; already: boolean }> {
    return handle(
      await fetch(`${API_BASE_URL}/api/v1/reports/${id}/confirm`, {
        method: "POST",
      }),
    );
  },

  // --- Authenticated (organization) ---
  async orgDashboard(key: string): Promise<Record<string, unknown>> {
    return handle(
      await fetch(`${API_BASE_URL}/api/v1/organizations/me/dashboard`, {
        headers: { "X-API-Key": key },
      }),
    );
  },
  async orgAlerts(key: string): Promise<{ items: Record<string, unknown>[] }> {
    return handle(
      await fetch(`${API_BASE_URL}/api/v1/organizations/me/alerts`, {
        headers: { "X-API-Key": key },
      }),
    );
  },
  async orgChannels(key: string): Promise<{ items: Record<string, unknown>[] }> {
    return handle(
      await fetch(`${API_BASE_URL}/api/v1/organizations/me/channels`, {
        headers: { "X-API-Key": key },
      }),
    );
  },
  async orgApiKeys(key: string): Promise<{ items: Record<string, unknown>[] }> {
    return handle(
      await fetch(`${API_BASE_URL}/api/v1/organizations/me/api-keys`, {
        headers: { "X-API-Key": key },
      }),
    );
  },
};

export { ApiError };
