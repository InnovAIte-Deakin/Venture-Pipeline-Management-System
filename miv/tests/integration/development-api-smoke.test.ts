import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const baseUrl = process.env.MIV_TEST_BASE_URL
const runIntegrationTests = process.env.MIV_RUN_INTEGRATION_TESTS === 'true'

async function getJson(path: string) {
  assert.ok(baseUrl, 'MIV_TEST_BASE_URL must be set')

  const response = await fetch(new URL(path, baseUrl))
  const body = await response.json()

  assert.equal(response.ok, true, `${path} returned ${response.status}: ${JSON.stringify(body)}`)
  return body
}

describe('development API smoke checks migrated from removed test pages', { skip: !runIntegrationTests }, () => {
  it('reads the main platform APIs used by the former test pages', async () => {
    const ventures = await getJson('/api/ventures?limit=5')
    assert.ok(Array.isArray(ventures.ventures), 'ventures response should include ventures[]')

    const gedsiMetrics = await getJson('/api/gedsi-metrics?limit=5')
    assert.ok(Array.isArray(gedsiMetrics.metrics), 'GEDSI metrics response should include metrics[]')

    const irisMetrics = await getJson('/api/iris/metrics?limit=5')
    assert.ok(Array.isArray(irisMetrics.results), 'IRIS metrics response should include results[]')

    const notifications = await getJson('/api/notifications?limit=5')
    assert.ok(Array.isArray(notifications.notifications), 'notifications response should include notifications[]')

    const emailLogs = await getJson('/api/emails/logs?limit=5')
    assert.ok(Array.isArray(emailLogs.emailLogs), 'email logs response should include emailLogs[]')

    const users = await getJson('/api/users?limit=5')
    assert.ok(Array.isArray(users.users), 'users response should include users[]')
  })
})
