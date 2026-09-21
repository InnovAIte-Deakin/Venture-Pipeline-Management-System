import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ScheduleFrequency } from "../../types/advanced-reports.types"
import { SCHEDULE_FREQUENCIES } from "../../constants/advanced-reports.constants"

interface ScheduleReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isScheduled: boolean
  onIsScheduledChange: (value: boolean) => void
  scheduleFrequency: ScheduleFrequency
  onScheduleFrequencyChange: (value: ScheduleFrequency) => void
  reportRecipients: string[]
  onReportRecipientsChange: (value: string[]) => void
}

/**
 * Relocates the original inline "Schedule automatic report generation"
 * checkbox + frequency + recipients fields into a dedicated dialog, shared
 * by desktop and mobile generators. Behaviour is unchanged and still
 * entirely client-local: `nextRun` is computed once at generation time
 * (`lib/report-scheduling.ts`) and never persisted server-side — there is no
 * backend scheduler/cron/queue behind this feature (see README "Report
 * Scheduling Workflow"). Fields are two-way bound directly to the report
 * builder's state, so there is nothing to discard; Cancel and Save both
 * simply close the dialog. No loading/error/success state is shown because
 * no asynchronous operation happens here.
 */
export function ScheduleReportDialog({
  open,
  onOpenChange,
  isScheduled,
  onIsScheduledChange,
  scheduleFrequency,
  onScheduleFrequencyChange,
  reportRecipients,
  onReportRecipientsChange,
}: ScheduleReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogDescription>
            Automatically regenerate this report on a recurring schedule. Scheduling is stored with the report locally only — it is not sent to a server-side scheduler.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="schedule-enabled" checked={isScheduled} onCheckedChange={(checked) => onIsScheduledChange(!!checked)} />
            <Label htmlFor="schedule-enabled" className="text-sm font-medium">
              Schedule automatic report generation
            </Label>
          </div>

          {isScheduled && (
            <div className="space-y-4 pl-6">
              <div>
                <Label htmlFor="schedule-frequency" className="mb-2 block text-sm font-medium text-gray-700">
                  Frequency
                </Label>
                <Select value={scheduleFrequency} onValueChange={(value) => onScheduleFrequencyChange(value as ScheduleFrequency)}>
                  <SelectTrigger id="schedule-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_FREQUENCIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule-recipients" className="mb-2 block text-sm font-medium text-gray-700">
                  Recipients (comma-separated emails)
                </Label>
                <Input
                  id="schedule-recipients"
                  placeholder="user1@example.com, user2@example.com"
                  value={reportRecipients.join(", ")}
                  onChange={(e) =>
                    onReportRecipientsChange(
                      e.target.value
                        .split(",")
                        .map((email) => email.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
