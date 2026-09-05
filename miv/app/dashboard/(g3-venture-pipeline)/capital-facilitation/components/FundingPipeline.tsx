"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fundingPipelineDemo, fundingPipelineStagesDemo } from "../lib/demo-data"

const statusColors: Record<string, string> = {
  "On Track": "bg-blue-100 text-blue-800 border-blue-200",
  "At Risk": "bg-red-100 text-red-800 border-red-200",
  Complete: "bg-green-100 text-green-800 border-green-200",
}

export function FundingPipeline() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Funding Pipeline</h2>
        <p className="text-sm text-muted-foreground">
          Monitor ventures as they progress from capital preparation to funding completion.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {fundingPipelineStagesDemo.map((stage) => (
          <Card key={stage.label} className="bg-muted/40">
            <CardContent className="p-4 text-center">
              <p className="text-lg font-semibold break-words">{stage.value}</p>
              <p className="text-sm text-muted-foreground break-words">{stage.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[64rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Next Step</TableHead>
                  <TableHead>Funding Target</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingPipelineDemo.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{record.ventureName}</TableCell>
                    <TableCell>{record.currentStage}</TableCell>
                    <TableCell className="max-w-[220px] break-words">{record.nextStep}</TableCell>
                    <TableCell>{record.fundingTarget}</TableCell>
                    <TableCell>
                      <div className="flex min-w-[8rem] items-center gap-2">
                        <Progress value={record.probability} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{record.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.status] || ""}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
