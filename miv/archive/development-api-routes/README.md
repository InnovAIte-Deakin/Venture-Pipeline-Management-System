# Archived Development API Routes

These files were removed from `miv/app/api` because they exposed development-only seed, smoke-test, and password-reset behavior as public Next.js API routes.

They must not be used in production and are excluded from TypeScript compilation. Keep them only as historical reference while converting any still-needed behavior into explicit CLI scripts or automated tests.

Current replacements:

- Password reset for development users: `npm run dev:set-password -- --email user@example.com --password new-password`
- Read-only API smoke checks: `npm run test:integration` with `MIV_RUN_INTEGRATION_TESTS=true` and `MIV_TEST_BASE_URL` set
- General database seeding: prefer the existing Prisma seed scripts in `miv/prisma/`

Logic still requiring future conversion if it remains useful:

- Comprehensive sample data setup from `seed-comprehensive-data.route.ts`
- GEDSI sample metric setup from `seed-gedsi-metrics.route.ts` and `seed-gedsi-portfolio.route.ts`
- Workflow demo data setup from `seed-workflows.route.ts`
- Sarah analytics demo setup from `seed-sarah-analytics.route.ts`
- Sprint 2 mutating email/integration checks from `test-sprint2.route.ts`
