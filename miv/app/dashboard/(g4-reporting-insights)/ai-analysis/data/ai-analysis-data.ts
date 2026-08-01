import {
  BarChart3,
  DollarSign,
  Globe,
  Shield,
  Target,
  Users,
} from "lucide-react"
import type {
  AnalysisTypeOption,
  QuickAnalysisVenture,
} from "../types/ai-analysis.types"

export const ANALYSIS_TYPES: AnalysisTypeOption[] = [
  { value: "risk-assessment", label: "Risk Assessment", icon: Shield },
  { value: "impact-analysis", label: "Impact Analysis", icon: Target },
  { value: "market-analysis", label: "Market Analysis", icon: BarChart3 },
  { value: "financial-forecast", label: "Financial Forecast", icon: DollarSign },
  { value: "gedsi-assessment", label: "GEDSI Assessment", icon: Users },
  { value: "sustainability-analysis", label: "Sustainability Analysis", icon: Globe },
]

export const QUICK_ANALYSIS_VENTURES: QuickAnalysisVenture[] = [
  {
    id: "1",
    name: "EcoTech Solutions",
    stage: "Due Diligence",
    sector: "Clean Energy",
    location: "Kenya",
    fundingAmount: 500000,
  },
  {
    id: "2",
    name: "AgriTech Innovations",
    stage: "Investment Ready",
    sector: "Agriculture",
    location: "Uganda",
    fundingAmount: 750000,
  },
  {
    id: "3",
    name: "HealthTech Africa",
    stage: "Active",
    sector: "Healthcare",
    location: "Nigeria",
    fundingAmount: 1200000,
  },
  {
    id: "4",
    name: "FinTech Mobile",
    stage: "Due Diligence",
    sector: "Financial Services",
    location: "Ghana",
    fundingAmount: 300000,
  },
]
