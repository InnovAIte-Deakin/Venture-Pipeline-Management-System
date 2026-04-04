import type { Payload } from 'payload'

type SeedUser = {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'admin' | 'miv_analyst' | 'founder'
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin1@test.com',
    password: 'changeme123',
    first_name: 'Admin',
    last_name: 'One',
    role: 'admin',
  },
  {
    email: 'analyst1@test.com',
    password: 'changeme123',
    first_name: 'Analyst',
    last_name: 'One',
    role: 'miv_analyst',
  },
  {
    email: 'founder1@test.com',
    password: 'changeme123',
    first_name: 'Founder',
    last_name: 'One',
    role: 'founder',
  },
]

export const seedRbacUsers = async (payload: Payload) => {
  for (const user of seedUsers) {
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: user.email,
        },
      },
      limit: 1,
    })

    if (existingUser.totalDocs > 0) {
      const existingRole = existingUser.docs[0]?.role
      const roleSuffix =
        existingRole && existingRole !== user.role
          ? `, current role: ${existingRole}`
          : ''

      payload.logger.info(
        `[seed-rbac-users] Existing user: ${user.email} (${user.role}${roleSuffix})`,
      )
      continue
    }

    await payload.create({
      collection: 'users',
      data: user,
    })

    payload.logger.info(
      `[seed-rbac-users] Created user: ${user.email} (${user.role})`,
    )
  }
}
