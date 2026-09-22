export const guidelineSectionIds = [
  'formTips',
  'commonMistakes',
  'afterSubmission',
  'strongApplication',
  'resources',
  'support',
  'privacy',
] as const

export type GuidelineSectionId = (typeof guidelineSectionIds)[number]

export interface GuidelineEntry {
  id: string
  label: string
  body: string
  href?: string
  linkLabel?: string
}

export interface GuidelineSection {
  id: GuidelineSectionId
  title: string
  description: string
  entries: GuidelineEntry[]
}

export interface GuidelinesContent {
  heading: string
  introduction: string
  expandLabel: string
  collapseLabel: string
  sections: GuidelineSection[]
}

export const guidelinesEn = {
  heading: 'Guidelines for a strong application',
  introduction: 'Review practical guidance for each part of your application.',
  expandLabel: 'Show',
  collapseLabel: 'Hide',
  sections: [
    {
      id: 'formTips',
      title: 'Complete each section clearly',
      description: 'Practical guidance for the six application steps.',
      entries: [
        {
          id: 'basic-information',
          label: 'Basic information',
          body: 'Use your recognised venture name and provide an accurate sector and location.',
        },
        {
          id: 'team-and-foundation',
          label: 'Team and foundation',
          body: 'Describe the problem you address, your approach, and the experience your team brings.',
        },
        {
          id: 'market-and-business',
          label: 'Market and business',
          body: 'Define your customers, explain how the venture earns revenue, and describe your main challenges.',
        },
        {
          id: 'readiness-assessment',
          label: 'Readiness assessment',
          body: 'Select the materials and processes you currently have. Gaps are expected and help us understand where support is needed.',
        },
        {
          id: 'accessibility-and-inclusion',
          label: 'Accessibility and disability inclusion',
          body: 'Answer the Washington Group questions accurately so we can plan appropriate and inclusive support.',
        },
        {
          id: 'gedsi-goals',
          label: 'GEDSI goals',
          body: 'Select goals that directly reflect your work and intended impact. The analysis may suggest additional relevant metrics.',
        },
      ],
    },
    {
      id: 'commonMistakes',
      title: 'Common mistakes to avoid',
      description: 'A few checks before submitting.',
      entries: [
        {
          id: 'be-accurate',
          label: 'Be accurate',
          body: 'Avoid overstating progress, results, or readiness.',
        },
        {
          id: 'be-specific',
          label: 'Be specific',
          body: 'Explain your market and value proposition with concrete details.',
        },
        {
          id: 'address-inclusion',
          label: 'Address inclusion',
          body: 'Describe how inclusion relates to your venture rather than leaving the section vague.',
        },
        {
          id: 'choose-relevant-goals',
          label: 'Choose relevant goals',
          body: 'Select GEDSI goals you genuinely plan to measure and pursue.',
        },
      ],
    },
    {
      id: 'afterSubmission',
      title: 'What happens after you submit',
      description: 'The expected review process and timing.',
      entries: [
        {
          id: 'initial-analysis',
          label: 'Initial analysis',
          body: 'The platform analyses readiness and GEDSI alignment after submission.',
        },
        {
          id: 'team-review',
          label: 'Team review — 2–3 days',
          body: 'The investment team reviews the application and prepares feedback.',
        },
        {
          id: 'initial-meeting',
          label: 'Initial meeting — about one week',
          body: 'The team may arrange a call to discuss your venture, questions, and possible support.',
        },
      ],
    },
    {
      id: 'strongApplication',
      title: 'What makes an application strong',
      description: 'The main qualities considered during review.',
      entries: [
        {
          id: 'meaningful-impact',
          label: 'Meaningful impact',
          body: 'A clear commitment to inclusion and social impact.',
        },
        {
          id: 'capable-team',
          label: 'Capable team',
          body: 'A team with relevant, complementary experience.',
        },
        {
          id: 'clear-opportunity',
          label: 'Clear opportunity',
          body: 'A well-defined problem, customer group, and value proposition.',
        },
        {
          id: 'growth-potential',
          label: 'Growth potential',
          body: 'A business model that can grow while maintaining its intended impact.',
        },
      ],
    },
    {
      id: 'resources',
      title: 'Helpful resources',
      description: 'Frameworks referenced in the application.',
      entries: [
        {
          id: 'iris-metrics',
          label: 'IRIS+ Metrics Catalog',
          body: 'Standards for selecting and defining impact metrics.',
        },
        {
          id: 'two-x-criteria',
          label: '2X Criteria',
          body: 'A framework for gender-lens investment.',
        },
        {
          id: 'washington-group',
          label: 'Washington Group Questions',
          body: 'A standard approach to understanding disability-related functional difficulties.',
        },
        {
          id: 'investment-readiness',
          label: 'Investment Readiness Checklist',
          body: 'A guide to preparing for investment discussions.',
        },
      ],
    },
    {
      id: 'support',
      title: 'Get help with your application',
      description: 'Contact the MIV team if a question is unclear.',
      entries: [
        {
          id: 'email-support',
          label: 'Email support',
          body: 'Contact our team for help with any section of the application.',
          href: 'mailto:support@miv.org',
          linkLabel: 'support@miv.org',
        },
      ],
    },
    {
      id: 'privacy',
      title: 'How your information is used',
      description: 'Information about confidentiality and data handling.',
      entries: [
        {
          id: 'data-use',
          label: 'Data use',
          body: 'Your information is used to assess your application and provide relevant support.',
        },
      ],
    },
  ],
} satisfies GuidelinesContent
