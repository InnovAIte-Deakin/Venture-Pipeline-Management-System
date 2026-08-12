"use client"

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ventureIntakeSchema, type VentureIntakeFormData } from '../schemas/venture-intake-schema'
import { FileUpload } from '@/components/ui/file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FieldError } from './field-error'
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  FileText, 
  Target, 
  Users, 
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Heart,
  Shield,
  Award,
  Eye,
  Ear,
  Activity,
  Brain,
  MessageSquare
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Basic Information', description: 'Venture details and contact information' },
  { id: 2, title: 'Team & Foundation', description: 'Founding team and venture foundation' },
  { id: 3, title: 'Market & Business', description: 'Target market and business model' },
  { id: 4, title: 'Readiness Assessment', description: 'Operational and capital readiness' },
  { id: 5, title: 'Accessibility & DLI', description: 'Washington Short Set + Disability Inclusion' },
  { id: 6, title: 'GEDSI Goals', description: 'Impact goals and metrics' },
]

const sectors = [
  'CleanTech', 'Agriculture', 'FinTech', 'Healthcare', 'Education', 
  'E-commerce', 'Manufacturing', 'Services', 'Technology', 'Other'
]

const founderTypes = [
  'women-led', 'youth-led', 'disability-inclusive', 'rural-focus', 
  'indigenous-led', 'refugee-led', 'veteran-led', 'other'
]

const teamSizes = ['1-2', '3-5', '6-10', '11-20', '21-50', '50+']

const revenueModels = [
  'B2B Sales', 'B2C Sales', 'Subscription', 'Marketplace', 
  'Licensing', 'Franchising', 'Advertising', 'Other'
]

const gedsiGoals = [
  'OI.1 - Women-led ventures supported',
  'OI.2 - Ventures with disability inclusion',
  'OI.3 - Rural communities served',
  'OI.4 - Youth employment created',
  'OI.5 - Indigenous communities supported',
  'OI.6 - Financial inclusion achieved',
  'OI.7 - Education access improved',
  'OI.8 - Healthcare access enhanced'
]

const stepFields: Record<number, Array<keyof VentureIntakeFormData>> = {
  1: ['name', 'sector', 'location', 'contactEmail', 'contactPhone'],
  2: ['founderTypes', 'teamSize', 'foundingYear', 'pitchSummary', 'inclusionFocus'],
  3: ['targetMarket', 'revenueModel', 'challenges', 'supportNeeded', 'timeline'],
  4: ['operationalReadiness', 'capitalReadiness'],
  5: ['washingtonShortSet', 'disabilityInclusion'],
}

