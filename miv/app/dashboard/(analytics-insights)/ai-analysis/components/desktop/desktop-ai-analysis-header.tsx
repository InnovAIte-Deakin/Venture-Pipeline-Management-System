import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Desktop header intentionally preserves the existing wide-screen design. */
export function DesktopAIAnalysisHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analysis</h1>
        <p className="text-muted-foreground">
          Leverage artificial intelligence for intelligent venture insights and
          risk assessment
        </p>
      </div>
      <Button type="button" className="gap-2">
        <Brain className="h-4 w-4" />
        <span>New Analysis</span>
      </Button>
    </div>
  )
}
