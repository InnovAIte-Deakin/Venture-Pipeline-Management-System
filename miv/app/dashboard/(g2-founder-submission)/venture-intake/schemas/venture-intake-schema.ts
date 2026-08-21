import { z } from 'zod'

// Form validation schema
export const ventureIntakeSchema = z.object({
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

export type VentureIntakeFormData = z.infer<typeof ventureIntakeSchema>
