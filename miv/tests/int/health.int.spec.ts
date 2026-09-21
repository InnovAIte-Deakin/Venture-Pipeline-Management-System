import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('returns 200 with an ok status and a timestamp', async () => {
    const response = await GET()

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.status).toBe('ok')
    expect(body.app).toBe('miv')
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false)
  })
})