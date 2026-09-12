import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SECTORS, DEAL_STAGES } from "../../constants/deal-flow.constants"
import { AlertCircle, Edit } from "lucide-react"
import type { Deal } from "../../types/deal-flow.types"

interface DealEditorDialogProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealEditorDialog({ deal, open, onOpenChange }: DealEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" aria-hidden="true" />
            Edit {deal?.company || "Deal"}
          </DialogTitle>
          <DialogDescription>Update venture information and metrics</DialogDescription>
        </DialogHeader>

        {deal && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription>
                <strong>Demo Mode:</strong> This is a read-only demo. In the full version, you would be able to edit venture details,
                update scores, change stages, and modify team information.
              </AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-2">
              <DisabledInput id="edit-company" label="Company Name" value={deal.company} />
              <div className="space-y-2">
                <Label htmlFor="edit-stage">Stage</Label>
                <Select value={deal.stage} disabled>
                  <SelectTrigger id="edit-stage" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sector">Sector</Label>
                <Select value={deal.sector} disabled>
                  <SelectTrigger id="edit-sector" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DisabledInput id="edit-deal-size" label="Deal Size" value={deal.dealSize} />
              <DisabledInput id="edit-gedsi" label="GEDSI Score (%)" value={String(deal.gedsiScore)} />
              <DisabledInput id="edit-impact" label="Impact Score (%)" value={String(deal.impactScore)} />
            </div>
            <DisabledInput id="edit-inclusion" label="Inclusion Focus" value={deal.inclusionFocus} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled>Save Changes (Demo)</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DisabledInput({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} disabled />
    </div>
  )
}
