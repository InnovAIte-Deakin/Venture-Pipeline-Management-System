"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin } from "lucide-react"
import { LimitedPartner } from "../types/fund-management"

interface LPDialogProps {
  open: boolean
  selectedLP: LimitedPartner | null
  onOpenChange: (open: boolean) => void
}

export function LPDialog({ open, selectedLP, onOpenChange }: Readonly<LPDialogProps>) {
  if (!selectedLP) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {selectedLP.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            {selectedLP.name}
          </DialogTitle>
          <DialogDescription>Limited partner details and performance</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Investment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Commitment:</span><span className="font-medium">{selectedLP.commitment}</span></div>
                <div className="flex justify-between"><span>Called:</span><span className="font-medium">{selectedLP.called}</span></div>
                <div className="flex justify-between"><span>Distributed:</span><span className="font-medium">{selectedLP.distributed}</span></div>
                <div className="flex justify-between"><span>Current NAV:</span><span className="font-medium">{selectedLP.nav}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span>IRR:</span><span className={`font-medium ${selectedLP.irr > 15 ? 'text-green-600' : 'text-yellow-600'}`}>{selectedLP.irr.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>TVPI:</span><span className="font-medium">{selectedLP.tvpi.toFixed(2)}x</span></div>
                <div className="flex justify-between"><span>DPI:</span><span className="font-medium">{selectedLP.dpi.toFixed(2)}x</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{selectedLP.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selectedLP.phone}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedLP.country}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Compliance Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>KYC Status:</span><Badge variant={selectedLP.kycStatus === 'approved' ? 'default' : 'secondary'}>{selectedLP.kycStatus}</Badge></div>
                <div className="flex justify-between"><span>Accredited:</span><Badge variant={selectedLP.accredited ? 'default' : 'secondary'}>{selectedLP.accredited ? 'Yes' : 'No'}</Badge></div>
                <div className="flex justify-between">
                  <span>Risk Rating:</span>
                  <Badge variant="outline" className={selectedLP.riskRating === 'low' ? 'text-green-600' : selectedLP.riskRating === 'high' ? 'text-red-600' : 'text-yellow-600'}>
                    {selectedLP.riskRating}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
