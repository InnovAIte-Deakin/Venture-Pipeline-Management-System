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

// Helper to log in to the backend Payload CMS directly
async function loginBackend(email: string, password: string): Promise<string> {
  const loginRes = await fetch(new URL('/backend/api/auth/login', baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  
  const cookies = loginRes.headers.getSetCookie()
  const tokenCookie = cookies.find(c => c.includes('payload-token')) || ''
  const match = tokenCookie.match(/(payload-token=[^;]+)/)
  return match ? match[1] : ''
}

describe('VPMS Integration Security Gates Tests', { skip: !runIntegrationTests }, () => {
  let founderCookie = ''
  let adminCookie = ''
  let backendFounderCookie = ''
  let backendAdminCookie = ''

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

    // Backend unauthenticated checks
    it('blocks access to backend uploads signed-url for anonymous users', async () => {
      const res = await fetch(new URL('/backend/api/uploads/signed-url', baseUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'test.pdf', contentType: 'application/pdf', size: 1000 })
      })
      assert.equal(res.status, 401)
    })

    it('blocks access to backend ventures summary for anonymous users', async () => {
      const res = await fetch(new URL('/backend/api/ventures/nonexistentid/summary', baseUrl))
      assert.equal(res.status, 401)
    })

    it('blocks access to backend intake status for anonymous users', async () => {
      const res = await fetch(new URL('/backend/api/intake/submit?id=nonexistentid', baseUrl))
      assert.equal(res.status, 401)
    })
  })

  // 2. Founder (USER role) login and capabilities
  describe('Founder Access Controls', () => {
    it('logs in successfully with founder credentials', async () => {
      founderCookie = await loginNextAuth('test.user@miv.org', 'TestUser@123')
      assert.ok(founderCookie.includes('next-auth.session-token'), 'Should receive next-auth session token cookie')
      
      // Also log in to backend to test backend endpoints directly
      backendFounderCookie = await loginBackend('founder@example.com', 'changeme123')
      assert.ok(backendFounderCookie.includes('payload-token'), 'Should receive payload-token cookie')
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

    // Backend founder role checks
    it('allows founder to access backend uploads signed-url', async () => {
      const res = await fetch(new URL('/backend/api/uploads/signed-url', baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': backendFounderCookie
        },
        body: JSON.stringify({ fileName: 'test.pdf', contentType: 'application/pdf', size: 1000 })
      })
      assert.equal(res.status, 200)
      const data = await res.json()
      assert.ok(data.url, 'Should return signed URL')
    })

    it('denies founder access to a random venture summary', async () => {
      const res = await fetch(new URL('/backend/api/ventures/nonexistentid/summary', baseUrl), {
        headers: { Cookie: backendFounderCookie }
      })
      // Should either be 403 (if security check rejects them before checking ID) or 404 (if ID not found).
      assert.ok(res.status === 403 || res.status === 404)
    })

    it('denies founder access to a random intake status', async () => {
      const res = await fetch(new URL('/backend/api/intake/submit?id=65809794dbcd4f014e7a6344', baseUrl), {
        headers: { Cookie: backendFounderCookie }
      })
      // Should be 403 or 404 depending on existence. Let's make sure it is not 401 or 200.
      assert.ok(res.status === 403 || res.status === 404)
    })
  })

  // 3. Admin/Staff role login and capabilities
  describe('Admin/Staff Access Controls', () => {
    it('logs in successfully with admin credentials', async () => {
      adminCookie = await loginNextAuth('test.admin@miv.org', 'TestAdmin@123')
      assert.ok(adminCookie.includes('next-auth.session-token'), 'Should receive next-auth session token cookie')

      backendAdminCookie = await loginBackend('admin@example.com', 'changeme123')
      assert.ok(backendAdminCookie.includes('payload-token'), 'Should receive payload-token cookie')
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

    // Backend admin checks
    it('allows admin to query random venture summary (returns 404 instead of 403)', async () => {
      const res = await fetch(new URL('/backend/api/ventures/65809794dbcd4f014e7a6344', baseUrl), {
        headers: { Cookie: backendAdminCookie }
      })
      // Admins are not forbidden (no 403), they just get 404 because the ID is random/nonexistent.
      assert.equal(res.status, 404)
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
