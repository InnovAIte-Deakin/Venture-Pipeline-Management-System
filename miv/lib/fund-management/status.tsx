import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react"
import type { CapitalCallStatus, DistributionStatus, FundStatus } from "@/types/fund-management"

export function getFundStatusIcon(status: FundStatus | string) {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "closed":
      return <Clock className="h-4 w-4 text-blue-500" />
    case "winding_down":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "fundraising":
      return <TrendingUp className="h-4 w-4 text-blue-500" />
    case "liquidated":
      return <XCircle className="h-4 w-4 text-gray-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

export function getFundStatusBadge(status: FundStatus | string) {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    case "closed":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Closed</Badge>
    case "winding_down":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Winding Down</Badge>
    case "fundraising":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Fundraising</Badge>
    case "liquidated":
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Liquidated</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function getCapitalCallStatusBadge(status: CapitalCallStatus | string) {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
    case "in_progress":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function getDistributionStatusBadge(status: DistributionStatus | string) {
  switch (status) {
    case "paid":
      return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
    case "announced":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Announced</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
    case "processing":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}
