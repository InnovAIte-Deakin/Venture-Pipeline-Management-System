import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import type { DealStatus } from "../../types/deal-flow.types"

export function StatusIcon({ status }: { status: DealStatus }) {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
    case "paused":
      return <Clock className="h-4 w-4 text-yellow-500" aria-hidden="true" />
    case "closed":
      return <CheckCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
    case "lost":
      return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" aria-hidden="true" />
  }
}

export function StatusBadge({ status }: { status: DealStatus }) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    case "paused":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Paused
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Closed
        </Badge>
      )
    case "lost":
      return <Badge variant="destructive">Lost</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function StatusWithIcon({ status }: { status: DealStatus }) {
  return (
    <div className="flex items-center gap-2">
      <StatusIcon status={status} />
      <StatusBadge status={status} />
    </div>
  )
}
