import { Mail, MapPin, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { LimitedPartner } from "../types/fund-management"

interface FundDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  limitedPartner: LimitedPartner | null
}

export function FundDetailsDialog({ open, onOpenChange, limitedPartner }: FundDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
              {limitedPartner?.name ? limitedPartner.name.split(" ").map((part) => part[0]).join("").substring(0, 2) : "LP"}
            </div>
            {limitedPartner?.name}
          </DialogTitle>
          <DialogDescription>Limited partner details and performance</DialogDescription>
        </DialogHeader>
        {limitedPartner && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="mb-3 font-medium">Investment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span>Commitment:</span>
                    <span className="font-medium">{limitedPartner.commitment}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Called:</span>
                    <span className="font-medium">{limitedPartner.called}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Distributed:</span>
                    <span className="font-medium">{limitedPartner.distributed}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Current NAV:</span>
                    <span className="font-medium">{limitedPartner.nav}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between gap-3">
                    <span>IRR:</span>
                    <span className={`font-medium ${limitedPartner.irr > 15 ? "text-green-600" : "text-yellow-600"}`}>{limitedPartner.irr.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>TVPI:</span>
                    <span className="font-medium">{limitedPartner.tvpi.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>DPI:</span>
                    <span className="font-medium">{limitedPartner.dpi.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-3 font-medium">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{limitedPartner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{limitedPartner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{limitedPartner.country}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium">Compliance Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span>KYC Status:</span>
                    <Badge variant={limitedPartner.kycStatus === "approved" ? "default" : "secondary"}>{limitedPartner.kycStatus}</Badge>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Accredited:</span>
                    <Badge variant={limitedPartner.accredited ? "default" : "secondary"}>{limitedPartner.accredited ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Risk Rating:</span>
                    <Badge variant="outline" className={limitedPartner.riskRating === "low" ? "text-green-600" : limitedPartner.riskRating === "medium" ? "text-yellow-600" : "text-red-600"}>
                      {limitedPartner.riskRating}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
