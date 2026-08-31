"use client"

import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  DollarSign,
  Download,
  Eye,
  MessageSquare,
  Target,
  X,
  Zap,
} from "lucide-react"
import type { PortfolioCompany } from "../../types"

interface ActionDialogProps {
  company: PortfolioCompany
  onClose: () => void
  onExecuteAction: (actionType: string, company: PortfolioCompany) => void
}

export function ActionDialog({ company, onClose, onExecuteAction }: ActionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Take Action: {company.name}</h2>
              <p className="text-sm text-muted-foreground">
                {company.aiInsights?.nextAction || "Choose an action to help this company"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Priority Actions based on AI Insights */}
          {company.aiInsights?.priority === "urgent" && (
            <div className="mb-6">
              <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgent Actions Required
              </h3>
              <div className="grid gap-2">
                {company.aiInsights?.alerts?.map((alert, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-4 border-red-200"
                    onClick={() => onExecuteAction(`Resolve: ${alert}`, company)}
                  >
                    <div>
                      <div className="font-medium">Resolve: {alert}</div>
                      <div className="text-xs text-muted-foreground">Click to schedule resolution</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Actions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Available Actions
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* GEDSI Actions */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Update GEDSI Metrics", company)}
              >
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Update GEDSI Metrics</div>
                    <div className="text-xs text-muted-foreground">
                      Current: {company.gedsiMetrics?.length || 0} metrics
                    </div>
                  </div>
                </div>
              </Button>

              {/* Schedule Review */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Schedule Board Review", company)}
              >
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Schedule Board Review</div>
                    <div className="text-xs text-muted-foreground">
                      Plan next quarterly review
                    </div>
                  </div>
                </div>
              </Button>

              {/* Request Documents */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Request Updated Documents", company)}
              >
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Request Documents</div>
                    <div className="text-xs text-muted-foreground">
                      Financial statements, metrics
                    </div>
                  </div>
                </div>
              </Button>

              {/* Send Notification */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Send Follow-up Notification", company)}
              >
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Send Notification</div>
                    <div className="text-xs text-muted-foreground">
                      Follow-up on pending items
                    </div>
                  </div>
                </div>
              </Button>

              {/* Impact Assessment */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Conduct Impact Assessment", company)}
              >
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Impact Assessment</div>
                    <div className="text-xs text-muted-foreground">
                      Evaluate social impact metrics
                    </div>
                  </div>
                </div>
              </Button>

              {/* Funding Support */}
              <Button
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => onExecuteAction("Provide Funding Support", company)}
              >
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Funding Support</div>
                    <div className="text-xs text-muted-foreground">
                      Connect with investors
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExecuteAction("Add to Watch List", company)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Add to Watch List
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExecuteAction("Mark as High Priority", company)}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                High Priority
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExecuteAction("Schedule Call", company)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
