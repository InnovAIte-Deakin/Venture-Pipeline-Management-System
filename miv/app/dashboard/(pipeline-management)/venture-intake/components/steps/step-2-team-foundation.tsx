import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { Users, Calendar, Heart, MessageSquare } from 'lucide-react'
import { founderTypes, teamSizes } from './venture-intake-options'

export function Step2TeamFoundation({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
  <div className="space-y-8">

    {/* Founder Types */}
    <Card className="p-6 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Heart aria-hidden="true" className="h-5 w-5 text-purple-500" />
          <div id="founder-types-label" className="font-semibold text-lg">Founder Types <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select all that apply to your founding team
        </p>
        <div
          role="group"
          aria-labelledby="founder-types-label"
          aria-required="true"
          aria-invalid={Boolean(errors.founderTypes)}
          aria-describedby={errors.founderTypes ? 'founder-types-error' : undefined}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {founderTypes.map((type) => (
            <Card key={type} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex min-h-11 items-center space-x-2">
                <Checkbox
                  id={type}
                  onCheckedChange={(checked) => {
                    const current = watchedValues.founderTypes || []
                    if (checked) {
                      setValue('founderTypes', [...current, type])
                    } else {
                      setValue('founderTypes', current.filter(t => t !== type))
                    }
                  }}
                />
                <Label htmlFor={type} className="flex min-h-11 flex-1 cursor-pointer items-center text-sm capitalize">
                  {type.replace('-', ' ')}
                </Label>
              </div>
            </Card>
          ))}
        </div>
        {errors.founderTypes && <FieldError id="founder-types-error" message={errors.founderTypes.message} />}
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Team Size */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users aria-hidden="true" className="h-4 w-4 text-blue-500" />
            <Label htmlFor="teamSize" className="font-medium">Team Size <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Select onValueChange={(value) => setValue('teamSize', value)}>
            <SelectTrigger
              id="teamSize"
              aria-required="true"
              aria-invalid={Boolean(errors.teamSize)}
              aria-describedby={errors.teamSize ? 'team-size-error' : undefined}
              className="border-0 focus:ring-2 focus:ring-blue-500"
            >
              <SelectValue placeholder="How many team members?" />
            </SelectTrigger>
            <SelectContent>
              {teamSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} people
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teamSize && <FieldError id="team-size-error" message={errors.teamSize.message} />}
        </div>
      </Card>

      {/* Founding Year */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar aria-hidden="true" className="h-4 w-4 text-green-500" />
            <Label htmlFor="foundingYear" className="font-medium">Founding Year <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Input
            id="foundingYear"
            aria-required="true"
            aria-invalid={Boolean(errors.foundingYear)}
            aria-describedby={errors.foundingYear ? 'founding-year-error' : undefined}
            {...register('foundingYear')}
            placeholder="When was your venture founded?"
            className="border-0 focus:ring-2 focus:ring-green-500"
          />
          {errors.foundingYear && <FieldError id="founding-year-error" message={errors.foundingYear.message} />}
        </div>
      </Card>
    </div>

    {/* Pitch Summary */}
    <Card className="p-6 border-dashed border-2 hover:border-blue-400 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <MessageSquare aria-hidden="true" className="h-4 w-4 text-blue-500" />
          <Label htmlFor="pitchSummary" className="font-medium">Pitch Summary <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        </div>
        <p className="text-sm text-gray-500 mb-3">Tell us about your venture's mission and value proposition</p>
        <Textarea
          id="pitchSummary"
          aria-required="true"
          aria-invalid={Boolean(errors.pitchSummary)}
          aria-describedby={errors.pitchSummary ? 'pitch-summary-error' : undefined}
          {...register('pitchSummary')}
          placeholder="We are solving [problem] for [target audience] by providing [solution]. Our unique approach is..."
          rows={4}
          className="border-0 focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.pitchSummary && <FieldError id="pitch-summary-error" message={errors.pitchSummary.message} />}
      </div>
    </Card>

    {/* Inclusion Focus */}
    <Card className="p-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Heart aria-hidden="true" className="h-4 w-4 text-green-500" />
          <Label htmlFor="inclusionFocus" className="font-medium">Inclusion Focus <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        </div>
        <p className="text-sm text-gray-500 mb-3">How does your venture promote inclusion and address social challenges?</p>
        <Textarea
          id="inclusionFocus"
          aria-required="true"
          aria-invalid={Boolean(errors.inclusionFocus)}
          aria-describedby={errors.inclusionFocus ? 'inclusion-focus-error' : undefined}
          {...register('inclusionFocus')}
          placeholder="Our venture promotes inclusion by... We address social challenges through... Our target beneficiaries are..."
          rows={3}
          className="border-0 focus:ring-2 focus:ring-green-500 resize-none"
        />
        {errors.inclusionFocus && <FieldError id="inclusion-focus-error" message={errors.inclusionFocus.message} />}
      </div>
    </Card>

    {/* Progress indicator */}
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>✅ Team & Foundation</span>
        <span>Next: Market & Business Model</span>
      </div>
    </div>
  </div>
  )
}
