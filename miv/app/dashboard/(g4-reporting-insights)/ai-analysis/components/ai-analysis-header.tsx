import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIAnalysisHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analysis</h1>
        <p className="text-muted-foreground">
          Leverage artificial intelligence for intelligent venture insights and
          risk assessment
        </p>
      </div>
      <Button type="button" className="w-full gap-2 sm:w-auto">
        <Brain className="h-4 w-4" />
        <span>New Analysis</span>
      </Button>
    </div>
  )
}
