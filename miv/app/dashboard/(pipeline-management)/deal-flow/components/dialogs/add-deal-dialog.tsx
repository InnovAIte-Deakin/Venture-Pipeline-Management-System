import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FOUNDER_TYPES, SECTORS, DEAL_STAGES } from "../../constants/deal-flow.constants"
import { AlertCircle, Plus } from "lucide-react"

interface AddDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDealDialog({ open, onOpenChange }: AddDealDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add New Deal
          </DialogTitle>
          <DialogDescription>Create a new venture deal in the pipeline</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This form demonstrates the add new deal functionality. In the full version, this would
              create a new deal record in the database.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput id="new-company" label="Company Name *" placeholder="Enter company name" />
                <FormInput id="new-deal-size" label="Deal Size *" placeholder="e.g., $2.5M" />
                <FormSelect id="new-sector" label="Sector *" placeholder="Select sector" options={SECTORS} />
                <FormInput id="new-location" label="Location *" placeholder="City, Country" />
                <FormSelect id="new-stage" label="Stage *" placeholder="Select stage" options={DEAL_STAGES} />
                <FormInput id="new-close" label="Expected Close Date" type="date" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GEDSI & Impact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInput id="new-inclusion" label="Inclusion Focus *" placeholder="Describe the venture's inclusion focus" />
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Founder Types</legend>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {FOUNDER_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`new-founder-${type}`} />
                      <Label htmlFor={`new-founder-${type}`} className="text-sm">
                        {type.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput id="new-gedsi" label="GEDSI Score (%)" type="number" placeholder="0-100" />
                <FormInput id="new-impact" label="Impact Score (%)" type="number" placeholder="0-100" />
                <FormInput id="new-readiness" label="Readiness Score (%)" type="number" placeholder="0-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expected Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormInput id="new-jobs" label="Jobs to be Created" type="number" placeholder="Number of jobs" />
              <FormInput id="new-communities" label="Communities to Serve" type="number" placeholder="Number of communities" />
              <FormInput id="new-women" label="Women Leadership (%)" type="number" placeholder="0-100" />
              <FormSelect id="new-disability" label="Disability Inclusive" placeholder="Select option" options={["Yes", "No"]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormInput id="new-team" label="Team Members" placeholder="Enter team member names (comma separated)" />
              <p className="mt-2 text-xs text-muted-foreground">Enter names separated by commas, e.g., "John Doe, Jane Smith, Alex Johnson"</p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled>Create Deal (Demo)</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FormInput({ id, label, type = "text", placeholder }: { id: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} min={type === "number" ? "0" : undefined} max={type === "number" ? "100" : undefined} />
    </div>
  )
}

function FormSelect({ id, label, placeholder, options }: { id: string; label: string; placeholder: string; options: readonly string[] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
