import { Activity, Briefcase, Download, FileText, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { CapitalCall, Distribution, Fund, LimitedPartner } from "../types/fund-management"

interface FundManagementHeaderProps {
  loading: boolean
  onRefresh: () => void
  capitalCalls: CapitalCall[]
  distributions: Distribution[]
  limitedPartners: LimitedPartner[]
  funds: Fund[]
  isWorkflowStatusOpen: boolean
  setIsWorkflowStatusOpen: (value: boolean) => void
  isLaunchFundOpen: boolean
  setIsLaunchFundOpen: (value: boolean) => void
}

export function FundManagementHeader({
  loading,
  onRefresh,
  capitalCalls,
  distributions,
  limitedPartners,
  funds,
  isWorkflowStatusOpen,
  setIsWorkflowStatusOpen,
  isLaunchFundOpen,
  setIsLaunchFundOpen,
}: FundManagementHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fund Operations</h1>
        <p className="text-muted-foreground">End-to-end fund lifecycle and operational workflow management</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Dialog open={isWorkflowStatusOpen} onOpenChange={setIsWorkflowStatusOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              Workflow Status
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fund Operations Workflow Status</DialogTitle>
              <DialogDescription>Current status of all operational workflows and processes</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Active Workflows</h4>
                  {[
                    {
                      name: "Capital Call Processing",
                      status: capitalCalls.filter((call) => call.status === "pending" || call.status === "in_progress").length > 0 ? "active" : "idle",
                      count: capitalCalls.filter((call) => call.status === "pending" || call.status === "in_progress").length,
                    },
                    {
                      name: "LP Onboarding",
                      status: limitedPartners.filter((lp) => lp.status === "active" || lp.kycStatus === "pending").length > 0 ? "active" : "idle",
                      count: limitedPartners.filter((lp) => lp.status === "active" || lp.kycStatus === "pending").length,
                    },
                    {
                      name: "Distribution Processing",
                      status: distributions.filter((distribution) => distribution.status === "pending" || distribution.status === "processing").length > 0 ? "active" : "idle",
                      count: distributions.filter((distribution) => distribution.status === "pending" || distribution.status === "processing").length,
                    },
                    {
                      name: "Compliance Reviews",
                      status: funds.filter((fund) => fund.regulatoryStatus === "UNDER_REVIEW").length > 0 ? "active" : "scheduled",
                      count: funds.filter((fund) => fund.regulatoryStatus === "UNDER_REVIEW" || !fund.regulatoryStatus).length,
                    },
                  ].map((workflow) => (
                    <div key={workflow.name} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">{workflow.count} items</div>
                      </div>
                      <Badge variant={workflow.status === "active" ? "default" : "secondary"} className={workflow.status === "active" ? "bg-green-100 text-green-800" : ""}>
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">System Status</h4>
                  {[
                    { system: "Database", status: "operational", health: "100%" },
                    { system: "API Services", status: "operational", health: "100%" },
                    { system: "Email System", status: "operational", health: "98%" },
                    { system: "Document Storage", status: "operational", health: "100%" },
                  ].map((system) => (
                    <div key={system.system} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{system.system}</div>
                        <div className="text-sm text-muted-foreground">Health: {system.health}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm text-green-600">{system.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Updating..." : "Refresh"}
        </Button>

        <Dialog open={isLaunchFundOpen} onOpenChange={setIsLaunchFundOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Launch Fund
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Launch New Fund</DialogTitle>
              <DialogDescription>Set up a new fund with complete operational parameters and LP onboarding</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Fund Setup Checklist</h4>
                  {[
                    { task: "Legal Structure Formation", completed: false, required: true },
                    { task: "Regulatory Registration", completed: false, required: true },
                    { task: "Service Provider Selection", completed: false, required: true },
                    { task: "Fund Documentation", completed: false, required: true },
                    { task: "LP Prospect List", completed: false, required: false },
                    { task: "Marketing Materials", completed: false, required: false },
                  ].map((item, index) => (
                    <div key={`${item.task}-${index}`} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full ${item.completed ? "bg-green-500" : "bg-gray-300"}`} />
                        <div>
                          <span className="text-sm">{item.task}</span>
                          {item.required && <span className="ml-1 text-red-500">*</span>}
                        </div>
                      </div>
                      <Badge variant={item.completed ? "default" : "outline"}>{item.completed ? "Complete" : "Pending"}</Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Fund Parameters</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Target Size:</span>
                      <span className="font-medium">$100M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fund Type:</span>
                      <span className="font-medium">Growth Equity</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geography:</span>
                      <span className="font-medium">Asia Pacific</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-medium">5 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Management Fee:</span>
                      <span className="font-medium">2.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carried Interest:</span>
                      <span className="font-medium">20%</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Begin Fund Setup
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
