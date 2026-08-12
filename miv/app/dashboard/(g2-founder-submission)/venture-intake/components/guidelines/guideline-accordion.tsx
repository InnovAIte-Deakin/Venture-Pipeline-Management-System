"use client"

import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Lightbulb,
  Mail,
  Shield,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type {
  GuidelineSection,
  GuidelineSectionId,
} from '../../content/guidelines.en'

interface GuidelineAccordionProps {
  sections: GuidelineSection[]
  expandLabel: string
  collapseLabel: string
  defaultExpandedId?: GuidelineSectionId
}

const sectionIcons: Record<GuidelineSectionId, LucideIcon> = {
  formTips: Lightbulb,
  commonMistakes: Shield,
  afterSubmission: Clock,
  strongApplication: TrendingUp,
  resources: BookOpen,
  support: Mail,
  privacy: Shield,
}

export function GuidelineAccordion({
  sections,
  expandLabel,
  collapseLabel,
  defaultExpandedId,
}: GuidelineAccordionProps) {
  const [expandedId, setExpandedId] = useState<GuidelineSectionId | null>(
    defaultExpandedId ?? sections[0]?.id ?? null
  )

  return (
    <div className="w-full space-y-3">
      {sections.map((section) => {
        const expanded = expandedId === section.id
        const triggerId = `guideline-trigger-${section.id}`
        const panelId = `guideline-panel-${section.id}`
        const SectionIcon = sectionIcons[section.id]

        return (
          <div
            key={section.id}
            className="min-w-0 overflow-hidden rounded-lg border bg-white dark:bg-slate-950"
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setExpandedId(expanded ? null : section.id)}
                className="flex min-h-11 w-full min-w-0 items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset dark:hover:bg-slate-900 sm:px-5"
              >
                <SectionIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span className="min-w-0 flex-1">
                  <span className="block break-words font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </span>
                  <span className="mt-0.5 block break-words text-sm font-normal text-gray-600 dark:text-gray-400">
                    {section.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{expanded ? collapseLabel : expandLabel}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!expanded}
              className="border-t px-4 py-4 sm:px-5"
            >
              <ul className="space-y-4">
                {section.entries.map((entry) => (
                  <li key={entry.id} className="flex min-w-0 items-start gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                    />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-gray-900 dark:text-white">
                        {entry.label}
                      </p>
                      <p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-400">
                        {entry.body}
                        {entry.href && entry.linkLabel && (
                          <>
                            {' '}
                            <a
                              href={entry.href}
                              className="font-medium text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"
                            >
                              {entry.linkLabel}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
