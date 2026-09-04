\# VPMS — Canonical Environment Setup Guide



This is the single source of truth for setting up VPMS locally. If other setup instructions elsewhere in the repo (README.md, INTERNAL\_DEV\_GUIDE.md, SEED\_NOTES.md) conflict with this, \*\*this file wins\*\* — those should be updated to point here rather than duplicating instructions.



\---



\## Prerequisites — read this first



\- \*\*Docker Desktop\*\*, installed and \*running\* before you do anything else. VPMS's backend depends on Docker (MongoDB, PostgreSQL, and Payload CMS all run as containers). Skipping this is the single most common cause of "nothing works."

\- \*\*Node.js\*\* (LTS) and \*\*npm\*\* for the frontend (`miv`)

\- \*\*pnpm\*\* for the backend (`miv-backend`) — note the two apps use \*different\* package managers. This is intentional, not a mistake: `miv` is npm, `miv-backend` is pnpm, each declares this explicitly in its own `package.json` (`packageManager` field).

\- \*\*Git\*\*



If you're on native Windows, `npm i` in `miv` can fail trying to install `lightningcss-linux-x64-gnu`, a Linux-only binary pulled in through the Tailwind/PostCSS toolchain — platform detection isn't working right in this repo currently. Easiest fix: do your dev work in WSL2. Otherwise, delete `node\_modules`/`package-lock.json` and run `npm i --no-optional`.



\---



\## Step 1 — Clone



```bash

git clone https://github.com/InnovAIte-Deakin/Venture-Pipeline-Management-System.git

cd Venture-Pipeline-Management-System

```



`.env` files for both apps are already committed to the repo, so no manual copying from `.env.example` is needed for local dev.



\---



\## Step 2 — Start the backend



```bash

cd miv-backend

docker compose up -d --build

```



This starts four containers: `mongo`, `mongo-express`, `postgres`, and `payload-cms`. First run will take a few minutes (fresh dependency install inside the container). Subsequent runs are much faster.



Confirm all four are up:

```bash

docker compose ps

```

All should show `Running` or `Started`.



The backend serves on \*\*`http://localhost:3001`\*\* (Payload admin at `/admin`). This port is pinned explicitly in `miv-backend/package.json`'s `dev` script — don't remove the `-p 3001` flag, and if you ever change it, `docker-compose.yml`'s port mapping must be updated to match, or the container becomes unreachable with no clear error (learned this the hard way).



\---



\## Step 3 — Start the frontend



In a separate terminal:



```bash

cd miv

npm install

npm run dev

```



Frontend serves on \*\*`http://localhost:3000`\*\*. Requests to `/backend/\*` are automatically proxied to the backend (see `miv/next.config.ts`) — this is how the frontend talks to Payload without CORS issues in dev.



\---



\## Step 4 — Log in



The backend seeds these accounts automatically on first startup (and stays idempotent on every restart — it won't duplicate them):



| Role | Email | Password |

|---|---|---|

| Admin | `admin@example.com` | `changeme123` |

| Founder | `founder@example.com` | `changeme123` |

| Analyst | `analyst@example.com` | `changeme123` |



The founder account also gets 4 sample documents seeded automatically, one at each review status (approved, pending review, rejected, needs revision) — useful for testing document workflows without hand-building test data.



\*\*Do not use\*\* any `venture.manager@miv.org` credentials mentioned elsewhere in older docs — that account is not actually seeded, regardless of what the seed output implies. Use the table above.



\---



\## Useful URLs



| What | URL |

|---|---|

| Frontend | http://localhost:3000 |

| Backend / Payload Admin | http://localhost:3001/admin |

| MongoDB UI (mongo-express) | http://localhost:8081 |



\---



\## Stopping everything



```bash

\# Backend

cd miv-backend

docker compose down



\# Add -v to also wipe the database (fresh start next time)

docker compose down -v



\# Frontend: just Ctrl+C the npm run dev terminal

```



\---



\## Troubleshooting



See `miv-backend/SEED\_NOTES.md` for seed-specific details, and the version history in `docs/adr/` for why certain dependency versions are pinned the way they are (e.g. Next.js 15.4.11, not 16 — see `ADR-nextjs-version-split.md`).



If you hit an error not covered here, check git blame / recent commits on this file first — several real bugs (port mismatches, missing Prisma client generation, stale build caches) have already been found and fixed, and are worth ruling out before assuming your environment is broken.



\---



\*This guide supersedes the setup sections in README.md and INTERNAL\_DEV\_GUIDE.md. Those files should link here rather than duplicating these steps.\*

