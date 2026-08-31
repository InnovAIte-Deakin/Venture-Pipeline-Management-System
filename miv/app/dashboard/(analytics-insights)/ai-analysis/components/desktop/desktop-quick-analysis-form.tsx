import { Brain, RefreshCw, Zap } from "lucide-react"
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

type DesktopQuickAnalysisFormProps = Pick<
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

export function DesktopQuickAnalysisForm({
  selectedVenture,
  selectedAnalysisType,
  customPrompt,
  isAnalyzing,
  setSelectedVenture,
  setSelectedAnalysisType,
  setCustomPrompt,
  startAnalysis,
}: DesktopQuickAnalysisFormProps) {
  return (
    <Card id="quick-analysis">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <span>Quick Analysis</span>
        </CardTitle>
        <CardDescription>
          Start a new AI-powered analysis for any venture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="desktop-analysis-venture"
              className="mb-2 block text-sm font-medium"
            >
              Select Venture
            </label>
            <Select value={selectedVenture} onValueChange={setSelectedVenture}>
              <SelectTrigger id="desktop-analysis-venture" className="w-full">
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

          <div>
            <label
              htmlFor="desktop-analysis-type"
              className="mb-2 block text-sm font-medium"
            >
              Analysis Type
            </label>
            <Select
              value={selectedAnalysisType}
              onValueChange={setSelectedAnalysisType}
            >
              <SelectTrigger id="desktop-analysis-type" className="w-full">
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

          <div className="flex items-end">
            <Button
              type="button"
              onClick={startAnalysis}
              disabled={
                !selectedVenture || !selectedAnalysisType || isAnalyzing
              }
              className="w-full"
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
          </div>
        </div>

        <div>
          <label
            htmlFor="desktop-analysis-prompt"
            className="mb-2 block text-sm font-medium"
          >
            Custom Prompt (Optional)
          </label>
          <Textarea
            id="desktop-analysis-prompt"
            placeholder="Add specific questions or focus areas for the analysis..."
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
