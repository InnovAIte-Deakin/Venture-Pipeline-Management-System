import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const baseUrl = process.env.MIV_TEST_BASE_URL || 'http://localhost:3000'
const runIntegrationTests = process.env.MIV_RUN_INTEGRATION_TESTS === 'true'

// Helper to log in to NextAuth using the CSRF dance
async function loginNextAuth(email: string, password: string): Promise<string> {
  assert.ok(baseUrl, 'MIV_TEST_BASE_URL must be set')
  
  // 1. Get CSRF token
  const csrfRes = await fetch(new URL('/api/auth/csrf', baseUrl))
  const { csrfToken } = await csrfRes.json()
  const csrfCookie = csrfRes.headers.getSetCookie().join('; ')

  // 2. Post credentials with csrfToken
  const loginRes = await fetch(new URL('/api/auth/callback/credentials', baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookie
    },
    body: new URLSearchParams({
      email,
      password,
      csrfToken,
      callbackUrl: '/',
      redirect: 'false',
      json: 'true'
    })
  })

  // 3. Extract the next-auth.session-token cookie
  const cookies = loginRes.headers.getSetCookie()
  const sessionTokenCookie = cookies.find(c => c.includes('next-auth.session-token')) || ''
  
  // Return format: next-auth.session-token=XYZ
  const match = sessionTokenCookie.match(/(next-auth\.session-token=[^;]+)/)
  return match ? match[1] : ''
}

async function getJson(path: string, cookie?: string) {
  assert.ok(baseUrl, 'MIV_TEST_BASE_URL must be set')

  const headers: any = {}
  if (cookie) {
    headers['Cookie'] = cookie
  }

  const response = await fetch(new URL(path, baseUrl), { headers })
  const body = await response.json()

  assert.equal(response.ok, true, `${path} returned ${response.status}: ${JSON.stringify(body)}`)
  return body
}

describe('development API smoke checks migrated from removed test pages', { skip: !runIntegrationTests }, () => {
  it('reads the main platform APIs used by the former test pages', async () => {
    // Log in as admin to read protected endpoints
    const adminCookie = await loginNextAuth('test.admin@miv.org', 'TestAdmin@123')
    assert.ok(adminCookie, 'Failed to log in for smoke tests')

    const ventures = await getJson('/api/ventures?limit=5', adminCookie)
    assert.ok(Array.isArray(ventures.ventures), 'ventures response should include ventures[]')

    const gedsiMetrics = await getJson('/api/gedsi-metrics?limit=5')
    assert.ok(Array.isArray(gedsiMetrics.metrics), 'GEDSI metrics response should include metrics[]')

    const irisMetrics = await getJson('/api/iris/metrics?limit=5')
    assert.ok(Array.isArray(irisMetrics.results), 'IRIS metrics response should include results[]')

    const notifications = await getJson('/api/notifications?limit=5', adminCookie)
    assert.ok(Array.isArray(notifications.notifications), 'notifications response should include notifications[]')

    const emailLogs = await getJson('/api/emails/logs?limit=5')
    assert.ok(Array.isArray(emailLogs.emailLogs), 'email logs response should include emailLogs[]')

    const users = await getJson('/api/users?limit=5')
    assert.ok(Array.isArray(users.users), 'users response should include users[]')
  })
})

