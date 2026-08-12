"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export function MobileView({ data }: { data: any }) {
  const { metrics, filteredMetrics, setShowAddMetric, loading } = data

  if (loading) return <div className="p-4 text-center">Loading mobile layout...</div>

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">GEDSI Hub (Mobile)</h1>
        <Button size="sm" onClick={() => setShowAddMetric(true)}><Plus className="h-4 w-4" /></Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {filteredMetrics.map((metric: any) => (
          <Card key={metric.id}>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{metric.ventureName}</CardTitle>
                <Badge>{metric.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2 text-sm space-y-1">
              <div className="font-medium">{metric.metricName}</div>
              <div className="text-muted-foreground">Target: {metric.targetValue} {metric.unit}</div>
              <div className="text-muted-foreground">Current: {metric.currentValue} {metric.unit}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}