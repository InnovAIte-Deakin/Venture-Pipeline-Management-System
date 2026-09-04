// T19 - Refactor and Improve Performance Analytics

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart } from "lucide-react"
import { ResponsiveContainer, Cell, Pie, PieChart as RCPieChart, Tooltip } from "recharts"

interface SectorPerformanceCardProps {
  sectorPerformance: any[]
}

export function SectorPerformanceCard({ sectorPerformance }: SectorPerformanceCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Sector Performance Analysis
        </CardTitle>
        <CardDescription>Success rates and capital distribution by sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Sector Breakdown</h4>
            <div className="space-y-3">
              {sectorPerformance.slice(0, 6).map((sector, index) => (
                <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                    <span className="text-sm font-medium">{sector.sector}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{sector.ventures} ventures</div>
                    <div className="text-xs text-gray-600">{sector.successRate}% success rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Capital Distribution</h4>
            <ChartContainer config={{}} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RCPieChart>
                  <Pie
                    data={sectorPerformance.slice(0, 5)}
                    cx="50%" cy="50%" outerRadius={80}
                    dataKey="capital" nameKey="sector"
                    label={({ sector, percent }) => `${sector} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sectorPerformance.slice(0, 5).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, 'Capital']} />
                </RCPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}