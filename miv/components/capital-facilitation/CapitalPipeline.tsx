"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CapitalPipelineStageSummary } from "@/types/capital-facilitation"

interface CapitalPipelineProps {
  stages: CapitalPipelineStageSummary[]
}

export function CapitalPipeline({ stages }: CapitalPipelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Facilitation Pipeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Overview of ventures progressing through the capital readiness process.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => (
            <Card key={stage.label} className="bg-muted/40">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-semibold break-words">{stage.value}</p>
                <p className="text-sm text-muted-foreground break-words">{stage.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
