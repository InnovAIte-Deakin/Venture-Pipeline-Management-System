import type { Payload } from 'payload'

export const up = async (payload: Payload): Promise<void> => {
  await payload.updateGlobal({ slug: 'lookups', data: {
    sectors: [{ value: 'agri' }, { value: 'climate' }, { value: 'gender' }],
    impactAreas: [{ value: 'agri' }, { value: 'climate' }, { value: 'gender' }],
    countries: [{ code: 'KH', name: 'Cambodia' }, { code: 'LA', name: 'Laos' }, { code: 'VN', name: 'Vietnam' }],
    currencies: [{ code: 'USD', name: 'US Dollar' }, { code: 'KHR', name: 'Cambodian Riel' }],
  } })
}

export const down = async (_payload: Payload): Promise<void> => {
  // no-op
}
