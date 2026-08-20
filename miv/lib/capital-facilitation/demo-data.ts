// Frontend demonstration data.
// Replace with live Capital Facilitation API data when backend integration is available.
import type {
  CapitalFacilitationRecord,
  CapitalFacilitationSummaryCard,
  CapitalPipelineStageSummary,
} from "@/types/capital-facilitation"

export const capitalFacilitationDemoData: CapitalFacilitationRecord[] = [
  {
    id: "cf-eco-harvest",
    ventureName: "EcoHarvest Technologies",
    fundingStage: "Seed",
    capitalRequired: 750_000,
    capitalSecured: 450_000,
    fundingGap: 300_000,
    progress: 60,
    investorReadiness: "Ready",
    status: "Investor Ready",
  },
  {
    id: "cf-healthbridge-ai",
    ventureName: "HealthBridge AI",
    fundingStage: "Series A",
    capitalRequired: 1_200_000,
    capitalSecured: 900_000,
    fundingGap: 300_000,
    progress: 75,
    investorReadiness: "Ready",
    status: "Due Diligence",
  },
  {
    id: "cf-greenloop-energy",
    ventureName: "GreenLoop Energy",
    fundingStage: "Seed",
    capitalRequired: 600_000,
    capitalSecured: 240_000,
    fundingGap: 360_000,
    progress: 40,
    investorReadiness: "In Review",
    status: "In Progress",
  },
  {
    id: "cf-agriconnect",
    ventureName: "AgriConnect",
    fundingStage: "Pre-Seed",
    capitalRequired: 350_000,
    capitalSecured: 100_000,
    fundingGap: 250_000,
    progress: 29,
    investorReadiness: "Preparing",
    status: "In Progress",
  },
  {
    id: "cf-circularworks",
    ventureName: "CircularWorks",
    fundingStage: "Series A",
    capitalRequired: 1_100_000,
    capitalSecured: 1_100_000,
    fundingGap: 0,
    progress: 100,
    investorReadiness: "Ready",
    status: "Funded",
  },
  {
    id: "cf-impactpay",
    ventureName: "ImpactPay",
    fundingStage: "Seed",
    capitalRequired: 800_000,
    capitalSecured: 420_000,
    fundingGap: 380_000,
    progress: 53,
    investorReadiness: "Ready",
    status: "Investor Ready",
  },
]

export const capitalFacilitationSummary: CapitalFacilitationSummaryCard[] = [
  { label: "Active Capital Requests", value: "8", supportingText: "Across current ventures" },
  { label: "Capital Required", value: "$4.8M", supportingText: "Total funding requirement" },
  { label: "Capital Secured", value: "$2.9M", supportingText: "Committed and raised" },
  { label: "Funding Gap", value: "$1.9M", supportingText: "Remaining capital required" },
]

export const capitalPipelineSummary: CapitalPipelineStageSummary[] = [
  { label: "Investor Ready", value: "3 Ventures" },
  { label: "Due Diligence", value: "2 Ventures" },
  { label: "Funding Discussions", value: "2 Ventures" },
  { label: "Funded", value: "1 Venture" },
]

export const fundingStageOptions = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B", "Growth"]

export const statusOptions = ["All Statuses", "Investor Ready", "In Progress", "Due Diligence", "Funded"]
