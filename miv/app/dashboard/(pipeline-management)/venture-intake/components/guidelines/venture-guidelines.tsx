import { guidelinesEn } from '../../content/guidelines.en'
import { GuidelineAccordion } from './guideline-accordion'

export function VentureGuidelines() {
  return (
    <section
      aria-labelledby="venture-guidelines-heading"
      className="mt-12 min-w-0 space-y-6"
    >
      <header className="text-center">
        <h2
          id="venture-guidelines-heading"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {guidelinesEn.heading}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {guidelinesEn.introduction}
        </p>
      </header>

      <GuidelineAccordion
        sections={guidelinesEn.sections}
        expandLabel={guidelinesEn.expandLabel}
        collapseLabel={guidelinesEn.collapseLabel}
        defaultExpandedId="formTips"
      />
    </section>
  )
}
