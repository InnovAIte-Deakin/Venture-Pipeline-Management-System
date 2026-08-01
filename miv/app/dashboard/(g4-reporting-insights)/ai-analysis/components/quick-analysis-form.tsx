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
import {
  ANALYSIS_TYPES,
  QUICK_ANALYSIS_VENTURES,
} from "../data/ai-analysis-data"

interface QuickAnalysisFormProps {
  selectedVenture: string
  selectedAnalysisType: string
  customPrompt: string
  isAnalyzing: boolean
  onVentureChange: (value: string) => void
  onAnalysisTypeChange: (value: string) => void
  onCustomPromptChange: (value: string) => void
  onStartAnalysis: () => void
}

export function QuickAnalysisForm({
  selectedVenture,
  selectedAnalysisType,
  customPrompt,
  isAnalyzing,
  onVentureChange,
  onAnalysisTypeChange,
  onCustomPromptChange,
  onStartAnalysis,
}: QuickAnalysisFormProps) {
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="analysis-venture"
              className="mb-2 block text-sm font-medium"
            >
              Select Venture
            </label>
            <Select value={selectedVenture} onValueChange={onVentureChange}>
              <SelectTrigger id="analysis-venture" className="w-full">
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
              htmlFor="analysis-type"
              className="mb-2 block text-sm font-medium"
            >
              Analysis Type
            </label>
            <Select
              value={selectedAnalysisType}
              onValueChange={onAnalysisTypeChange}
            >
              <SelectTrigger id="analysis-type" className="w-full">
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
              onClick={onStartAnalysis}
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
            htmlFor="analysis-prompt"
            className="mb-2 block text-sm font-medium"
          >
            Custom Prompt (Optional)
          </label>
          <Textarea
            id="analysis-prompt"
            placeholder="Add specific questions or focus areas for the analysis..."
            value={customPrompt}
            onChange={(event) => onCustomPromptChange(event.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
