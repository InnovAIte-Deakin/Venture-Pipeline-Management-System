Seed:

- Prisma seed is run with `pnpm run db:seed`.
- Verified working local command:

```powershell
$env:DATABASE_URL="postgresql://app_miv:supersecret@localhost:5432/app_miv?schema=public"; pnpm run db:seed
```

- Successful seed output created users plus sample ventures including `GreenTech Solutions`, `EcoFarm Vietnam`, and `TechStart Cambodia`.
- Current seed warning: IRIS catalog JSON lookup is using `lib/iris-catalog.json`, while the repository file exists at `src/lib/iris-catalog.json`.

Env vars:

- `PAYLOAD_SECRET` and `DATABASE_URI` are required for Payload CMS.
- `DATABASE_URL` is required for Prisma commands and relational seeding.
- `SLACK_WEBHOOK_URL` optional (mock only).
- `ESIGN_PROVIDER_API_KEY` optional (mock only).
