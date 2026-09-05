"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fund } from "../types/fund-management"
import { DollarSign } from "lucide-react"

interface FundDetailDialogProps {
  fund: Fund | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FundDetailDialog({ fund, open, onOpenChange }: Readonly<FundDetailDialogProps>) {
  if (!fund) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "fundraising":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "winding_down":
        return "bg-orange-100 text-orange-800"
      case "liquidated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{fund.name}</DialogTitle>
          <DialogDescription className="flex gap-2 flex-wrap pt-2">
            <Badge variant="default">{fund.vintage} Vintage</Badge>
            <Badge className={getStatusColor(fund.status)}>
              {fund.status.replaceAll("_", " ")}
            </Badge>
            <Badge variant="outline">{fund.fundType}</Badge>
            <Badge variant="outline">{fund.geography}</Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capital">Capital</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Fund Size</p>
                      <p className="text-lg font-semibold">{fund.size}</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">AUM</p>
                    <p className="text-lg font-semibold">{fund.aum}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">IRR</p>
                    <p className="text-lg font-semibold text-green-600">{fund.irr.toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">TVPI</p>
                    <p className="text-lg font-semibold">{fund.tvpi.toFixed(2)}x</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <h3 className="font-semibold">Fund Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fund Manager</span>
                      <span className="font-medium">{fund.fundManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vintage Year</span>
                      <span className="font-medium">{fund.vintage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Geography</span>
                      <span className="font-medium">{fund.geography}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment Period</span>
                      <span className="font-medium">{fund.investmentPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fund Term</span>
                      <span className="font-medium">{fund.fundTerm}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 pt-6">
                  <h3 className="font-semibold">Institutional Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Management Fee</span>
                      <span className="font-medium">{fund.managementFee}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carried Interest</span>
                      <span className="font-medium">{fund.carriedInterest}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hurdle Rate</span>
                      <span className="font-medium">{fund.hurdle}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Benchmark</span>
                      <span className="font-medium text-xs">{fund.benchmark}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ESG</span>
                      <span className="font-medium">{fund.esg ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sector Focus */}
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold">Sector Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {fund.sector.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capital Tab */}
          <TabsContent value="capital" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <h3 className="font-semibold">Capital Flow</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Committed Capital</span>
                      <span className="font-medium">{fund.committedCapital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Called Capital</span>
                      <span className="font-medium">{fund.calledCapital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distributed Capital</span>
                      <span className="font-medium">{fund.distributedCapital}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground">Net Asset Value</span>
                      <span className="font-medium text-lg">{fund.netAssetValue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 pt-6">
                  <h3 className="font-semibold">Performance Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DPI (Distributed)</span>
                      <span className="font-medium">{fund.dpi.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MOIC (Multiple)</span>
                      <span className="font-medium">{fund.moic.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dry Powder</span>
                      <span className="font-medium">{fund.dryPowder}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground">Leverage</span>
                      <span className="font-medium">{fund.leverage}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-4">
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold">Service Providers</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fund Administrator</span>
                    <span className="font-medium">{fund.fundAdmin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auditor</span>
                    <span className="font-medium">{fund.auditor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Legal Counsel</span>
                    <span className="font-medium">{fund.legalCounsel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prime Broker</span>
                    <span className="font-medium">{fund.primeBroker}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold">Compliance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regulatory Status</span>
                    <Badge variant="outline">{fund.regulatoryStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LPs Count</span>
                    <span className="font-medium">{fund.lps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investments</span>
                    <span className="font-medium">{fund.investments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{fund.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
