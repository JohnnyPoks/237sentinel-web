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
