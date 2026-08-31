import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { REPORT_SECTION_OPTIONS } from "../../constants/due-diligence.constants"
import type { ReportSections, ReportType } from "../../types/due-diligence.types"

interface ReportConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedReportType: string
  selectedVenture: string
  setSelectedVenture: (venture: string) => void
  reportFormat: string
  setReportFormat: (format: string) => void
  reportSections: ReportSections
  setReportSections: (sections: ReportSections | ((previous: ReportSections) => ReportSections)) => void
  onGenerateReport: () => void
}

function getSectionDescription(sectionId: string): string {
  switch (sectionId) {
    case "executive_summary": return "High-level overview and key findings"
    case "financial_health": return "Revenue, burn rate, unit economics analysis"
    case "gedsi_financial": return "GEDSI impact on financial performance"
    case "investment_readiness": return "Readiness for investment assessment"
    case "risk_assessment": return "Comprehensive risk analysis"
    case "recommendations": return "Investment recommendations and next steps"
    case "iris_metrics": return "IRIS+ standards alignment analysis"
    case "benchmarking": return "Industry and peer comparisons"
    case "scenario_analysis": return "Multiple scenario projections"
    case "corporate_structure": return "Legal entity and governance structure"
    case "compliance_status": return "Regulatory compliance assessment"
    case "intellectual_property": return "IP portfolio and protection analysis"
    case "gedsi_legal": return "GEDSI policies and legal framework"
    case "contracts": return "Contract review and analysis"
    case "legal_risks": return "Legal risk identification and mitigation"
    case "technology_architecture": return "Tech stack and architecture review"
    case "security_assessment": return "Security posture and vulnerabilities"
    case "accessibility_inclusion": return "Digital accessibility compliance"
    case "development_practices": return "Code quality and development processes"
    case "scalability_analysis": return "Technical scalability assessment"
    case "technical_team": return "Technical team capabilities review"
    case "technology_risks": return "Technology-related risk analysis"
    case "market_opportunity": return "TAM/SAM/SOM and market size analysis"
    case "competitive_landscape": return "Competitor analysis and positioning"
    case "gedsi_market": return "GEDSI market opportunity analysis"
    case "customer_analysis": return "Customer segments and behavior analysis"
    case "geographic_expansion": return "Market expansion strategy and potential"
    case "market_risks": return "Market-related risk assessment"
    default: return ""
  }
}

export function ReportConfigDialog({
  open,
  onOpenChange,
  selectedReportType,
  selectedVenture,
  setSelectedVenture,
  reportFormat,
  setReportFormat,
  reportSections,
  setReportSections,
  onGenerateReport
}: ReportConfigDialogProps) {
  const reportTypeOptions = REPORT_SECTION_OPTIONS[selectedReportType as ReportType]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Customize {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report
          </DialogTitle>
          <DialogDescription>
            Select the sections and options for your due diligence report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Venture Scope</label>
              <Select value={selectedVenture} onValueChange={setSelectedVenture}>
                <SelectTrigger>
                  <SelectValue placeholder="Select venture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ventures</SelectItem>
                  <SelectItem value="EcoTech Solutions">EcoTech Solutions</SelectItem>
                  <SelectItem value="InclusiveFinance Pro">InclusiveFinance Pro</SelectItem>
                  <SelectItem value="AgriTech Innovations">AgriTech Innovations</SelectItem>
                  <SelectItem value="HealthAccess Network">HealthAccess Network</SelectItem>
                  <SelectItem value="EduBridge Platform">EduBridge Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Format</label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="txt">Text File</SelectItem>
                  <SelectItem value="docx">Word Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Sections</CardTitle>
              <CardDescription>
                Select which sections to include in your {selectedReportType} report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Select All</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allSections: ReportSections = {}
                      reportTypeOptions?.forEach((section) => {
                        allSections[section.id] = true
                      })
                      setReportSections(allSections)
                    }}
                  >
                    Select All
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {reportTypeOptions?.map((section) => (
                    <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={reportSections[section.id] || false}
                        onCheckedChange={(checked) => {
                          setReportSections((prev) => ({
                            ...prev,
                            [section.id]: checked as boolean
                          }))
                        }}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{section.label}</span>
                          {section.default && (
                            <Badge variant="secondary" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getSectionDescription(section.id)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">Report Type:</span>
                  <Badge variant="outline">{selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)}</Badge>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">Venture Scope:</span>
                  <span className="text-sm font-medium">{selectedVenture === "all" ? "All Ventures" : selectedVenture}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">Format:</span>
                  <span className="text-sm font-medium">{reportFormat.toUpperCase()}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">Sections Selected:</span>
                  <span className="text-sm font-medium">
                    {Object.values(reportSections).filter(Boolean).length} of {reportTypeOptions?.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={onGenerateReport}
              disabled={Object.values(reportSections).filter(Boolean).length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
