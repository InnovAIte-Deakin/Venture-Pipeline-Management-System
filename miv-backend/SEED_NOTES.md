Seed:
- On first run (and on every startup, idempotently), the following accounts are created if they don't already exist:
  - Admin: admin@example.com / changeme123
  - Founder: founder@example.com / changeme123
  - Analyst (miv_analyst): analyst@example.com / changeme123
- The founder account also gets 4 sample documents seeded, one at each status: approved, pending_review, rejected, needs_revision.
- Seeding logic lives in src/payload.config.ts (onInit hook). It checks for existing records by email (users) or filename (documents) before creating anything, so re-running/restarting never duplicates data.
- Run migration 001-lookups via Payload CLI or call Lookups global update.
Env vars:
- PAYLOAD_SECRET, DATABASE_URI required.
- SLACK_WEBHOOK_URL optional (mock only).
- ESIGN_PROVIDER_API_KEY optional (mock only).
