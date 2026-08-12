import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getGEDSIScoreInterpretation } from "@/lib/gedsi-utils"
import { Eye, FileText } from "lucide-react"
import {
  getGEDSIContainerClass,
  getGEDSILabelClass,
  getGEDSIValueClass,
  getPriorityBadge,
  getStatusIcon
} from "../../lib/due-diligence-formatters"
import type { VentureDD } from "../../types/due-diligence.types"

interface MobileVentureCardProps {
  venture: VentureDD
  onViewDetails: (ventureName: string) => void
}

export function MobileVentureCard({ venture, onViewDetails }: MobileVentureCardProps) {
  const gedsiInterpretation = venture.gedsiScore
    ? getGEDSIScoreInterpretation(venture.gedsiScore)
    : null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <CardTitle className="text-lg break-words">{venture.ventureName}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {getPriorityBadge(venture.priority)}
            <Badge
              variant={venture.riskLevel === "high" ? "destructive" :
                     venture.riskLevel === "medium" ? "default" : "secondary"}
              className="text-xs"
            >
              {venture.riskLevel} risk
            </Badge>
          </div>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <span>Lead: {venture.leadAnalyst}</span>
            <span>Due: {venture.dueDate}</span>
          </div>
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
          <div className="grid gap-2 text-xs">
            {Object.entries(venture.categories).map(([category, item]) => (
              <div key={category} className="flex items-center justify-between p-2 bg-muted/50 rounded gap-3">
                <div className="flex items-center gap-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    category === "Financial" ? "bg-green-500" :
                    category === "Legal" ? "bg-blue-500" :
                    category === "Technical" ? "bg-purple-500" :
                    "bg-orange-500"
                  }`} />
                  <span className="truncate">{category}</span>
                </div>
                <span className="font-medium shrink-0">{item.completion}%</span>
              </div>
            ))}
          </div>
        </div>

        {venture.gedsiScore && gedsiInterpretation && (
          <div className={`flex items-center justify-between p-2 rounded gap-3 ${getGEDSIContainerClass(gedsiInterpretation.color)}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm font-medium ${getGEDSILabelClass(gedsiInterpretation.color)}`}>GEDSI Score</span>
              <Badge variant="outline" className="text-xs">
                {gedsiInterpretation.label}
              </Badge>
            </div>
            <span className={`font-bold shrink-0 ${getGEDSIValueClass(gedsiInterpretation.color)}`}>{venture.gedsiScore}/100</span>
          </div>
        )}

        <div className="grid gap-1 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center justify-between gap-3">
            <span>{venture.totalDocuments} docs</span>
            <span>{venture.totalComments} comments</span>
          </div>
          <span>{venture.lastActivity}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(venture.ventureName)}>
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
}
