import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function getStatusIcon(status: string) {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
    case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />
    case "not_started": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "blocked": return <AlertTriangle className="h-4 w-4 text-red-500" />
    default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "completed": return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
    case "in_progress": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
    case "not_started": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Not Started</Badge>
    case "blocked": return <Badge variant="destructive">Blocked</Badge>
    default: return <Badge variant="secondary">Unknown</Badge>
  }
}

export function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high": return <Badge variant="destructive">High</Badge>
    case "medium": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
    case "low": return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
    default: return <Badge variant="secondary">Unknown</Badge>
  }
}

export function getGEDSIContainerClass(color: string): string {
  switch (color) {
    case "green": return "bg-green-50 dark:bg-green-950"
    case "blue": return "bg-blue-50 dark:bg-blue-950"
    case "yellow": return "bg-yellow-50 dark:bg-yellow-950"
    case "red": return "bg-red-50 dark:bg-red-950"
    default: return "bg-gray-50 dark:bg-gray-950"
  }
}

export function getGEDSILabelClass(color: string): string {
  switch (color) {
    case "green": return "text-green-800 dark:text-green-200"
    case "blue": return "text-blue-800 dark:text-blue-200"
    case "yellow": return "text-yellow-800 dark:text-yellow-200"
    case "red": return "text-red-800 dark:text-red-200"
    default: return "text-gray-800 dark:text-gray-200"
  }
}

export function getGEDSIValueClass(color: string): string {
  switch (color) {
    case "green": return "text-green-600 dark:text-green-400"
    case "blue": return "text-blue-600 dark:text-blue-400"
    case "yellow": return "text-yellow-600 dark:text-yellow-400"
    case "red": return "text-red-600 dark:text-red-400"
    default: return "text-gray-600 dark:text-gray-400"
  }
}
