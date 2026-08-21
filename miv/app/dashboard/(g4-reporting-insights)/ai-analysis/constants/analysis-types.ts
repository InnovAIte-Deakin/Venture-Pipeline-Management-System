import {
  BarChart3,
  DollarSign,
  Globe,
  Shield,
  Target,
  Users,
} from "lucide-react"
import type { AnalysisTypeOption } from "../types/ai-analysis.types"

export const ANALYSIS_TYPES: AnalysisTypeOption[] = [
  { value: "risk-assessment", label: "Risk Assessment", icon: Shield },
  { value: "impact-analysis", label: "Impact Analysis", icon: Target },
  { value: "market-analysis", label: "Market Analysis", icon: BarChart3 },
  { value: "financial-forecast", label: "Financial Forecast", icon: DollarSign },
  { value: "gedsi-assessment", label: "GEDSI Assessment", icon: Users },
  { value: "sustainability-analysis", label: "Sustainability Analysis", icon: Globe },
]
