"use client"

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

const sectionLabel = "text-[11px] font-medium text-[#888780] tracking-wide uppercase mb-2"

const actions = [
  { icon: Target, iconColor: "#0F6E56", title: "Update GEDSI Metrics", subtitle: (c: PortfolioCompany) => `Current: ${c.gedsiMetrics?.length || 0} metrics`, type: "Update GEDSI Metrics" },
  { icon: Calendar, iconColor: "#2E6BB0", title: "Schedule Board Review", subtitle: () => "Plan next quarterly review", type: "Schedule Board Review" },
  { icon: Download, iconColor: "#3B6D11", title: "Request Documents", subtitle: () => "Financial statements, metrics", type: "Request Updated Documents" },
  { icon: Bell, iconColor: "#854F0B", title: "Send Notification", subtitle: () => "Follow-up on pending items", type: "Send Follow-up Notification" },
  { icon: BarChart3, iconColor: "#6B4FA0", title: "Impact Assessment", subtitle: () => "Evaluate social impact metrics", type: "Conduct Impact Assessment" },
  { icon: DollarSign, iconColor: "#0F6E56", title: "Funding Support", subtitle: () => "Connect with investors", type: "Provide Funding Support" },
]

const quickActions = [
  { icon: Eye, label: "Add to Watch List", type: "Add to Watch List" },
  { icon: AlertTriangle, label: "High Priority", type: "Mark as High Priority" },
  { icon: MessageSquare, label: "Schedule Call", type: "Schedule Call" },
]

export function ActionDialog({ company, onClose, onExecuteAction }: ActionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#FAFAF8] rounded-t-2xl w-full max-w-md max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5E4DE] bg-[#FAFAF8] sticky top-0">
          <div>
            <div className="text-base font-medium text-[#2C2C2A]">Take Action: {company.name}</div>
            <div className="text-xs text-[#5F5E5A]">
              {company.aiInsights?.nextAction || "Choose an action to help this company"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#5F5E5A]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {company.aiInsights?.priority === "urgent" && (
            <div>
              <div className={sectionLabel}>Urgent Actions Required</div>
              <div className="flex flex-col gap-2">
                {company.aiInsights?.alerts?.map((alert, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onExecuteAction(`Resolve: ${alert}`, company)}
                    className="text-left whitespace-normal rounded-xl border border-[#F3C9C9] bg-[#FCEEEE] p-3"
                  >
                    <div className="text-xs font-medium text-[#B4232C]">Resolve: {alert}</div>
                    <div className="text-[11px] text-[#5F5E5A]">Click to schedule resolution</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className={sectionLabel}>Available Actions</div>
            <div className="flex flex-col gap-2">
              {actions.map(({ icon: Icon, iconColor, title, subtitle, type }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onExecuteAction(type, company)}
                  className="flex items-start gap-3 text-left bg-white border border-[#E5E4DE] rounded-xl p-3.5"
                >
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: iconColor }} />
                  <div>
                    <div className="text-xs font-medium text-[#2C2C2A]">{title}</div>
                    <div className="text-[11px] text-[#888780]">{subtitle(company)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E4DE]">
            <div className="flex flex-wrap gap-2">
              {quickActions.map(({ icon: Icon, label, type }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onExecuteAction(type, company)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#9FE1CB] text-[#0F6E56]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
