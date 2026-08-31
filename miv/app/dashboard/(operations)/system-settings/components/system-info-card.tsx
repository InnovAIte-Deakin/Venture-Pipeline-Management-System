import { FileText, HelpCircle, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { SystemInfo } from "../types"

interface SystemInfoCardProps {
  systemInfo: SystemInfo
}

export function SystemInfoCard({ systemInfo }: SystemInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium">Version</span>
            <Badge variant="secondary">{systemInfo.version}</Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium">Build Number</span>
            <span className="text-sm text-gray-600">{systemInfo.buildNumber}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium">Last Update</span>
            <span className="text-sm text-gray-600">{systemInfo.lastUpdate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium">Uptime</span>
            <span className="text-sm text-gray-600">{systemInfo.uptime}</span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button variant="outline" className="w-full">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            View Changelog
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
