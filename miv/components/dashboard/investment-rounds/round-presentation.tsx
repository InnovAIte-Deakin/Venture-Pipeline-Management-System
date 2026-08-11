import { AlertCircle, AlertTriangle, CheckCircle, Clock, Shield, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { RiskLevel, RoundStatus } from "@/lib/investment-rounds/types"

export function gedsiScoreClass(score: number) {
  if (score >= 90) return "text-green-600"
  if (score >= 80) return "text-blue-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

export function StatusIcon({ status }: { status: RoundStatus }) {
  if (status === "closed") return <CheckCircle className="h-4 w-4 text-green-500" />
  if (status === "closing") return <Clock className="h-4 w-4 text-blue-500" />
  if (status === "open") return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  return <XCircle className="h-4 w-4 text-red-500" />
}

export function StatusBadge({ status }: { status: RoundStatus }) {
  if (status === "closed") return <Badge className="bg-green-100 text-green-800">Closed</Badge>
  if (status === "closing") return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Closing</Badge>
  if (status === "open") return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Open</Badge>
  return <Badge variant="destructive">Cancelled</Badge>
}

export function RiskIcon({ level }: { level: RiskLevel }) {
  if (level === "low") return <Shield className="h-4 w-4 text-green-500" />
  if (level === "medium") return <AlertCircle className="h-4 w-4 text-yellow-500" />
  return <AlertTriangle className="h-4 w-4 text-red-500" />
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  if (level === "low") return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
  if (level === "medium") return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
  return <Badge variant="destructive" className="bg-red-100 text-red-800">High Risk</Badge>
}
