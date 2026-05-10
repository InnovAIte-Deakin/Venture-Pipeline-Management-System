import { z } from 'zod'

export const WSSAnswer = z.enum([
  'no_difficulty',
  'some_difficulty',
  'a_lot_of_difficulty',
  'cannot_do_at_all',
])
export type WSSAnswer = z.infer<typeof WSSAnswer>

export const TriageTrack = z.enum(['unassigned', 'fast', 'slow'])
export type TriageTrack = z.infer<typeof TriageTrack>

export const AgreementType = z.enum(['NDA', 'MOU'])
export type AgreementType = z.infer<typeof AgreementType>

export const DataRoomCategory = z.enum(['pitch', 'financials', 'policies', 'registration', 'other'])
export type DataRoomCategory = z.infer<typeof DataRoomCategory>
