import { Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileAIAnalysisHeader() {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-[#138075]/15 bg-white shadow-sm"
      aria-labelledby="mobile-ai-analysis-title"
    >
      <div className="h-1.5 bg-[#138075]" />
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#138075]">
          Analytics &amp; Insights
            </p>
            <h1
              id="mobile-ai-analysis-title"
              className="text-2xl font-bold tracking-tight text-slate-950"
            >
              AI Analysis
            </h1>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2A9D8F]/15 text-[#138075]">
            <Brain className="h-5 w-5" />
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Generate venture insights and review investment risk from your phone.
        </p>
        <Button
          type="button"
          className="h-11 w-full gap-2 rounded-xl bg-[#138075] text-white shadow-sm hover:bg-[#0f6a62]"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Analysis</span>
        </Button>
      </div>
    </section>
  )
}
