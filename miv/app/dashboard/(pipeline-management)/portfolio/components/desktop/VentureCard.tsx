"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import type { PortfolioCompany } from "../../types"

interface VentureCardProps {
  company: PortfolioCompany
  onClick: () => void
}

export function VentureCard({ company, onClick }: VentureCardProps) {
  const founderTypes: string[] = (() => {
    try {
      return JSON.parse(company.founderTypes || '[]')
    } catch {
      return []
    }
  })()

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{company.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{company.location}</p>
            <p className="text-xs text-muted-foreground mt-1">{company.inclusionFocus}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="text-xs">{company.stage}</Badge>
            <Badge variant="outline" className="text-xs">{company.status}</Badge>
            <div className={`w-2 h-2 rounded-full ${
              company.aiInsights?.priority === "urgent" ? "bg-red-500" :
              company.aiInsights?.priority === "high" ? "bg-orange-500" :
              company.aiInsights?.priority === "medium" ? "bg-yellow-500" :
              "bg-green-500"
            }`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Indicators */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{company.gedsiMetrics?.length || 0}</div>
            <p className="text-xs text-muted-foreground">GEDSI Metrics</p>
          </div>
          <div>
            <div className="text-lg font-bold text-pink-600">{company.gedsiScore?.toFixed(0) || 'N/A'}%</div>
            <p className="text-xs text-muted-foreground">GEDSI</p>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{company.impactScore?.toFixed(0) || 'N/A'}%</div>
            <p className="text-xs text-muted-foreground">Impact</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Documents:</span>
            <span className="font-medium">{company._count?.documents || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Activities:</span>
            <span className="font-medium">{company._count?.activities || 0}</span>
          </div>
        </div>

        {/* Founder Type Tags */}
        <div className="flex flex-wrap gap-1">
          {founderTypes.slice(0, 2).map((type: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {type.replace('-', ' ')}
            </Badge>
          ))}
          {founderTypes.length === 0 && (
            <Badge variant="outline" className="text-xs">No founder type set</Badge>
          )}
        </div>

        {/* AI Alerts */}
        {company.aiInsights?.alerts && company.aiInsights.alerts.length > 0 && (
          <Alert className="py-2">
            <Sparkles className="h-3 w-3" />
            <AlertDescription className="text-xs">
              <strong>Alert:</strong> {company.aiInsights.alerts[0]}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>Created: {new Date(company.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(company.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
