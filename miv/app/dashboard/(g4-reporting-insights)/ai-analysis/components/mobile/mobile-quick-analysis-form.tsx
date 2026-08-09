import { Brain, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ANALYSIS_TYPES } from "../../constants/analysis-types"
import { QUICK_ANALYSIS_VENTURES } from "../../mock-data/ventures.mock-data"
import type { UseAIAnalysisResult } from "../../hooks/use-ai-analysis"

type MobileQuickAnalysisFormProps = Pick<
  UseAIAnalysisResult,
  | "selectedVenture"
  | "selectedAnalysisType"
  | "customPrompt"
  | "isAnalyzing"
  | "setSelectedVenture"
  | "setSelectedAnalysisType"
  | "setCustomPrompt"
  | "startAnalysis"
>

export function MobileQuickAnalysisForm({
  selectedVenture,
  selectedAnalysisType,
  customPrompt,
  isAnalyzing,
  setSelectedVenture,
  setSelectedAnalysisType,
  setCustomPrompt,
  startAnalysis,
}: MobileQuickAnalysisFormProps) {
  return (
    <Card id="quick-analysis" className="overflow-hidden rounded-2xl shadow-sm">
      <CardHeader className="border-b bg-slate-50/80 p-4 dark:bg-slate-900/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Quick Analysis</span>
        </CardTitle>
        <CardDescription>
          Select a venture and the insight you want to generate.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="rounded-xl border bg-background p-3">
          <label
            htmlFor="mobile-analysis-venture"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              1
            </span>
            Select Venture
          </label>
          <Select value={selectedVenture} onValueChange={setSelectedVenture}>
            <SelectTrigger id="mobile-analysis-venture" className="h-11 w-full">
              <SelectValue placeholder="Choose a venture" />
            </SelectTrigger>
            <SelectContent>
              {QUICK_ANALYSIS_VENTURES.map((venture) => (
                <SelectItem key={venture.id} value={venture.id}>
                  {venture.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-background p-3">
          <label
            htmlFor="mobile-analysis-type"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              2
            </span>
            Analysis Type
          </label>
          <Select
            value={selectedAnalysisType}
            onValueChange={setSelectedAnalysisType}
          >
            <SelectTrigger id="mobile-analysis-type" className="h-11 w-full">
              <SelectValue placeholder="Choose analysis type" />
            </SelectTrigger>
            <SelectContent>
              {ANALYSIS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="mobile-analysis-prompt"
            className="mb-2 block text-sm font-medium"
          >
            Custom Prompt <span className="text-muted-foreground">(Optional)</span>
          </label>
          <Textarea
            id="mobile-analysis-prompt"
            placeholder="Add questions or focus areas..."
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            rows={3}
            className="min-h-24 resize-none rounded-xl"
          />
        </div>

        <Button
          type="button"
          onClick={startAnalysis}
          disabled={!selectedVenture || !selectedAnalysisType || isAnalyzing}
          className="h-11 w-full rounded-xl"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Start Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
