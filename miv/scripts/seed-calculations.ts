#!/usr/bin/env npx tsx

import { CalculationService } from '../lib/calculation-service'
import { prisma } from '../lib/prisma'

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Refusing to seed calculations in production without ALLOW_PRODUCTION_SEED=true')
  }

  console.log('Starting calculation seeding for all ventures...')
  await CalculationService.updateAllVentureCalculations()

  const portfolioMetrics = await CalculationService.getPortfolioMetrics()
  console.log('Calculation seeding completed successfully')
  console.log(JSON.stringify(portfolioMetrics, null, 2))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
