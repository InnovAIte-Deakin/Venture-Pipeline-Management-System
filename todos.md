## Developer Tasks

See [TASKS.md](./TASKS.md) for the full task list with descriptions, files, steps, and acceptance criteria.

---

## Vercel

### Current Issues
- [T1] /admin styling is broken on Vercel
- [T2] Required Vercel env vars need to be verified and documented (incl. NEXTAUTH_URL)
- [T3] Silent TS/ESLint errors in next.config.mjs (ignoreBuildErrors, ignoreDuringBuilds)
- [T4] prisma migrate deploy in build command needs a safer strategy
- [T5] ⚠️ Seed root admin from env vars — hardcoded credentials in payload.config.ts onInit
- [T6] ⚠️ Remove admin123 bypass and hardcoded auth fallbacks

### Config
- [T5] Seed root admin user from GH repo / Vercel env

### Local development
- [T7] vercel-cheatsheet.md — fill out Local Dev Guide, Working with Vercel, and Deploy to Own Account sections

### Documentation
- [T7] vercel-cheatsheet.md is empty — needs CLI commands, env setup, and deployment steps

---

## Project Restructuring

- [T8]      Fix legacy /backend/api/users route in useAuth hook
- [T9]      Re-enable intake notification emails (disabled in hooks/intakes.ts)
- [T10]     Fix IRIS catalog seed path bug (lib/ vs src/lib/)
- [T11]     Add CI/CD pipeline — build + lint + test on push (depends on T3)
- [T12]     Add unit/integration tests for email service and auth
- [T13]     Evaluate dual-database architecture (MongoDB + PostgreSQL) — research/ADR only
- [T14]     Update and clean up README and docs/ (remove old /miv monorepo references)