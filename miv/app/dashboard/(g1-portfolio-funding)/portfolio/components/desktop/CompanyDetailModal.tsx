"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell, Sparkles, Target, X } from "lucide-react"
import type { PortfolioCompany } from "../../types"

interface CompanyDetailModalProps {
  company: PortfolioCompany
  onClose: () => void
  onTakeAction: (company: PortfolioCompany) => void
}

export function CompanyDetailModal({ company, onClose, onTakeAction }: CompanyDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{company.name}</h2>
              <p className="text-muted-foreground">{company.location} • {company.sector}</p>
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

        <div className="p-6 space-y-6">
          {/* Action Required Section */}
          {company.aiInsights?.priority === "urgent" && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Urgent Action Required:</strong> {company.aiInsights?.nextAction}
                <Button size="sm" className="ml-3" onClick={() => onTakeAction(company)}>
                  Take Action Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Key Metrics Dashboard */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sector:</span>
                  <Badge variant="outline">{company.sector}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stage:</span>
                  <Badge variant="outline">{company.stage}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline">{company.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-medium">{company.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Impact Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">GEDSI Score:</span>
                  <span className="font-bold text-pink-600">{company.gedsiScore?.toFixed(0) || 'N/A'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Impact Score:</span>
                  <span className="font-bold text-green-600">{company.impactScore?.toFixed(0) || 'N/A'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">GEDSI Metrics:</span>
                  <span className="font-medium">{company.gedsiMetrics?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Readiness Score:</span>
                  <span className="font-medium">{company.readinessScore?.toFixed(0) || 'N/A'}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Documents:</span>
                  <span className="font-medium">{company._count?.documents || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Activities:</span>
                  <span className="font-medium">{company._count?.activities || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capital Activities:</span>
                  <span className="font-medium">{company._count?.capitalActivities || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="font-medium">{new Date(company.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GEDSI Metrics Detail */}
          <Card>
            <CardHeader>
              <CardTitle>GEDSI Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {company.gedsiMetrics && company.gedsiMetrics.length > 0 ? (
                <div className="space-y-3">
                  {company.gedsiMetrics.slice(0, 6).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{metric.code || `Metric ${index + 1}`}</div>
                        <div className="text-sm text-muted-foreground">{metric.category || 'GEDSI'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{metric.currentValue || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{metric.unit || ''}</div>
                      </div>
                    </div>
                  ))}
                  {company.gedsiMetrics.length > 6 && (
                    <div className="text-center text-sm text-muted-foreground">
                      +{company.gedsiMetrics.length - 6} more metrics
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No GEDSI metrics recorded yet</p>
                  <Button size="sm" className="mt-2">Add GEDSI Metrics</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          {company.aiInsights && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  AI Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    {company.aiInsights.nextAction}
                  </AlertDescription>
                </Alert>

                {company.aiInsights.alerts && company.aiInsights.alerts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1 text-orange-600">
                      <Bell className="h-4 w-4" />
                      Active Alerts
                    </h4>
                    <ul className="space-y-1">
                      {company.aiInsights.alerts.map((alert, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
