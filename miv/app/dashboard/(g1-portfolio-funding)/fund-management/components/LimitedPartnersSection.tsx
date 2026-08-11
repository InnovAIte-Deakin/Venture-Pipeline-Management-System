import { FileText, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { LimitedPartner } from "../types/fund-management"

interface LimitedPartnersSectionProps {
  limitedPartners: LimitedPartner[]
  onSelectLimitedPartner: (limitedPartner: LimitedPartner) => void
}

export function LimitedPartnersSection({ limitedPartners, onSelectLimitedPartner }: LimitedPartnersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limited Partners</CardTitle>
        <CardDescription>Manage investor relationships and communications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {limitedPartners.slice(0, 4).map((partner) => (
            <div key={partner.id} className="flex flex-col gap-3 rounded-lg border p-4 hover:bg-muted/50 md:flex-row md:items-center md:justify-between" onClick={() => onSelectLimitedPartner(partner)}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
                  {partner.name ? partner.name.split(" ").map((part) => part[0]).join("").substring(0, 2) : "LP"}
                </div>
                <div>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-sm text-muted-foreground">{partner.type.replace("_", " ")} • {partner.country}</div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="font-medium">{partner.commitment}</div>
                <div className="text-sm text-muted-foreground">{partner.irr.toFixed(1)}% IRR</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-medium">LP Performance Analysis</h3>
          <ScrollArea className="h-[400px]">
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Limited Partner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Commitment</TableHead>
                    <TableHead>Called</TableHead>
                    <TableHead>Distributed</TableHead>
                    <TableHead>NAV</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>TVPI</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limitedPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                            {partner.name ? partner.name.split(" ").map((part) => part[0]).join("").substring(0, 2) : "LP"}
                          </div>
                          <div>
                            <div className="font-medium">{partner.name}</div>
                            <div className="text-sm text-muted-foreground">{partner.country}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{partner.type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{partner.commitment}</TableCell>
                      <TableCell>{partner.called}</TableCell>
                      <TableCell>{partner.distributed}</TableCell>
                      <TableCell>{partner.nav}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${partner.irr > 15 ? "text-green-600" : "text-yellow-600"}`}>{partner.irr.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{partner.tvpi.toFixed(2)}x</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={partner.kycStatus === "approved" ? "default" : "secondary"} className={partner.kycStatus === "approved" ? "bg-green-100 text-green-800" : ""}>
                          {partner.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onSelectLimitedPartner(partner)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
