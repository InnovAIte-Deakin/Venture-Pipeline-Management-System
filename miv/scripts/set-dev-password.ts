#!/usr/bin/env npx tsx

import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

function readArg(name: string) {
  const index = process.argv.indexOf(name)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to change passwords while NODE_ENV=production')
  }

  const email = readArg('--email')
  const password = readArg('--password')

  if (!email || !password) {
    console.log('Usage: npx tsx scripts/set-dev-password.ts --email user@example.com --password new-password')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error(`No user found for ${email}`)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  console.log(`Updated development password for ${email}`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
