import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { Users, CheckCircle, Heart, Shield, Eye, Ear, Activity, Brain, MessageSquare } from 'lucide-react'

export function Step5AccessibilityDli({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
  <div className="space-y-8">

    {/* Washington Group Short Set */}
    <Card className="p-6 bg-linear-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-teal-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Activity aria-hidden="true" className="h-5 w-5 text-teal-500" />
          <Label className="font-semibold text-lg">Washington Group Short Set</Label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Identify functional difficulties to better design inclusive support
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'seeing', label: 'Seeing', icon: Eye },
            { key: 'hearing', label: 'Hearing', icon: Ear },
            { key: 'walking', label: 'Walking/Mobility', icon: Activity },
            { key: 'cognition', label: 'Remembering/Concentrating', icon: Brain },
            { key: 'selfCare', label: 'Self-care (washing/dressing)', icon: Heart },
            { key: 'communication', label: 'Communication', icon: MessageSquare },
          ].map((item) => (
            <Card key={item.key} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <item.icon aria-hidden="true" className="h-4 w-4 text-teal-500" />
                  <Label htmlFor={`washington-${item.key}`} className="text-sm font-medium">{item.label}</Label>
                </div>
                <Select onValueChange={(value) => setValue(`washingtonShortSet.${item.key}` as any, value as any)}>
                  <SelectTrigger id={`washington-${item.key}`} className="border-0 focus:ring-2 focus:ring-teal-500">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_difficulty">No difficulty</SelectItem>
                    <SelectItem value="some_difficulty">Some difficulty</SelectItem>
                    <SelectItem value="a_lot_of_difficulty">A lot of difficulty</SelectItem>
                    <SelectItem value="cannot_do_at_all">Cannot do at all</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>

    {/* Disability Inclusion Attributes */}
    <Card className="p-6 bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield aria-hidden="true" className="h-5 w-5 text-cyan-500" />
          <Label className="font-semibold text-lg">Disability Inclusion Attributes</Label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select all that apply to your venture's inclusion practices
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'disabilityLedLeadership', label: 'Disability-led leadership', icon: Users },
            { key: 'inclusiveHiringPractices', label: 'Inclusive hiring practices', icon: CheckCircle },
            { key: 'accessibleProductsOrServices', label: 'Accessible products/services', icon: Shield },
          ].map((item) => (
            <Card key={item.key} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex min-h-11 items-center space-x-3">
                <Checkbox
                  id={item.key}
                  onCheckedChange={(checked) => {
                    setValue(`disabilityInclusion.${item.key}` as any, checked as boolean)
                  }}
                />
                <item.icon aria-hidden="true" className="h-4 w-4 text-cyan-500" />
                <Label htmlFor={item.key} className="flex min-h-11 flex-1 cursor-pointer items-center text-sm">{item.label}</Label>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>

    {/* Additional Notes */}
    <Card className="p-6 border-dashed border-2 hover:border-teal-400 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <MessageSquare aria-hidden="true" className="h-4 w-4 text-teal-500" />
          <Label htmlFor="dliNotes" className="font-medium">Additional Notes</Label>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-3">Any relevant context about accessibility or inclusion practices</p>
        <Textarea 
          id="dliNotes" 
          rows={3} 
          placeholder="Additional context about your venture's accessibility features, inclusion practices, or specific needs..."
          className="border-0 focus:ring-2 focus:ring-teal-500 resize-none"
          {...register('disabilityInclusion.notes' as any)} 
        />
      </div>
    </Card>

    {/* Progress indicator */}
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>✅ Accessibility & Disability Inclusion</span>
        <span>Next: GEDSI Goals</span>
      </div>
    </div>
  </div>
  )
}
