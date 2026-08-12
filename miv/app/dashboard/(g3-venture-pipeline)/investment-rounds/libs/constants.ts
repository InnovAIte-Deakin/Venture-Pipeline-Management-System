export const ROUND_TYPES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D", "Series E+", "Growth", "IPO"]
export const STAGES = ["Seed", "Early", "Growth", "Late", "Exit"]
export const SECTORS = ["CleanTech", "Agriculture", "FinTech", "Healthcare", "EdTech", "E-commerce", "Manufacturing", "Services", "Technology"]
export const FOUNDER_TYPES = ["women-led", "youth-led", "disability-inclusive", "rural-focus", "indigenous-led", "refugee-led", "veteran-led"]

export const STAGE_TO_ROUND_TYPE: Record<string, string> = {
  INTAKE: "Pre-Seed", SCREENING: "Seed", DUE_DILIGENCE: "Seed",
  INVESTMENT_READY: "Series A", FUNDED: "Series A", SEED: "Seed",
  SERIES_A: "Series A", SERIES_B: "Series B", SERIES_C: "Series C", EXITED: "Series C",
}

export const STAGE_TO_DISPLAY_STAGE: Record<string, string> = {
  INTAKE: "Early", SCREENING: "Early", DUE_DILIGENCE: "Early",
  INVESTMENT_READY: "Growth", FUNDED: "Growth", SEED: "Seed",
  SERIES_A: "Growth", SERIES_B: "Late", SERIES_C: "Late", EXITED: "Exit",
}
