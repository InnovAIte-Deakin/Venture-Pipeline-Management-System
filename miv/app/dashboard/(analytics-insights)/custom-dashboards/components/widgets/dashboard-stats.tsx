import type { Dashboard } from "../dashboard-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart, Clock, Grid3X3, Star } from "lucide-react"

interface DashboardStatsProps {
  dashboards: Dashboard[]
}

export default function DashboardStats({
  dashboards,
}: DashboardStatsProps) {
  const publicDashboards = dashboards.filter(
    (dashboard) => dashboard.isPublic
  ).length

  const privateDashboards = dashboards.length - publicDashboards

  const totalWidgets = dashboards.reduce(
    (total, dashboard) => total + dashboard.widgets,
    0
  )

  const averageWidgets =
    dashboards.length > 0
      ? Math.round(totalWidgets / dashboards.length)
      : 0

  const favoriteDashboards = dashboards.filter(
    (dashboard) => dashboard.isFavorite
  ).length

  const favoritePercentage =
    dashboards.length > 0
      ? ((favoriteDashboards / dashboards.length) * 100).toFixed(1)
      : "0"

  const recentlyUpdated = dashboards.filter(
    (dashboard) =>
      dashboard.lastModified.includes("hour") ||
      dashboard.lastModified.includes("day") ||
      dashboard.lastModified.includes("Just now")
  ).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <Card className="border-t-4 border-t-blue-500 transition-shadow hover-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Dashboards
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <BarChart className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboards.length}</div>
          <p className="text-xs text-muted-foreground">
            {publicDashboards} public, {privateDashboards} private
          </p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-purple-500 transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Widgets
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
            <Grid3X3 className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWidgets}</div>
          <p className="text-xs text-muted-foreground">
            Average {averageWidgets} per dashboard
          </p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-amber-500 transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
            <Star className="h-4 w-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{favoriteDashboards}</div>
          <p className="text-xs text-muted-foreground">
            {favoritePercentage}% of total
          </p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-green-500 transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recently Updated
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Clock className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentlyUpdated}</div>
          <p className="text-xs text-muted-foreground">
            In the last 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
