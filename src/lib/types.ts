export type Verdict = "VERIFIED" | "UNCONFIRMED" | "ALTERED";
export type Confidence = "low" | "medium" | "high";
export type ContentType =
  | "link"
  | "text"
  | "image"
  | "audio"
  | "video"
  | "document";

export interface Signal {
  name: string;
  label: string;
  risk: number;
  direction: "risk" | "trust" | "neutral";
  detail?: string | null;
  raw?: Record<string, unknown>;
}

export interface SemanticResult {
  summary: string;
  claimed_identity: string | null;
  requested_action: string | null;
  financial_request: boolean;
  urgency_pressure: boolean;
  identity_claim: boolean;
  topic: string;
  language_detected: string;
  reasoning: string;
}

export interface RegistryMatch {
  matched: boolean;
  organization_id?: string | null;
  organization_name?: string | null;
  organization_slug?: string | null;
  channel_type?: string | null;
  channel_value?: string | null;
}

export interface Explanation {
  headline_en: string;
  headline_fr: string;
  body_en: string;
  body_fr: string;
  action_en: string;
  action_fr: string;
  checked_en: string;
  checked_fr: string;
}

export interface AnalysisResult {
  id: string;
  content_type: ContentType;
  verdict: Verdict;
  confidence: Confidence;
  summary: string;
  semantic: SemanticResult;
  registry: RegistryMatch;
  explanation: Explanation;
  signals: Signal[];
  checked: string[];
  created_at: string;
}

export interface OrgChannel {
  channel_type: string;
  value: string;
  label?: string | null;
  verified?: boolean;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  kind: string;
  description?: string | null;
  region?: string | null;
  website?: string | null;
  source: string;
  verified_by: string;
  channels: OrgChannel[];
}

export interface CommunityReport {
  id: string;
  category: string;
  body: string;
  region?: string | null;
  confirmations: number;
  created_at: string;
}
