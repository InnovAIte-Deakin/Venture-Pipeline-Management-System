import {
  AlertTriangle,
  AreaChart,
  BarChart3,
  CheckCircle,
  DollarSign,
  FileText,
  Globe,
  LineChart,
  PieChart,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

/** Maps the icon-name strings stored in constants back to the actual lucide components, keeping constants/*.ts free of component references. */
export const REPORT_ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Globe,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  FileText,
  LineChart,
  PieChart,
  AreaChart,
}
