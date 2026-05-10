import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AIServices } from '@/lib/ai-services'

const summarizeSchema = z.object({
  name: z.string().min(1),
  sector: z.string().min(1),
  location: z.string().min(1),
  founderTypes: z.array(z.string()).default([]),
  pitchSummary: z.string().default(''),
  inclusionFocus: z.string().default(''),
  targetMarket: z.string().default(''),
  revenueModel: z.string().default(''),
  challenges: z.string().default(''),
  supportNeeded: z.string().default(''),
  operationalReadiness: z.record(z.boolean()).default({}),
  capitalReadiness: z.record(z.boolean()).default({}),
  gedsiGoals: z.array(z.string()).default([]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = summarizeSchema.parse(body)
    const result = await AIServices.summarizeVenture(data)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('AI summarize error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
