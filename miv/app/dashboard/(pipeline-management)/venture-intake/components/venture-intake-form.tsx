"use client"

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ventureIntakeSchema, type VentureIntakeFormData } from '../schemas/venture-intake-schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Step1BasicInformation } from './steps/step-1-basic-information'
import { Step2TeamFoundation } from './steps/step-2-team-foundation'
import { Step3MarketBusiness } from './steps/step-3-market-business'
import { Step4ReadinessAssessment } from './steps/step-4-readiness-assessment'
import { Step5AccessibilityDli } from './steps/step-5-accessibility-dli'
import { Step6GedsiGoals } from './steps/step-6-gedsi-goals'
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Basic Information', description: 'Venture details and contact information' },
  { id: 2, title: 'Team & Foundation', description: 'Founding team and venture foundation' },
  { id: 3, title: 'Market & Business', description: 'Target market and business model' },
  { id: 4, title: 'Readiness Assessment', description: 'Operational and capital readiness' },
  { id: 5, title: 'Accessibility & DLI', description: 'Washington Short Set + Disability Inclusion' },
  { id: 6, title: 'GEDSI Goals', description: 'Impact goals and metrics' },
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

  const stepProps = { register, setValue, watchedValues, errors }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInformation {...stepProps} />
      case 2:
        return <Step2TeamFoundation {...stepProps} />
      case 3:
        return <Step3MarketBusiness {...stepProps} />
      case 4:
        return <Step4ReadinessAssessment {...stepProps} />
      case 5:
        return <Step5AccessibilityDli {...stepProps} />
      case 6:
        return <Step6GedsiGoals {...stepProps} />
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
