import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getGEDSIScoreInterpretation } from "@/lib/gedsi-utils"
import { Eye, FileText, Plus, Shield } from "lucide-react"
import {
  getGEDSIContainerClass,
  getGEDSILabelClass,
  getGEDSIValueClass,
  getPriorityBadge,
  getStatusIcon
} from "../lib/due-diligence-formatters"
import type { VentureDD } from "../types/due-diligence.types"
import { MobileVentureCard } from "./mobile/mobile-venture-card"

interface VentureOverviewGridProps {
  venturesDDs: VentureDD[]
  onViewVentureDetails: (ventureName: string) => void
  onStartDueDiligence: () => void
}

export function VentureOverviewGrid({
  venturesDDs,
  onViewVentureDetails,
  onStartDueDiligence
}: VentureOverviewGridProps) {
  return (
    <>
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {venturesDDs.map((venture) => {
          const gedsiInterpretation = venture.gedsiScore
            ? getGEDSIScoreInterpretation(venture.gedsiScore)
            : null

          return (
            <Card key={venture.ventureId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{venture.ventureName}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(venture.priority)}
                    <Badge
                      variant={venture.riskLevel === "high" ? "destructive" :
                             venture.riskLevel === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {venture.riskLevel} risk
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Lead: {venture.leadAnalyst}</span>
                  <span>Due: {venture.dueDate}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(venture.overallStatus)}
                      <span className="text-sm font-medium">{venture.overallProgress}%</span>
                    </div>
                  </div>
                  <Progress
                    value={venture.overallProgress}
                    className={`h-2 ${
                      venture.overallProgress >= 80 ? "[&>div]:bg-green-600" :
                      venture.overallProgress >= 50 ? "[&>div]:bg-yellow-500" :
                      "[&>div]:bg-red-500"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Category Progress</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(venture.categories).map(([category, item]) => (
                      <div key={category} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            category === "Financial" ? "bg-green-500" :
                            category === "Legal" ? "bg-blue-500" :
                            category === "Technical" ? "bg-purple-500" :
                            "bg-orange-500"
                          }`} />
                          <span className="truncate">{category}</span>
                        </div>
                        <span className="font-medium">{item.completion}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {venture.gedsiScore && gedsiInterpretation && (
                  <div className={`flex items-center justify-between p-2 rounded ${getGEDSIContainerClass(gedsiInterpretation.color)}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getGEDSILabelClass(gedsiInterpretation.color)}`}>GEDSI Score</span>
                      <Badge variant="outline" className="text-xs">
                        {gedsiInterpretation.label}
                      </Badge>
                    </div>
                    <span className={`font-bold ${getGEDSIValueClass(gedsiInterpretation.color)}`}>{venture.gedsiScore}/100</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-4">
                    <span>{venture.totalDocuments} docs</span>
                    <span>{venture.totalComments} comments</span>
                  </div>
                  <span>{venture.lastActivity}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewVentureDetails(venture.ventureName)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" aria-label={`Generate report for ${venture.ventureName}`} onClick={() => {
                    alert(`Generate report for ${venture.ventureName} (Demo)`)
                  }}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:hidden">
        {venturesDDs.map((venture) => (
          <MobileVentureCard key={venture.ventureId} venture={venture} onViewDetails={onViewVentureDetails} />
        ))}
      </div>

      {venturesDDs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Ventures Found</h3>
            <p className="text-muted-foreground mb-4">No ventures with due diligence processes found in the database.</p>
            <Button onClick={onStartDueDiligence}>
              <Plus className="h-4 w-4 mr-2" />
              Start Due Diligence
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
