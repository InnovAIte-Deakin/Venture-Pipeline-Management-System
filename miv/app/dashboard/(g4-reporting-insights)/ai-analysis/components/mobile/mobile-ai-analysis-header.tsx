import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileAIAnalysisHeader() {
  return (
    <section className="space-y-4" aria-labelledby="mobile-ai-analysis-title">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Analytics &amp; Insights
        </p>
        <h1
          id="mobile-ai-analysis-title"
          className="text-2xl font-bold tracking-tight"
        >
          AI Analysis
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Generate venture insights and review investment risk from your phone.
        </p>
      </div>
      <Button type="button" className="h-11 w-full gap-2 rounded-xl">
        <Brain className="h-4 w-4" />
        <span>New Analysis</span>
      </Button>
    </section>
  )
}