export function VentureIntakeForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusStepHeadingRef = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRetryingAnalysis, setIsRetryingAnalysis] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [showAiInsights, setShowAiInsights] = useState(false)
  const [createdVentureId, setCreatedVentureId] = useState<string | null>(null)
  const [ventureCreated, setVentureCreated] = useState(false)
  const [analysisFailed, setAnalysisFailed] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<VentureIntakeFormData>({
    resolver: zodResolver(ventureIntakeSchema),
    mode: 'onChange',
    defaultValues: {
      operationalReadiness: {
        businessPlan: false,
        financialProjections: false,
        legalStructure: false,
        teamComposition: false,
        marketResearch: false,
      },
      capitalReadiness: {
        pitchDeck: false,
        financialStatements: false,
        investorMaterials: false,
        dueDiligence: false,
        fundingHistory: false,
      },
    },
  })

  const watchedValues = watch()

  const progress = (currentStep / steps.length) * 100

  useEffect(() => {
    if (shouldFocusStepHeadingRef.current) {
      stepHeadingRef.current?.focus()
      shouldFocusStepHeadingRef.current = false
    }
  }, [currentStep])

  const handleNext = async () => {
    const fields = stepFields[currentStep]
    const isStepValid = fields
      ? await trigger(fields, { shouldFocus: true })
      : true

    if (isStepValid && currentStep < steps.length) {
      shouldFocusStepHeadingRef.current = true
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      shouldFocusStepHeadingRef.current = true
      setCurrentStep(currentStep - 1)
    }
  }

  const analyzeVenture = async (ventureId: string) => {
    try {
      const aiResponse = await fetch('/api/ai/analyze-venture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ventureId }),
      })

      if (!aiResponse.ok) {
        await aiResponse.json().catch(() => null)
        setAnalysisFailed(true)
        return
      }

      const aiResult = await aiResponse.json()
      setAiAnalysis(aiResult)
      setAnalysisFailed(false)
      setShowAiInsights(true)
    } catch (error) {
      console.error('Error analyzing venture:', error)
      setAnalysisFailed(true)
    }
  }

  const onSubmit = async (data: VentureIntakeFormData) => {
    setIsSubmitting(true)
    try {
      if (createdVentureId) {
        await analyzeVenture(createdVentureId)
        return
      }

      setSubmissionError(null)

      // Submit venture data
      const response = await fetch('/api/ventures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setCreatedVentureId(result.id)
        setVentureCreated(true)

        // Trigger AI analysis
        await analyzeVenture(result.id)
      } else {
        setSubmissionError('We could not submit your application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting venture:', error)
      if (!createdVentureId) {
        setSubmissionError('We could not submit your application. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const retryAnalysis = async () => {
    if (!createdVentureId) return

    setIsRetryingAnalysis(true)
    try {
      await analyzeVenture(createdVentureId)
    } finally {
      setIsRetryingAnalysis(false)
    }
  }

  const renderStep1 = () => (
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

  const renderStep2 = () => (
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

  const renderStep3 = () => (
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

  const renderStep4 = () => (
    <div className="space-y-8">

      {/* Operational Readiness */}
      <Card className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Operational Readiness</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check all the operational components you have ready
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'businessPlan', label: 'Business Plan', icon: FileText },
              { key: 'financialProjections', label: 'Financial Projections', icon: TrendingUp },
              { key: 'legalStructure', label: 'Legal Structure', icon: Shield },
              { key: 'teamComposition', label: 'Team Composition', icon: Users },
              { key: 'marketResearch', label: 'Market Research', icon: Target },
            ].map((item) => (
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow">
                <div className="flex min-h-11 items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`operationalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon aria-hidden="true" className="h-4 w-4 text-blue-500" />
                  <Label htmlFor={item.key} className="flex min-h-11 flex-1 cursor-pointer items-center">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Capital Readiness */}
      <Card className="p-6 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Award aria-hidden="true" className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Capital Readiness</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check all the capital-related materials you have prepared
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'pitchDeck', label: 'Pitch Deck', icon: FileText },
              { key: 'financialStatements', label: 'Financial Statements', icon: TrendingUp },
              { key: 'investorMaterials', label: 'Investor Materials', icon: Award },
              { key: 'dueDiligence', label: 'Due Diligence Ready', icon: CheckCircle },
              { key: 'fundingHistory', label: 'Funding History', icon: Calendar },
            ].map((item) => (
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow">
                <div className="flex min-h-11 items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`capitalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon aria-hidden="true" className="h-4 w-4 text-purple-500" />
                  <Label htmlFor={item.key} className="flex min-h-11 flex-1 cursor-pointer items-center">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>✅ Readiness Assessment</span>
          <span>Next: Accessibility & Disability Inclusion</span>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
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

  const renderStep6 = () => (
    <div className="space-y-8">

      {/* GEDSI Goals */}
      <Card className="p-6 bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Target aria-hidden="true" className="h-5 w-5 text-emerald-500" />
            <div id="gedsi-goals-label" className="font-semibold text-lg">GEDSI Goals <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            These goals will be used to track your venture's impact and align with IRIS+ metrics
          </p>
          <div
            role="group"
            aria-labelledby="gedsi-goals-label"
            aria-required="true"
            aria-invalid={Boolean(errors.gedsiGoals)}
            aria-describedby={errors.gedsiGoals ? 'gedsi-goals-error' : undefined}
            className="grid grid-cols-1 gap-3"
          >
            {gedsiGoals.map((goal) => (
              <Card key={goal} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex min-h-11 items-start space-x-3">
                  <Checkbox
                    id={goal}
                    className="mt-0.5"
                    onCheckedChange={(checked) => {
                      const current = watchedValues.gedsiGoals || []
                      if (checked) {
                        setValue('gedsiGoals', [...current, goal], { shouldValidate: true })
                      } else {
                        setValue('gedsiGoals', current.filter(g => g !== goal), { shouldValidate: true })
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={goal} className="flex min-h-11 cursor-pointer items-center font-medium">
                      {goal.split(' - ')[0]} - {goal.split(' - ')[1]}
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        IRIS+ Metric
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle aria-hidden="true" className="h-4 w-4 text-emerald-500" />
                </div>
              </Card>
            ))}
          </div>
          {errors.gedsiGoals && <FieldError id="gedsi-goals-error" message={errors.gedsiGoals.message} />}
        </div>
      </Card>

      {/* AI Analysis Info */}
      <Card className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI-Powered Impact Analysis</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              After submitting your form, our AI system will analyze your venture and suggest additional relevant IRIS+ metrics based on your sector, business model, and GEDSI goals.
            </p>
          </div>
        </div>
      </Card>

      {/* Supporting Documents */}
      <Card className="p-6 bg-linear-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Upload aria-hidden="true" className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload any documents that support your application and help us better understand your venture
          </p>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <FileText aria-hidden="true" className="h-4 w-4" />
              <span>All Supporting Materials</span>
            </h4>
            <FileUpload
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.png', '.jpeg']}
              maxFileSize={10}
              maxFiles={10}
              onFilesUploaded={(files) => {
                console.log('Supporting documents uploaded:', files)
                // Handle file upload for all supporting documents
              }}
              description="Upload pitch decks, business plans, financial statements, team bios, certificates..."
            />
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
            <p className="text-xs text-slate-800 dark:text-slate-200">
              💡 <strong>Helpful documents:</strong> Pitch deck, business plan, financial projections, team bios, legal documents, market research, accessibility reports, impact reports, or any other materials that showcase your venture.
            </p>
          </div>
        </div>
      </Card>

      {/* Final Info Alert */}
      <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
        <Award aria-hidden="true" className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 dark:text-emerald-200">
          🎉 You're almost done! After submitting, you'll receive a comprehensive readiness assessment and personalized recommendations for your venture's growth.
        </AlertDescription>
      </Alert>

      {/* Progress indicator */}
      <div className="bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-4 rounded-lg border border-emerald-200">
        <div className="flex flex-col gap-1 text-sm text-emerald-800 dark:text-emerald-200 sm:flex-row sm:items-center sm:justify-between">
          <span>✅ GEDSI Goals & Impact</span>
          <span>Ready to Submit & Analyze!</span>
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      case 6:
        return renderStep6()
      default:
        return null
    }
  }

  if (showAiInsights && aiAnalysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader role="status">
            <div className="flex items-center space-x-2">
              <Sparkles aria-hidden="true" className="h-5 w-5 text-blue-500" />
              <CardTitle>AI Analysis Complete!</CardTitle>
            </div>
            <CardDescription>
              Your venture has been analyzed and GEDSI metrics have been suggested
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Readiness Score</h4>
                <p className="text-2xl font-bold text-green-600">{aiAnalysis.readinessScore}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">GEDSI Alignment</h4>
                <p className="text-2xl font-bold text-blue-600">{aiAnalysis.gedsiAlignment}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800">Suggested Metrics</h4>
                <p className="text-2xl font-bold text-purple-600">{aiAnalysis.suggestedMetrics?.length || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">AI Recommendations</h4>
              <div className="space-y-2">
                {aiAnalysis.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle aria-hidden="true" className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Suggested GEDSI Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiAnalysis.suggestedMetrics?.map((metric: any, index: number) => (
                  <Badge key={index} variant="outline" className="w-full justify-start whitespace-normal text-left">
                    {metric.code}: {metric.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button className="w-full min-h-11 sm:w-auto" onClick={() => setShowAiInsights(false)} variant="outline">
                Back to Form
              </Button>
              <Button className="w-full min-h-11 sm:w-auto">
                View Venture Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (ventureCreated && analysisFailed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card aria-busy={isRetryingAnalysis}>
          <p className="sr-only" role="status" aria-live="polite">
            {isRetryingAnalysis ? 'Retrying analysis.' : ''}
          </p>
          <CardHeader role="status">
            <div className="flex items-center space-x-2">
              <CheckCircle aria-hidden="true" className="h-5 w-5 text-green-600" />
              <CardTitle>Venture submitted successfully</CardTitle>
            </div>
            <CardDescription>
              Your application has been saved, but the analysis could not be completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert role="alert" className="border-amber-200 bg-amber-50 dark:bg-amber-950">
              <AlertCircle aria-hidden="true" className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                Your application is already submitted and does not need to be submitted again.
              </AlertDescription>
            </Alert>

            <Button
              type="button"
              onClick={retryAnalysis}
              disabled={isRetryingAnalysis}
              className="min-h-11"
            >
              {isRetryingAnalysis ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 mr-2 animate-spin" />
                  Retrying Analysis...
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" className="h-4 w-4 mr-2" />
                  Retry Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Venture Intake Form</h2>
          <Badge variant="outline" aria-live="polite" aria-atomic="true">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        <Progress
          value={progress}
          aria-label={`Form progress: step ${currentStep} of ${steps.length}`}
          className="w-full"
        />
        <div className="flex items-center space-x-2" aria-live="polite" aria-atomic="true">
          <Building2 aria-hidden="true" className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            {steps[currentStep - 1].title} - {steps[currentStep - 1].description}
          </span>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <h3 ref={stepHeadingRef} tabIndex={-1}>{steps[currentStep - 1].title}</h3>
            {currentStep === steps.length && <Sparkles aria-hidden="true" className="h-4 w-4 text-blue-500" />}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-busy={isSubmitting}
            className="space-y-6"
          >
            <p className="sr-only" role="status" aria-live="polite">
              {isSubmitting ? 'Submitting your application.' : ''}
            </p>
            {renderStep()}

            {submissionError && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                {submissionError}
              </p>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="min-h-11"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="min-h-11"
                >
                  Next
                  <ChevronRight aria-hidden="true" className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-11 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:text-white disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 aria-hidden="true" className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles aria-hidden="true" className="h-4 w-4 mr-2" />
                      Submit & Analyze
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
