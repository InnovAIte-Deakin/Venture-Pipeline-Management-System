# RBAC Matrix — Canonical Roles × Collections × Fields × Routes

**Status: DRAFT — for the sprint review** (close with June + Satya; role mapping settled in the same sitting).
Canonical role list: [`roles.json`](./roles.json) — one file, both apps must reference it.

- **Audited against:** `origin/main @ f3297d1` (**#57** — "Fix/middleware to proxy…"). Supersedes the 2026-07-23 draft, which read `#32` off disk and predated Kent's #57.
- Release order: **Founder → Admin → MIV Analyst** (per cleanup register).
- **Mentor / Investor: DEFERRED** — rows included so the omission is explicit. No dashboards, no access, no UI until formally documented and approved.
- **Downstream:** feeds #10 (roles × collections × fields), and is the named dependency of #33 (Protect fields) and #35 (Field-level rules). #28 hands this to the Documentation leads in Week 4 (10–16 Aug) — whatever this says then goes into the User Guide and Developer Guide.

---

## ⚠️ 0. Scope — read this before the tables

**§2 documents DECLARED collection access, which governs only (a) the Payload admin panel and (b) the auto-generated REST API. It is NOT what the application enforces.**

Every one of the ~17 backend route handlers reaches Payload through the **Local API** (`getPayload(...)` → `payload.find/create/update`), which defaults to **`overrideAccess: true`**. The string `overrideAccess` appears **nowhere** in `miv-backend/src`, so the access blocks in §2 **do not run for any traffic the app itself generates**. Role enforcement for app traffic lives (or must live) in the route handlers — see §3.

So: §2 = admin-panel/REST surface. §3 = the real app surface. #35 ("every collection **and route**") is only half-specified until §3 is filled in.

---

## 1. Canonical roles

| Canonical value | Label | Status | Backend (Payload) today | Frontend (Prisma) today |
|---|---|---|---|---|
| `founder` | Founder | active — 1st | `founder` (default) | **none — see blocker** |
| `admin` | Admin | active — 2nd | `admin` | `ADMIN` |
| `miv_analyst` | MIV Analyst | active — 3rd | `miv_analyst` | `ANALYST` |
| `mentor` | Mentor | **DEFERRED — do not build** | — | — |
| `investor` | Investor | **DEFERRED — do not build** | — | — |

**Two "—" cells in `roles.json` are blockers, not adoption wiring:**
- **`founder` has no Prisma `UserRole` value at all**, and it is release #1. Shipping it needs a scheduled **schema + data migration**, not just wiring.
- **`user` is not free to delete.** `miv/app/auth/login/page.tsx` still branches on `role === 'user'` to choose the landing page. #57 fixed the target (both `user` and `founder` → `/user-dashboard`), but the branch still reads the value, so the mapping decision **changes routing for real users** — settle the redirect rule with the mapping.

**Legacy roles are load-bearing, not decorative** (decision required at review — map or delete, with data migration):
- Backend Payload select: `user`.
- Frontend Prisma enum: `MANAGER`, `USER`, `VENTURE_MANAGER`, `GEDSI_ANALYST`, `CAPITAL_FACILITATOR`, `EXTERNAL_STAKEHOLDER`. Seeded users hold `MANAGER` and `VENTURE_MANAGER`.
- `VENTURE_MANAGER` / `GEDSI_ANALYST` / `CAPITAL_FACILITATOR` gate email body content (~10 conditionals in `emails/stg-reminder` + `weekly-update`), and `team/members` hardcodes all 8 values in a Zod enum with an assignment UI. **Renaming to snake_case is a behaviour change in those routes, not a cleanup.**

---

## 2. Declared collection access (admin panel + generated REST API only)

Legend: ✅ full · 🔒 scoped (own records only) · 🚫 **none (bug — too restrictive)** · ❌ denied · 🌐 public (no login) · **DEF** deferred role (❌ everywhere until approved).

### users (auth)
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| admin-panel | ❌ | ✅ | ✅ | DEF | DEF | — |
| create | — | — | — | DEF | DEF | 🌐 ⚠️ A1 |
| read | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ ⚠️ A2 | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Field-level: `role` writable via analyst update → escalation (A2, and §4).

### ventures
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | — | — | — | DEF | DEF | 🌐 ⚠️ A3 |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ❌ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

`founders[]` array holds PII (email/phone) but **no `user` relationship** — this is why `founderOfVenture` fails (A4). `triageTrack`/`triageRationale`: staff-only (§4).

### founders
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ ⚠️ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Update rule is `role !== 'founder'` — **any non-founder, including legacy `user`, can update**.

### documents (upload)
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | 🔒 own | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ✅ | ✅ | DEF | DEF | ❌ |

**The correct row-level model** — returns a `Where` constraint on `uploadedBy`. Keep as the template for A4. Fields: `version`, `uploadedBy` readOnly (admin UI); `status`/`reviewedBy`/`reviewedAt` staff-only (§4).

### dataRoomFiles (upload)
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Financial/registration PDFs readable **and editable by every authenticated user**, any venture.

### agreements
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Any authenticated user can flip NDA/MOU `status` to signed/verified.

### onboardingIntakes
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | — | — | — | DEF | DEF | 🌐 (intake form — intentional) |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ ⚠️ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Update rule is `role !== 'founder'` — **same "any non-founder incl. legacy `user`" hole as `founders`, and this is where the disability data lives.** Highly sensitive fields: `wss.*` (Washington Short Set — **disability data**), `disabilityFlag`, `financials.*`, `gedsi.*`. Field-level lock required (§4).

### media (upload) — CORRECTED
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | 🚫 **none (bug)** | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ✅ | ✅ | DEF | DEF | ❌ |

**Correction (prev. mis-marked "🔒 own"):** unlike `documents`, `media.ts` reads `args.doc`, which Payload 3.49.1 does **not** pass to `read` (`AccessArgs` = `data, id, isReadingStaticFile, req`). So it evaluates `String(undefined) === userId` → **founders can read no media at all, including their own.** This is the only finding that is **too restrictive**; a matrix reporting it as "scoped/working" is what stops anyone looking (**A9**).

### system-settings (singleton collection)
| Op | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ❌ | ❌ | ✅ (singleton-guarded) | DEF | DEF | ❌ |
| read | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ❌ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Cleanest access model. (activityLogs: **fully immutable** — no update/delete via API, admin included; `actor` forced by hook; erasure is a DB-level procedure (§6.1) — A7. user-settings now owner-scoped — A5.)

### GLOBALS (were missing — `payload.config.ts` registers two)
| Global | read | update | create/delete | Flag |
|---|---|---|---|---|
| `settings` | 🌐 **public, no login** | any role `!== 'founder'` (incl. legacy `user`) | — | **A8** — legacy `user` can flip `enableESign` / `enableSlack` |
| `lookups` | 🌐 public, no login | admin only | — | Read is public; confirm intended |

---

## 3. Routes — the real enforcement surface (⚠️ TO BE SPECIFIED, #35)

Because of §0, this table is where app authorization actually lives. **Current state for every group below: no role gate in-handler (Local API `overrideAccess:true`).** Target R/W-per-role is TBD at review — this is the outstanding half of #35.

| Route group (miv frontend) | Example routes | Current enforcement | Target |
|---|---|---|---|
| g1-impact-analytics | analytics, calculations, gedsi-metrics, iris/metrics | none | TBD |
| g1-portfolio-funding | fund-management | none | TBD |
| g2-founder-documents | documents(+/{id}/upload/analytics), emails/stg-reminder, emails/weekly-update | none; emails branch on legacy enum | TBD |
| g2-founder-submission | add-venture-details | none | TBD |
| g3-venture-pipeline | ventures(+/{id}/gedsi) | none | TBD |
| g4-reporting-insights | ai/analyze-venture, ai/gedsi-insights, custom-dashboards | none | TBD |
| g5-platform-operations | team/members(+announcements/events/projects), calendar, workflows | none; team/members writes role via Zod enum(8) | TBD |
| g5-user-support-settings | users, users/me, users/ventures, session/login, notifications, search, auth/{id} | none | TBD |
| **Backend (miv-backend)** | auth/*, users, users/change-password, documents(+/{id}), intake/submit, reports/impact-users, system-settings/* | change-password verifies cookie; rest via Local API | TBD |

**Frontend route gate:** #57 **deleted `miv/middleware.ts`** and replaced it with `lib/dashboard-navigation.ts` (nav config, no auth). There is now **no middleware anywhere in `miv`** — nothing checks a cookie or role before a dashboard route renders (**A10**).

---

## 4. Field × role rules (closes #10 / #33 / #35)

Rows the field-level tickets need. `w` = writable, `r` = readable, `—` = no access.

| Collection.field | Sensitivity | founder | miv_analyst | admin | Note |
|---|---|---|---|---|---|
| `users.role` | Privilege | — | **must be `r` only** | w | Currently analyst-writable → escalation (A2) |
| `documents.status` | Workflow | r | w | w | Founder must not self-approve |
| `documents.reviewedBy` | Workflow | r | w | w | Set by reviewer, not uploader |
| `documents.reviewedAt` | Workflow | r | w | w | Set by reviewer, not uploader |
| `ventures.triageTrack` | Internal | — | w | w | Staff assessment; hide from founder |
| `ventures.triageRationale` | Internal | — | w | w | Staff assessment; hide from founder |
| `onboardingIntakes.wss.*` | **Disability** | w (create, via intake) | **—** | r/w | **Admin-only at row level** (decided round 2). Nothing consumes these at row level today; easier to widen later than claw back. Analyst access to be served by **aggregate reporting (counts/%), not field read** |
| `onboardingIntakes.disabilityFlag` | **Disability** | — | **—** | r/w | Derived; **admin-only at row level** — same rationale as `wss.*` |

---

## 5. `access/roles.ts` — helpers exist but are unused / broken

`miv-backend/src/access/roles.ts` already defines `isAdmin`, `isAnalyst`, `adminOrAnalyst`, `selfOrAdminAccess`, `founderOfVenture`. **Nothing imports them.** Do not "just wire them in":

- **`founderOfVenture` is broken.** It maps `venture.founders[].user`, but `ventures.ts` defines that array as `email, role, phone, fullName` — **no `user` field**. So the mapped list is always empty and it **denies every founder**. Fix path (review decision): either add a `user` relationship to the ventures `founders` array, or scope through the `founders` collection (which *does* carry a `user` relationship).

---

## 6. Anomaly register

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| A1 | Review | `users.create` public (`anyone`), default role `founder` | Confirm; tie to `enableSignup` (unenforced) |
| A2 | High | `miv_analyst` can write `users.role` → escalation to admin | Field-level: `role` admin-write only (§4) |
| A3 | Review | `ventures.create` public | Confirm intake flow, else require auth |
| A4 | High | Founder reads **all** records (ventures, founders, dataRoomFiles, agreements, intakes, activityLogs) — cross-venture leakage incl. financials + disability data. `founderOfVenture` would fix it but is unused **and broken** (§5) | Add venture `user` relationship, then apply `documents`-style scoped `Where` |
| A5 | High | Any authenticated user can update dataRoomFiles, agreements, any user's user-settings | Restrict to analyst/admin; 🔒 owner for user-settings |
| A6 | **High** (was Low) | Prisma 8-role enum is **not decorative** — drives email content (~10 conditionals) and the `team/members` Zod enum + assignment UI. Snake_case migration is a behaviour change in those routes | Migrate data first, then codegen; audit email + team routes in the same PR (§7) |
| A7 | Resolved | `activityLogs` chosen **fully immutable** — no update/delete via the API, admin included; `actor` forced by hook | Erasure is a documented DB-level procedure (§6.1), not an admin button. Rule: **no personal data in `metadata`** |
| A8 | High | Global `settings`: `read` is **public (no login)**; `update` is any role `!== 'founder'` → legacy `user` flips `enableESign`/`enableSlack` | Gate read to auth; restrict update to admin |
| A9 | Medium | `media` founder read is **broken/too-restrictive** (reads `args.doc`, not passed in 3.49.1) → founders see no media incl. own | Use the `documents` `Where`-constraint pattern |
| A10 | High | **No frontend route gate** — #57 deleted `miv/middleware.ts`; nothing checks cookie/role before dashboards render | Re-introduce route protection as part of frontend adoption |

### 6.1 Audit-log erasure procedure (`activityLogs`)

`activityLogs` is **immutable through the API** — no update or delete, admin included. This is deliberate: an audit trail an admin can quietly alter or remove is not an audit trail, and the actor-forcing hook only has value if entries can't be edited after the fact.

Erasure is therefore a **manual, database-level procedure**, not a feature — used only for a lawful right-to-erasure request that touches data captured in a log:

- **Who:** a named database administrator (currently the platform owner), never through the running app.
- **Basis:** a documented request (e.g. GDPR/right-to-erasure) referencing the specific subject and records. No ad-hoc deletion.
- **How recorded:** the operation is logged out-of-band (ticket + change record: who ran it, when, which records, on what basis) so the erasure itself is auditable.

**Preventive rule (cheaper than erasure):** do **not** put personal data in `activityLogs.metadata`. It's unbounded/unschema'd and lives in a never-deleted collection, so a logged request body or error payload would strand PII — in a system that also stores disability data. Keep `metadata` to ids, enums and counts. Enforced by convention + the field comment; give it an explicit shape if that proves insufficient.

---

## 7. Adoption sequence (see `roles.json` → `adoption.orderedSequence`)

1. **Data migration first** — remap records off legacy values (`user`; Prisma `MANAGER`/`VENTURE_MANAGER` seeds). Do this before anything reads the active list.
2. **Settle the login redirect rule** with the `user` mapping decision (#57 routes `user`+`founder` → `/user-dashboard`).
3. **Codegen second** — generate backend select from active roles; migrate Prisma enum to snake_case; audit the email + `team/members` routes that read the old values.
4. **Re-introduce a frontend route gate** (A10).
5. **Add route-handler enforcement** (§0/§3) — the collection matrix does not protect app traffic.

*Notes:* `resolveJsonModule` is already `true` in both tsconfigs, so the JSON import compiles. **Hold the CI role-lint check** — `.github/workflows` has only `sync-upstream.yml` (cron); the real pipeline is #56 (red). Nothing to attach it to yet.

---

## 8. Ticket / checklist mapping

| Item | Where | Status |
|---|---|---|
| One canonical role list | [`roles.json`](./roles.json) | Drafted; blocked on mapping decision + founder/user blockers (§1) |
| Collections | §2 (11 collections + 2 globals) | Done |
| **Routes** (#35 other half) | §3 | **Scaffolded, R/W TBD at review** |
| **Fields** (#10 / #33 / #35) | §4 | Drafted for the named fields |
| Mark read/write per role | §2 + §4 | Done (declared) |
| Mentor/Investor deferred | DEF column throughout + `roles.json` | Done |
| Review (June + Satya) | sprint review | Mapping + redirect rule to be settled; feeds #28 Week-4 (10–16 Aug) handoff to Docs leads |
