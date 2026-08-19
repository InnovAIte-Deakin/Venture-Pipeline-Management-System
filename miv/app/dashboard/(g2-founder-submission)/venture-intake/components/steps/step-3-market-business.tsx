import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { AlertCircle, Target, Calendar, TrendingUp, Heart } from 'lucide-react'
import { revenueModels } from './venture-intake-options'

export function Step3MarketBusiness({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
  <div className="space-y-8">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Target Market */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Target aria-hidden="true" className="h-4 w-4 text-blue-500" />
            <Label htmlFor="targetMarket" className="font-medium">Target Market <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Input
            id="targetMarket"
            aria-required="true"
            aria-invalid={Boolean(errors.targetMarket)}
            aria-describedby={errors.targetMarket ? 'target-market-error' : undefined}
            {...register('targetMarket')}
            placeholder="Rural farmers in Vietnam"
            className="border-0 focus:ring-2 focus:ring-blue-500"
          />
          {errors.targetMarket && <FieldError id="target-market-error" message={errors.targetMarket.message} />}
        </div>
      </Card>

      {/* Revenue Model */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-green-500" />
            <Label htmlFor="revenueModel" className="font-medium">Revenue Model <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Select onValueChange={(value) => setValue('revenueModel', value)}>
            <SelectTrigger
              id="revenueModel"
              aria-required="true"
              aria-invalid={Boolean(errors.revenueModel)}
              aria-describedby={errors.revenueModel ? 'revenue-model-error' : undefined}
              className="border-0 focus:ring-2 focus:ring-green-500"
            >
              <SelectValue placeholder="How do you make money?" />
            </SelectTrigger>
            <SelectContent>
              {revenueModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.revenueModel && <FieldError id="revenue-model-error" message={errors.revenueModel.message} />}
        </div>
      </Card>
    </div>

    {/* Challenges */}
    <Card className="p-6 bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <AlertCircle aria-hidden="true" className="h-4 w-4 text-orange-500" />
          <Label htmlFor="challenges" className="font-medium">Key Challenges <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        </div>
        <p className="text-sm text-gray-500 mb-3">What are the main challenges your venture faces?</p>
        <Textarea
          id="challenges"
          aria-required="true"
          aria-invalid={Boolean(errors.challenges)}
          aria-describedby={errors.challenges ? 'challenges-error' : undefined}
          {...register('challenges')}
          placeholder="Market access, funding constraints, regulatory barriers, technology challenges..."
          rows={3}
          className="border-0 focus:ring-2 focus:ring-orange-500 resize-none"
        />
        {errors.challenges && <FieldError id="challenges-error" message={errors.challenges.message} />}
      </div>
    </Card>

    {/* Support Needed */}
    <Card className="p-6 border-dashed border-2 hover:border-purple-400 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Heart aria-hidden="true" className="h-4 w-4 text-purple-500" />
          <Label htmlFor="supportNeeded" className="font-medium">Support Needed <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        </div>
        <p className="text-sm text-gray-500 mb-3">What type of support do you need from MIV?</p>
        <Textarea
          id="supportNeeded"
          aria-required="true"
          aria-invalid={Boolean(errors.supportNeeded)}
          aria-describedby={errors.supportNeeded ? 'support-needed-error' : undefined}
          {...register('supportNeeded')}
          placeholder="Funding, mentorship, market access, technical assistance, network connections..."
          rows={3}
          className="border-0 focus:ring-2 focus:ring-purple-500 resize-none"
        />
        {errors.supportNeeded && <FieldError id="support-needed-error" message={errors.supportNeeded.message} />}
      </div>
    </Card>

    {/* Timeline */}
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Calendar aria-hidden="true" className="h-4 w-4 text-indigo-500" />
          <Label htmlFor="timeline" className="font-medium">Timeline to Investment Readiness <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        </div>
        <Input
          id="timeline"
          aria-required="true"
          aria-invalid={Boolean(errors.timeline)}
          aria-describedby={errors.timeline ? 'timeline-error' : undefined}
          {...register('timeline')}
          placeholder="6-12 months to Series A"
          className="border-0 focus:ring-2 focus:ring-indigo-500"
        />
        {errors.timeline && <FieldError id="timeline-error" message={errors.timeline.message} />}
      </div>
    </Card>

    {/* Progress indicator */}
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>✅ Market & Business Model</span>
        <span>Next: Readiness Assessment</span>
      </div>
    </div>
  </div>
  )
}
