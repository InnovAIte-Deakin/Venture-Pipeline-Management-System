import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { seedRbacUsers } from '../lib/seed-rbac-users'

const run = async () => {
  process.env.PAYLOAD_DISABLE_DEFAULT_USER_SEED = 'true'

  const payload = await getPayload({ config })

  await seedRbacUsers(payload)

  payload.logger.info('[seed-rbac-users] Completed RBAC test user seeding.')
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('[seed-rbac-users] Failed to seed RBAC test users.', error)
    process.exit(1)
  })
