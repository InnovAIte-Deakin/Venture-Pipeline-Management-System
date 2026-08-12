import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { FileUpload } from '@/components/ui/file-upload'
import { FieldError } from '../field-error'
import type { VentureIntakeStepProps } from './venture-intake-step-props'
import { Upload, FileText, Target, CheckCircle, Sparkles, Award } from 'lucide-react'
import { gedsiGoals } from './venture-intake-options'

export function Step6GedsiGoals({ register, setValue, watchedValues, errors }: VentureIntakeStepProps) {
  return (
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
}
