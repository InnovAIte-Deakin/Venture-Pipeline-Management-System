import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { Building2, Mail, Phone, MapPin, TrendingUp } from 'lucide-react'
import { sectors } from './venture-intake-options'

export function Step1BasicInformation({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
  <div className="space-y-8">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Venture Name */}
      <div className="md:col-span-2">
        <Card className="p-4 border-dashed border-2 hover:border-blue-400 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 aria-hidden="true" className="h-4 w-4 text-blue-500" />
              <Label htmlFor="name" className="font-medium">Venture Name <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
            </div>
            <Input
              id="name"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
              placeholder="e.g., EcoFarm Solutions"
              className="border-0 text-lg font-medium focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <FieldError id="name-error" message={errors.name.message} />}
          </div>
        </Card>
      </div>

      {/* Sector */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-green-500" />
            <Label htmlFor="sector" className="font-medium">Industry Sector <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Select onValueChange={(value) => setValue('sector', value)}>
            <SelectTrigger
              id="sector"
              aria-required="true"
              aria-invalid={Boolean(errors.sector)}
              aria-describedby={errors.sector ? 'sector-error' : undefined}
              className="border-0 focus:ring-2 focus:ring-green-500"
            >
              <SelectValue placeholder="Choose your industry" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sector && <FieldError id="sector-error" message={errors.sector.message} />}
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin aria-hidden="true" className="h-4 w-4 text-purple-500" />
            <Label htmlFor="location" className="font-medium">Location <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Input
            id="location"
            aria-required="true"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? 'location-error' : undefined}
            {...register('location')}
            placeholder="Ho Chi Minh City, Vietnam"
            className="border-0 focus:ring-2 focus:ring-purple-500"
          />
          {errors.location && <FieldError id="location-error" message={errors.location.message} />}
        </div>
      </Card>

      {/* Contact Email */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail aria-hidden="true" className="h-4 w-4 text-blue-500" />
            <Label htmlFor="contactEmail" className="font-medium">Contact Email <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
          </div>
          <Input
            id="contactEmail"
            type="email"
            aria-required="true"
            aria-invalid={Boolean(errors.contactEmail)}
            aria-describedby={errors.contactEmail ? 'contact-email-error' : undefined}
            {...register('contactEmail')}
            placeholder="founder@yourventure.com"
            className="border-0 focus:ring-2 focus:ring-blue-500"
          />
          {errors.contactEmail && <FieldError id="contact-email-error" message={errors.contactEmail.message} />}
        </div>
      </Card>

      {/* Contact Phone */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone aria-hidden="true" className="h-4 w-4 text-green-500" />
            <Label htmlFor="contactPhone" className="font-medium">Contact Phone</Label>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <Input
            id="contactPhone"
            {...register('contactPhone')}
            placeholder="+84 901 234 567"
            className="border-0 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </Card>
    </div>

    {/* Progress indicator */}
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>✅ Basic information</span>
        <span>Next: Team & Foundation</span>
      </div>
    </div>
  </div>
  )
}
