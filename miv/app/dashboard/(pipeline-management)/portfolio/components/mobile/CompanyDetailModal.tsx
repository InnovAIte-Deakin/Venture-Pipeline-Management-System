"use client"

import { X } from "lucide-react"
import type { PortfolioCompany } from "../../types"
import { getStatusStyle } from "./statusStyles"

interface CompanyDetailModalProps {
  company: PortfolioCompany
  onClose: () => void
  onTakeAction: (company: PortfolioCompany) => void
}

const sectionLabel = "text-[11px] font-medium text-[#888780] tracking-wide uppercase mb-2"
const sectionCard = "bg-white border border-[#E5E4DE] rounded-xl p-3.5"
const rowLabel = "text-xs text-[#5F5E5A]"
const rowValue = "text-xs font-medium text-[#2C2C2A]"
const statLabel = "text-[11px] text-[#888780]"
const statValue = "text-[15px] font-medium text-[#2C2C2A]"

export function CompanyDetailModal({ company, onClose, onTakeAction }: CompanyDetailModalProps) {
  const status = getStatusStyle(company.status)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#FAFAF8] rounded-t-2xl w-full max-w-md max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5E4DE] bg-[#FAFAF8] sticky top-0">
          <div>
            <div className="text-base font-medium text-[#2C2C2A]">{company.name}</div>
            <div className="text-xs text-[#5F5E5A]">{company.location} · {company.sector}</div>
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

        <div className="p-4 space-y-3.5">
          {company.aiInsights?.priority === "urgent" && (
            <div className="rounded-xl border border-[#F3C9C9] bg-[#FCEEEE] p-3.5">
              <div className="text-xs font-medium text-[#B4232C] mb-1">Urgent Action Required</div>
              <div className="text-xs text-[#5F5E5A] mb-3">{company.aiInsights?.nextAction}</div>
              <button
                type="button"
                onClick={() => onTakeAction(company)}
                className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#0F6E56] text-[#E1F5EE]"
              >
                Take Action Now
              </button>
            </div>
          )}

          <div>
            <div className={sectionLabel}>Company Information</div>
            <div className={sectionCard + " space-y-2"}>
              <div className="flex justify-between"><span className={rowLabel}>Sector</span><span className={rowValue}>{company.sector}</span></div>
              <div className="flex justify-between"><span className={rowLabel}>Stage</span><span className={rowValue}>{company.stage}</span></div>
              <div className="flex justify-between items-center">
                <span className={rowLabel}>Status</span>
                <span
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: status.bg, color: status.text }}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex justify-between"><span className={rowLabel}>Location</span><span className={rowValue}>{company.location}</span></div>
            </div>
          </div>

          <div>
            <div className={sectionLabel}>Impact Performance</div>
            <div className={sectionCard}>
              <div className="grid grid-cols-2 gap-4">
                <div><div className={statLabel}>GEDSI score</div><div className={statValue}>{company.gedsiScore?.toFixed(0) ?? 'N/A'}%</div></div>
                <div><div className={statLabel}>Impact score</div><div className={statValue}>{company.impactScore?.toFixed(0) ?? 'N/A'}%</div></div>
                <div><div className={statLabel}>GEDSI metrics</div><div className={statValue}>{company.gedsiMetrics?.length || 0}</div></div>
                <div><div className={statLabel}>Readiness</div><div className={statValue}>{company.readinessScore?.toFixed(0) ?? 'N/A'}%</div></div>
              </div>
            </div>
          </div>

          <div>
            <div className={sectionLabel}>Activity Summary</div>
            <div className={sectionCard}>
              <div className="grid grid-cols-2 gap-4">
                <div><div className={statLabel}>Documents</div><div className={statValue}>{company._count?.documents || 0}</div></div>
                <div><div className={statLabel}>Activities</div><div className={statValue}>{company._count?.activities || 0}</div></div>
                <div><div className={statLabel}>Capital activities</div><div className={statValue}>{company._count?.capitalActivities || 0}</div></div>
                <div><div className={statLabel}>Created</div><div className={statValue}>{new Date(company.createdAt).toLocaleDateString()}</div></div>
              </div>
            </div>
          </div>

          <div>
            <div className={sectionLabel}>GEDSI Metrics</div>
            {company.gedsiMetrics && company.gedsiMetrics.length > 0 ? (
              <div className="space-y-2">
                {company.gedsiMetrics.slice(0, 6).map((metric: any, index: number) => (
                  <div key={index} className={sectionCard + " flex items-center justify-between"}>
                    <div>
                      <div className="text-xs font-medium text-[#2C2C2A]">{metric.code || `Metric ${index + 1}`}</div>
                      <div className="text-[11px] text-[#888780]">{metric.category || 'GEDSI'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#2C2C2A]">{metric.currentValue || 'N/A'}</div>
                      <div className="text-[11px] text-[#888780]">{metric.unit || ''}</div>
                    </div>
                  </div>
                ))}
                {company.gedsiMetrics.length > 6 && (
                  <div className="text-center text-xs text-[#888780]">+{company.gedsiMetrics.length - 6} more metrics</div>
                )}
              </div>
            ) : (
              <div className={sectionCard + " text-center py-6"}>
                <p className="text-xs text-[#5F5E5A]">No GEDSI metrics recorded yet</p>
              </div>
            )}
          </div>

          {company.aiInsights && (
            <div>
              <div className={sectionLabel}>AI Insights</div>
              <div className={sectionCard + " space-y-2"}>
                <p className="text-xs text-[#2C2C2A]">{company.aiInsights.nextAction}</p>
                {company.aiInsights.alerts && company.aiInsights.alerts.length > 0 && (
                  <ul className="space-y-1 pt-1 border-t border-[#E5E4DE]">
                    {company.aiInsights.alerts.map((alert, index) => (
                      <li key={index} className="text-xs text-[#5F5E5A]">• {alert}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
