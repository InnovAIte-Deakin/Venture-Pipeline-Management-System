# Vercel Deployment Setup (miv)

## Production Mode
The app supports two backend integration modes:

- `internal`: Use local compatibility endpoints under `/backend/api/*` in this same app.
- `external`: Proxy `/backend/*` to a separate backend URL.

For Vercel deployment of `miv` only, use `internal`.

## Required Vercel Environment Variables
Set these in Vercel Project Settings -> Environment Variables:

- `DATABASE_URL`: Postgres connection string
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: Production URL, for example `https://your-app.vercel.app`
- `BACKEND_INTEGRATION_MODE`: `internal`

Optional:

- `NEXT_PUBLIC_BACKEND_URL`: Only needed if using `external` mode
- `PUBLIC_BACKEND_URL`: Only needed if using `external` mode
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_AI_API_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`

## Build Checks Before Deploy
Run locally from `miv`:

```bash
pnpm install
pnpm build
```

If build succeeds locally, Vercel build should use the same settings.

## Notes
- On Vercel, backend mode defaults to `internal` if `BACKEND_INTEGRATION_MODE` is not set.
- Keep `BACKEND_INTEGRATION_MODE=external` only when intentionally using a separate backend service.
