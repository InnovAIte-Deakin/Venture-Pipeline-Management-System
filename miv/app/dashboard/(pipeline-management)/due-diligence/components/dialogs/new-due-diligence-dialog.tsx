import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface NewDueDiligenceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
}

export function NewDueDiligenceDialog({ open, onOpenChange, categories }: NewDueDiligenceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Due Diligence Process
          </DialogTitle>
          <DialogDescription>
            Set up a new due diligence process for a venture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EcoTech Solutions">EcoTech Solutions</SelectItem>
                      <SelectItem value="InclusiveFinance Pro">InclusiveFinance Pro</SelectItem>
                      <SelectItem value="AgriTech Innovations">AgriTech Innovations</SelectItem>
                      <SelectItem value="HealthAccess Network">HealthAccess Network</SelectItem>
                      <SelectItem value="EduBridge Platform">EduBridge Platform</SelectItem>
                      <SelectItem value="new">+ Add New Venture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Diligence Type *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Due Diligence</SelectItem>
                      <SelectItem value="financial">Financial Only</SelectItem>
                      <SelectItem value="legal">Legal Only</SelectItem>
                      <SelectItem value="technical">Technical Only</SelectItem>
                      <SelectItem value="market">Market Only</SelectItem>
                      <SelectItem value="custom">Custom Scope</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lead Analyst *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign lead analyst" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson (Financial)</SelectItem>
                      <SelectItem value="mike">Mike Chen (Legal)</SelectItem>
                      <SelectItem value="david">David Smith (Technical)</SelectItem>
                      <SelectItem value="lisa">Lisa Wang (Market)</SelectItem>
                      <SelectItem value="alex">Alex Rodriguez (Operations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Completion Date *</label>
                  <Input type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Due Diligence Categories</CardTitle>
              <CardDescription>
                Select which categories to include in this due diligence process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox className="mt-0.5" defaultChecked={category !== "Operations"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{category}</span>
                        {(category === "Financial" || category === "Legal") && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category === "Financial" && "Revenue model, financial health, projections, GEDSI financial impact"}
                        {category === "Legal" && "Corporate structure, compliance, IP, contracts, GEDSI policies"}
                        {category === "Technical" && "Architecture, security, scalability, accessibility compliance"}
                        {category === "Market" && "Market size, competition, customer analysis, GEDSI market opportunity"}
                        {category === "Team" && "Team assessment, diversity, leadership capabilities"}
                        {category === "Operations" && "Operational processes, efficiency, scaling capabilities"}
                        {category === "Compliance" && "Regulatory compliance, ESG standards, IRIS+ alignment"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority Level *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 Week</SelectItem>
                      <SelectItem value="2weeks">2 Weeks</SelectItem>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="2months">2 Months</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Investment Stage</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GEDSI Focus Areas</CardTitle>
              <CardDescription>
                Specify GEDSI aspects to emphasize in this due diligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <label className="text-sm">Gender diversity in leadership</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <label className="text-sm">Disability inclusion practices</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <label className="text-sm">Social inclusion initiatives</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <label className="text-sm">Rural community focus</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <label className="text-sm">Youth employment creation</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <label className="text-sm">Indigenous community support</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Requirements</label>
                  <Textarea
                    placeholder="Any specific requirements, focus areas, or instructions for the due diligence team..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Stakeholders to Interview</label>
                  <Input placeholder="e.g., CEO, CTO, Head of Impact, Board Members" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled>
              Create Due Diligence Process (Demo)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
