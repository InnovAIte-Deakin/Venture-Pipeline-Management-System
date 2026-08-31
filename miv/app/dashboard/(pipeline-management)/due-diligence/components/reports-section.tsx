import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Download, FileText, Shield, TrendingUp } from "lucide-react"

interface ReportsSectionProps {
  generatingReport: string | null
  openReportConfig: (reportType: string) => void
}

export function ReportsSection({ generatingReport, openReportConfig }: ReportsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Diligence Reports</CardTitle>
        <CardDescription>
          Generate and view due diligence reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => openReportConfig("financial")}
              disabled={generatingReport !== null}
            >
              {generatingReport === "financial" ? (
                <>
                  <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Financial Report</span>
                  <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => openReportConfig("legal")}
              disabled={generatingReport !== null}
            >
              {generatingReport === "legal" ? (
                <>
                  <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Shield className="h-8 w-8 mb-2" />
                  <span>Legal Report</span>
                  <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => openReportConfig("technical")}
              disabled={generatingReport !== null}
            >
              {generatingReport === "technical" ? (
                <>
                  <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Activity className="h-8 w-8 mb-2" />
                  <span>Technical Report</span>
                  <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => openReportConfig("market")}
              disabled={generatingReport !== null}
            >
              {generatingReport === "market" ? (
                <>
                  <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span>Market Report</span>
                  <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Report Generation
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Click any report button above to generate and download a comprehensive due diligence report.
              Each report includes GEDSI analysis, IRIS+ metrics alignment, and investment recommendations.
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <div>
                <strong>Financial Report:</strong> Revenue analysis, burn rate, unit economics, GEDSI financial impact
              </div>
              <div>
                <strong>Legal Report:</strong> Corporate structure, compliance status, IP analysis, GEDSI policies
              </div>
              <div>
                <strong>Technical Report:</strong> Architecture review, security assessment, accessibility compliance
              </div>
              <div>
                <strong>Market Report:</strong> Market opportunity, competitive analysis, GEDSI market potential
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
