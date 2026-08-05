import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const baseUrl = process.env.MIV_TEST_BASE_URL || 'http://localhost:3000'
const runIntegrationTests = process.env.MIV_RUN_INTEGRATION_TESTS === 'true'

// Helper to log in to NextAuth using the CSRF dance
async function loginNextAuth(email: string, password: string): Promise<string> {
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

describe('VPMS Integration Security Gates Tests', { skip: !runIntegrationTests }, () => {
  let founderCookie = ''
  let adminCookie = ''

  // 1. Non-logged-in checks
  describe('Unauthenticated Access Control', () => {
    it('blocks access to ventures listing for anonymous users', async () => {
      const res = await fetch(new URL('/api/ventures', baseUrl))
      assert.equal(res.status, 401, 'Anonymous request to /api/ventures must return 401')
    })

    it('blocks access to analytics for anonymous users', async () => {
      const res = await fetch(new URL('/api/analytics', baseUrl))
      assert.equal(res.status, 401, 'Anonymous request to /api/analytics must return 401')
    })

    it('blocks access to custom dashboards for anonymous users', async () => {
      const res = await fetch(new URL('/api/custom-dashboards', baseUrl))
      assert.equal(res.status, 401, 'Anonymous request to /api/custom-dashboards must return 401')
    })

    it('blocks access to notifications for anonymous users', async () => {
      const res = await fetch(new URL('/api/notifications', baseUrl))
      assert.equal(res.status, 401, 'Anonymous request to /api/notifications must return 401')
    })
  })

  // 2. Founder (USER role) login and capabilities
  describe('Founder Access Controls', () => {
    it('logs in successfully with founder credentials', async () => {
      founderCookie = await loginNextAuth('test.user@miv.org', 'TestUser@123')
      assert.ok(founderCookie.includes('next-auth.session-token'), 'Should receive next-auth session token cookie')
    })

    it('denies founder access to staff analytics (returns 403)', async () => {
      const res = await fetch(new URL('/api/analytics', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      assert.equal(res.status, 403, 'Founder should be blocked with 403 from staff analytics')
    })

    it('denies founder access to custom dashboards (returns 403)', async () => {
      const res = await fetch(new URL('/api/custom-dashboards', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      assert.equal(res.status, 403, 'Founder should be blocked with 403 from custom dashboards')
    })

    it('scopes venture retrieval to own ventures only', async () => {
      const res = await fetch(new URL('/api/ventures', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      assert.equal(res.status, 200)
      const data = await res.json()
      
      assert.ok(Array.isArray(data.ventures), 'Response should contain ventures array')
      
      // Get current user profile to verify creator ID
      const meRes = await fetch(new URL('/api/users', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      const meData = await meRes.json()
      const userId = meData.user?.id

      if (userId) {
        for (const venture of data.ventures) {
          assert.equal(venture.createdById, userId, `Venture ${venture.id} belongs to a different user!`)
        }
      }
    })

    it('scopes notifications retrieval to own notifications only', async () => {
      const res = await fetch(new URL('/api/notifications', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      assert.equal(res.status, 200)
      const data = await res.json()

      assert.ok(Array.isArray(data.notifications), 'Response should contain notifications array')

      const meRes = await fetch(new URL('/api/users', baseUrl), {
        headers: { Cookie: founderCookie }
      })
      const meData = await meRes.json()
      const userId = meData.user?.id

      if (userId) {
        for (const notification of data.notifications) {
          assert.equal(notification.userId, userId, `Notification ${notification.id} belongs to a different user!`)
        }
      }
    })
  })

  // 3. Admin/Staff role login and capabilities
  describe('Admin/Staff Access Controls', () => {
    it('logs in successfully with admin credentials', async () => {
      adminCookie = await loginNextAuth('test.admin@miv.org', 'TestAdmin@123')
      assert.ok(adminCookie.includes('next-auth.session-token'), 'Should receive next-auth session token cookie')
    })

    it('allows admin access to staff analytics', async () => {
      const res = await fetch(new URL('/api/analytics', baseUrl), {
        headers: { Cookie: adminCookie }
      })
      assert.equal(res.status, 200, 'Admin must be allowed to access analytics')
    })

    it('allows admin access to custom dashboards', async () => {
      const res = await fetch(new URL('/api/custom-dashboards', baseUrl), {
        headers: { Cookie: adminCookie }
      })
      assert.equal(res.status, 200, 'Admin must be allowed to access custom dashboards')
    })
  })

  // 4. Logout endpoint
  describe('Logout Operation', () => {
    it('successfully calls DELETE on /backend/api/auth/login to destroy session', async () => {
      const res = await fetch(new URL('/backend/api/auth/login', baseUrl), {
        method: 'DELETE',
        headers: { Cookie: founderCookie }
      })
      // Should clear credentials/cookie
      assert.equal(res.status, 200, 'Logout DELETE request should respond with 200')
    })
  })
})
