"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

// Form validation schema
const ventureIntakeSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(1, 'Venture name is required'),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().min(1, 'Location is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  
  // Step 2: Team & Foundation
  founderTypes: z.array(z.string()).min(1, 'Select at least one founder type'),
  teamSize: z.string().min(1, 'Team size is required'),
  foundingYear: z.string().min(1, 'Founding year is required'),
  pitchSummary: z.string().min(10, 'Pitch summary must be at least 10 characters'),
  inclusionFocus: z.string().min(1, 'Inclusion focus is required'),
  
  // Step 3: Market & Business
  targetMarket: z.string().min(1, 'Target market is required'),
  revenueModel: z.string().min(1, 'Revenue model is required'),
  challenges: z.string().min(1, 'Challenges description is required'),
  supportNeeded: z.string().min(1, 'Support needed description is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  
  // Step 4: Readiness Assessment
  operationalReadiness: z.object({
    businessPlan: z.boolean(),
    financialProjections: z.boolean(),
    legalStructure: z.boolean(),
    teamComposition: z.boolean(),
    marketResearch: z.boolean(),
  }),
  
  capitalReadiness: z.object({
    pitchDeck: z.boolean(),
    financialStatements: z.boolean(),
    investorMaterials: z.boolean(),
    dueDiligence: z.boolean(),
    fundingHistory: z.boolean(),
  }),
  
  // Step 5: Accessibility & Disability Inclusion
  washingtonShortSet: z
    .object({
      seeing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      hearing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      walking: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      cognition: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      selfCare: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      communication: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
    })
    .optional(),
  disabilityInclusion: z
    .object({
      disabilityLedLeadership: z.boolean().optional(),
      inclusiveHiringPractices: z.boolean().optional(),
      accessibleProductsOrServices: z.boolean().optional(),
      notes: z.string().optional(),
    })
    .optional(),

  // Step 5: GEDSI Goals
  gedsiGoals: z.array(z.string()).min(1, 'Select at least one GEDSI goal'),
})

type VentureIntakeFormData = z.infer<typeof ventureIntakeSchema>

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

