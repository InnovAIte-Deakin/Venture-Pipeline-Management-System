import type { CapitalRequestStatus } from "../types";

export const STAGE_LABELS: Record<string, string> = {
  INTAKE: "Initial Review",
  SCREENING: "Initial Review",
  DUE_DILIGENCE: "Due Diligence",
  INVESTMENT_READY: "Term Sheet",
  FUNDED: "Documentation",
  SEED: "Documentation",
  SERIES_A: "Closed",
  SERIES_B: "Closed",
  SERIES_C: "Closed",
  EXITED: "Closed",
};

export const STAGE_PROGRESS: Record<string, number> = {
  INTAKE: 20,
  SCREENING: 35,
  DUE_DILIGENCE: 60,
  INVESTMENT_READY: 80,
  FUNDED: 100,
  SERIES_A: 100,
  SERIES_B: 100,
  SERIES_C: 100,
};

export const PIPELINE_STAGE_NAMES = [
  "Initial Review",
  "Due Diligence",
  "Term Sheet",
  "Documentation",
  "Closed",
] as const;

export const INVESTOR_NAMES = [
  "Green Ventures Fund",
  "Impact Capital Partners",
  "Southeast Asia Growth Fund",
  "Social Impact Ventures",
  "Climate Action Capital",
  "Women Entrepreneurs Fund",
  "Rural Development Partners",
] as const;

export const ANALYTICS_SECTORS = [
  "HealthTech",
  "CleanTech",
  "FinTech",
  "AgriTech",
] as const;

export const STATUS_CLASSES: Record<CapitalRequestStatus, string> = {
  Approved: "bg-green-100 text-green-800 border-green-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};
