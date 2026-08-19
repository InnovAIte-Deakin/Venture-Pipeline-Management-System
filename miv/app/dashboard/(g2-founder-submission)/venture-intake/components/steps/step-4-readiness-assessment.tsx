import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { FileText, Target, Users, CheckCircle, Calendar, TrendingUp, Shield, Award } from 'lucide-react'

export function Step4ReadinessAssessment({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
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
}