export function VentureIntakeForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [showAiInsights, setShowAiInsights] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<VentureIntakeFormData>({
    resolver: zodResolver(ventureIntakeSchema),
    mode: 'onChange',
  })

  const watchedValues = watch()

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: VentureIntakeFormData) => {
    setIsSubmitting(true)
    try {
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
        
        // Trigger AI analysis
        const aiResponse = await fetch('/api/ai/analyze-venture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ventureId: result.id }),
        })

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json()
          setAiAnalysis(aiResult)
          setShowAiInsights(true)
        }
      }
    } catch (error) {
      console.error('Error submitting venture:', error)
    } finally {
      setIsSubmitting(false)
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
                <Building2 className="h-4 w-4 text-blue-500" />
                <Label htmlFor="name" className="font-medium">Venture Name *</Label>
              </div>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., EcoFarm Solutions"
                className="border-0 text-lg font-medium focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Sector */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Label htmlFor="sector" className="font-medium">Industry Sector *</Label>
            </div>
            <Select onValueChange={(value) => setValue('sector', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500">
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
            {errors.sector && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.sector.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <Label htmlFor="location" className="font-medium">Location *</Label>
            </div>
            <Input
              id="location"
              {...register('location')}
              placeholder="Ho Chi Minh City, Vietnam"
              className="border-0 focus:ring-2 focus:ring-purple-500"
            />
            {errors.location && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.location.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Contact Email */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <Label htmlFor="contactEmail" className="font-medium">Contact Email *</Label>
            </div>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              placeholder="founder@yourventure.com"
              className="border-0 focus:ring-2 focus:ring-blue-500"
            />
            {errors.contactEmail && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.contactEmail.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Contact Phone */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-500" />
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
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Basic information</span>
          <span>Next: Team & Foundation</span>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">

      {/* Founder Types */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-5 w-5 text-purple-500" />
            <Label className="font-semibold text-lg">Founder Types *</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select all that apply to your founding team
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {founderTypes.map((type) => (
              <Card key={type} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-2">
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
                  <Label htmlFor={type} className="text-sm capitalize cursor-pointer">
                    {type.replace('-', ' ')}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
          {errors.founderTypes && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.founderTypes.message}</span>
            </p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Size */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <Label htmlFor="teamSize" className="font-medium">Team Size *</Label>
            </div>
            <Select onValueChange={(value) => setValue('teamSize', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-blue-500">
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
            {errors.teamSize && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.teamSize.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Founding Year */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <Label htmlFor="foundingYear" className="font-medium">Founding Year *</Label>
            </div>
            <Input
              id="foundingYear"
              {...register('foundingYear')}
              placeholder="When was your venture founded?"
              className="border-0 focus:ring-2 focus:ring-green-500"
            />
            {errors.foundingYear && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.foundingYear.message}</span>
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Pitch Summary */}
      <Card className="p-6 border-dashed border-2 hover:border-blue-400 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <Label htmlFor="pitchSummary" className="font-medium">Pitch Summary *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">Tell us about your venture's mission and value proposition</p>
          <Textarea
            id="pitchSummary"
            {...register('pitchSummary')}
            placeholder="We are solving [problem] for [target audience] by providing [solution]. Our unique approach is..."
            rows={4}
            className="border-0 focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {errors.pitchSummary && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.pitchSummary.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Inclusion Focus */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-green-500" />
            <Label htmlFor="inclusionFocus" className="font-medium">Inclusion Focus *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">How does your venture promote inclusion and address social challenges?</p>
          <Textarea
            id="inclusionFocus"
            {...register('inclusionFocus')}
            placeholder="Our venture promotes inclusion by... We address social challenges through... Our target beneficiaries are..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-green-500 resize-none"
          />
          {errors.inclusionFocus && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.inclusionFocus.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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
              <Target className="h-4 w-4 text-blue-500" />
              <Label htmlFor="targetMarket" className="font-medium">Target Market *</Label>
            </div>
            <Input
              id="targetMarket"
              {...register('targetMarket')}
              placeholder="Rural farmers in Vietnam"
              className="border-0 focus:ring-2 focus:ring-blue-500"
            />
            {errors.targetMarket && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.targetMarket.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Revenue Model */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Label htmlFor="revenueModel" className="font-medium">Revenue Model *</Label>
            </div>
            <Select onValueChange={(value) => setValue('revenueModel', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500">
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
            {errors.revenueModel && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.revenueModel.message}</span>
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Challenges */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <Label htmlFor="challenges" className="font-medium">Key Challenges *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">What are the main challenges your venture faces?</p>
          <Textarea
            id="challenges"
            {...register('challenges')}
            placeholder="Market access, funding constraints, regulatory barriers, technology challenges..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-orange-500 resize-none"
          />
          {errors.challenges && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.challenges.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Support Needed */}
      <Card className="p-6 border-dashed border-2 hover:border-purple-400 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-purple-500" />
            <Label htmlFor="supportNeeded" className="font-medium">Support Needed *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">What type of support do you need from MIV?</p>
          <Textarea
            id="supportNeeded"
            {...register('supportNeeded')}
            placeholder="Funding, mentorship, market access, technical assistance, network connections..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-purple-500 resize-none"
          />
          {errors.supportNeeded && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.supportNeeded.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <Label htmlFor="timeline" className="font-medium">Timeline to Investment Readiness *</Label>
          </div>
          <Input
            id="timeline"
            {...register('timeline')}
            placeholder="6-12 months to Series A"
            className="border-0 focus:ring-2 focus:ring-indigo-500"
          />
          {errors.timeline && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.timeline.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Market & Business Model</span>
          <span>Next: Readiness Assessment</span>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-8">

      {/* Operational Readiness */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
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
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`operationalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-blue-500" />
                  <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Capital Readiness */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-purple-500" />
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
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`capitalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-purple-500" />
                  <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Readiness Assessment</span>
          <span>Next: Accessibility & Disability Inclusion</span>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-8">

      {/* Washington Group Short Set */}
      <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-teal-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-teal-500" />
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
                    <item.icon className="h-4 w-4 text-teal-500" />
                    <Label className="text-sm font-medium">{item.label}</Label>
                  </div>
                  <Select onValueChange={(value) => setValue(`washingtonShortSet.${item.key}` as any, value as any)}>
                    <SelectTrigger className="border-0 focus:ring-2 focus:ring-teal-500">
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
      <Card className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-cyan-500" />
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
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`disabilityInclusion.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-cyan-500" />
                  <Label htmlFor={item.key} className="cursor-pointer text-sm">{item.label}</Label>
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
            <MessageSquare className="h-4 w-4 text-teal-500" />
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
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Accessibility & Disability Inclusion</span>
          <span>Next: GEDSI Goals</span>
        </div>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-8">

      {/* GEDSI Goals */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-emerald-500" />
            <Label className="font-semibold text-lg">GEDSI Goals *</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            These goals will be used to track your venture's impact and align with IRIS+ metrics
          </p>
          <div className="grid grid-cols-1 gap-3">
            {gedsiGoals.map((goal) => (
              <Card key={goal} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={goal}
                    className="mt-0.5"
                    onCheckedChange={(checked) => {
                      const current = watchedValues.gedsiGoals || []
                      if (checked) {
                        setValue('gedsiGoals', [...current, goal])
                      } else {
                        setValue('gedsiGoals', current.filter(g => g !== goal))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={goal} className="cursor-pointer font-medium">
                      {goal.split(' - ')[0]} - {goal.split(' - ')[1]}
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        IRIS+ Metric
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              </Card>
            ))}
          </div>
          {errors.gedsiGoals && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.gedsiGoals.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* AI Analysis Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
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
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload any documents that support your application and help us better understand your venture
          </p>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>All Supporting Materials</span>
            </h4>
            <FileUpload
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.png', '.jpeg']}
              maxFileSize={10 * 1024 * 1024} // 10MB
              maxFiles={10}
              onUpload={(files) => {
                console.log('Supporting documents uploaded:', files)
                // Handle file upload for all supporting documents
              }}
              placeholder="Upload pitch decks, business plans, financial statements, team bios, certificates..."
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
        <Award className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 dark:text-emerald-200">
          🎉 You're almost done! After submitting, you'll receive a comprehensive readiness assessment and personalized recommendations for your venture's growth.
        </AlertDescription>
      </Alert>

      {/* Progress indicator */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-4 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between text-sm text-emerald-800 dark:text-emerald-200">
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
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
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
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Suggested GEDSI Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiAnalysis.suggestedMetrics?.map((metric: any, index: number) => (
                  <Badge key={index} variant="outline" className="justify-start">
                    {metric.code}: {metric.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={() => setShowAiInsights(false)} variant="outline">
                Back to Form
              </Button>
              <Button>
                View Venture Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Venture Intake Form</h2>
          <Badge variant="outline">Step {currentStep} of {steps.length}</Badge>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            {steps[currentStep - 1].title} - {steps[currentStep - 1].description}
          </span>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{steps[currentStep - 1].title}</span>
            {currentStep === steps.length && <Sparkles className="h-4 w-4 text-blue-500" />}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isValid}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
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