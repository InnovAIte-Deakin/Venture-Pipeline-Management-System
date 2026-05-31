"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Leaf,
  RefreshCw,
  Lightbulb,
  Download,
  Target,
} from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const highRiskVentures = [
  {
    name: "GreenGrid Energy",
    sector: "Energy",
    stage: "Growth",
    risk: "High",
    reason: "High operating cost and delayed funding pipeline.",
    action: "Review cost structure and prioritise investor outreach.",
  },
  {
    name: "MediLink AI",
    sector: "HealthTech",
    stage: "Early",
    risk: "High",
    reason: "Limited clinical validation and compliance uncertainty.",
    action: "Strengthen validation evidence and regulatory planning.",
  },
  {
    name: "AgriTrack",
    sector: "AgriTech",
    stage: "Early",
    risk: "Medium",
    reason: "Strong idea but weak market adoption data.",
    action: "Run pilot testing with more customer feedback.",
  },
]

const riskChartData = [
  { name: "Low Risk", value: 6 },
  { name: "Medium Risk", value: 4 },
  { name: "High Risk", value: 3 },
]

const fundingChartData = [
  { stage: "Early", ready: 2 },
  { stage: "Growth", ready: 5 },
  { stage: "Mature", ready: 4 },
]

export default function AIInsightsPage() {
  const [data, setData] = useState<any>(null)
  const [sector, setSector] = useState("All")
  const [risk, setRisk] = useState("All")
  const [stage, setStage] = useState("All")

  const loadInsights = async () => {
    const res = await fetch("http://localhost:3001/api/ai/insights")
    const json = await res.json()
    setData(json)
  }

  const downloadReport = () => {
    if (!data) return

    const report = `
AI Insights Report

Generated At: ${data.generatedAt || "Not available"}

Portfolio Score: ${data.portfolioScore}%
High Risk Ventures: ${data.highRiskVentures}
Funding Ready: ${data.fundingReady}
Sustainability Score: ${data.sustainabilityScore}%

AI Priority Ranking:
${(data.priorityVentures || [])
  .map(
    (venture: any, index: number) =>
      `${index + 1}. ${venture.name} | Score: ${venture.priorityScore}
Reason: ${venture.reason}
Recommendation: ${venture.recommendation}`
  )
  .join("\n\n")}

AI Recommendations:
${(data.recommendations || []).map((item: string) => `- ${item}`).join("\n")}

Top Opportunities:
${(data.topOpportunities || []).map((item: string) => `- ${item}`).join("\n")}
`

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "ai-insights-report.txt"
    link.click()

    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const filteredVentures = useMemo(() => {
    return highRiskVentures.filter((venture) => {
      const sectorMatch = sector === "All" || venture.sector === sector
      const riskMatch = risk === "All" || venture.risk === risk
      const stageMatch = stage === "All" || venture.stage === stage

      return sectorMatch && riskMatch && stageMatch
    })
  }, [sector, risk, stage])

  if (!data) {
    return <div className="p-6">Loading AI Insights...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
          <p className="text-muted-foreground">
            Smart venture intelligence, risk analysis, and funding recommendations
          </p>

          {data.generatedAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last generated: {data.generatedAt}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={loadInsights} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Insights
          </Button>

          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insight Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-2 text-sm font-medium">Sector</p>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-md border bg-background p-2"
            >
              <option>All</option>
              <option>Energy</option>
              <option>HealthTech</option>
              <option>AgriTech</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Risk Level</p>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full rounded-md border bg-background p-2"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Venture Stage</p>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-md border bg-background p-2"
            >
              <option>All</option>
              <option>Early</option>
              <option>Growth</option>
              <option>Mature</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <Brain className="mb-2 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Portfolio Score</p>
            <h2 className="text-2xl font-bold">{data.portfolioScore}%</h2>
            <p className="text-xs text-muted-foreground">Overall AI health rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <AlertTriangle className="mb-2 h-6 w-6" />
            <p className="text-sm text-muted-foreground">High Risk Ventures</p>
            <h2 className="text-2xl font-bold">{data.highRiskVentures}</h2>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <TrendingUp className="mb-2 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Funding Ready</p>
            <h2 className="text-2xl font-bold">{data.fundingReady}</h2>
            <p className="text-xs text-muted-foreground">Ready for investor review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Leaf className="mb-2 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Sustainability</p>
            <h2 className="text-2xl font-bold">{data.sustainabilityScore}%</h2>
            <p className="text-xs text-muted-foreground">ESG readiness score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {riskChartData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Readiness by Stage</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingChartData}>
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ready" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>High-Risk Venture Drill Down</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {filteredVentures.map((venture) => (
            <Card key={venture.name}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{venture.name}</h3>
                  <span className="rounded-full border px-2 py-1 text-xs">
                    {venture.risk}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {venture.sector} • {venture.stage}
                </p>
                <p className="text-sm">
                  <strong>Reason:</strong> {venture.reason}
                </p>
                <p className="text-sm">
                  <strong>Suggested action:</strong> {venture.action}
                </p>
              </CardContent>
            </Card>
          ))}

          {filteredVentures.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No ventures match the selected filters.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            The portfolio score is based on funding readiness, risk exposure,
            sustainability strength, and opportunity potential across the venture
            pipeline.
          </p>
          <p>
            The current insights suggest that the portfolio is performing well
            overall, but a few ventures require closer review due to funding delays,
            validation gaps, or weak adoption evidence.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Priority Ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.priorityVentures || []).map((venture: any, index: number) => (
            <div
              key={venture.name}
              className="rounded-lg border p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {index + 1}. {venture.name}
                </h3>
                <span className="rounded-full border px-3 py-1 text-sm">
                  Score: {venture.priorityScore}
                </span>
              </div>

              <p className="text-sm">
                <strong>Reason:</strong> {venture.reason}
              </p>

              <p className="text-sm">
                <strong>Recommendation:</strong> {venture.recommendation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.recommendations || []).map((item: string, i: number) => (
              <p key={i}>• {item}</p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.topOpportunities || []).map((item: string, i: number) => (
              <p key={i}>• {item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}