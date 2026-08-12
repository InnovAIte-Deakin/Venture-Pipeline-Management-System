import { VentureIntakeForm } from "../components/venture-intake-form"
import { VentureGuidelines } from "../components/guidelines/venture-guidelines"

export function DesktopView() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Venture Intake
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit your venture application for MIV support and investment readiness assessment.
          </p>
        </div>
        
        <VentureIntakeForm />
        
        <VentureGuidelines />
      </div>
    </div>
  )
}
