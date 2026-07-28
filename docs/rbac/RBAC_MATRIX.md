# RBAC Matrix — Canonical Roles × Payload Collections

**Status: DRAFT — pending review with June + PO** (checklist item 5).
Canonical role list: [`roles.json`](./roles.json) — one file, both apps must reference it.

This matrix documents **current enforced behaviour** as read from `miv-backend/src/collections/*.ts` on the audit date, plus flagged anomalies. It is the baseline for the review: every cell is "confirm or change", not "invent".

- Audit date: 2026-07-23
- Release order: **Founder → Admin → MIV Analyst** (per cleanup register)
- **Mentor / Investor: DEFERRED** — rows included below so the omission is explicit. No dashboards, no access, no UI for these roles until their permissions are formally documented and approved.

---

## 1. Canonical roles

| Canonical value | Label | Status | Today in backend (Payload) | Today in frontend (Prisma) |
|---|---|---|---|---|
| `founder` | Founder | active — release 1st | `founder` (default) | — none |
| `admin` | Admin | active — release 2nd | `admin` | `ADMIN` |
| `miv_analyst` | MIV Analyst | active — release 3rd | `miv_analyst` | `ANALYST` |
| `mentor` | Mentor | **DEFERRED — do not build** | — | — |
| `investor` | Investor | **DEFERRED — do not build** | — | — |

**Unresolved legacy roles (decision required at review):**
- Backend: `user` (exists in the Payload select; unused semantics)
- Frontend Prisma enum: `MANAGER`, `USER`, `VENTURE_MANAGER`, `GEDSI_ANALYST`, `CAPITAL_FACILITATOR`, `EXTERNAL_STAKEHOLDER` — each must be mapped to a canonical role or deleted (with data migration). Seeded users currently hold `MANAGER` and `VENTURE_MANAGER`.

---

## 2. Collections × operations matrix

Legend: ✅ full · 🔒 scoped (own records only) · ❌ denied · 🌐 public (no login required) · **DEF** deferred role — must be ❌ everywhere until approved.

### users (auth collection)
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| admin-panel access | ❌ | ✅ | ✅ | DEF | DEF | — |
| create | — | — | — | DEF | DEF | 🌐 ⚠️ A1 |
| read | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ ⚠️ A2 | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Protected fields: `role` (privilege escalation vector — see A2), `email` (auth identity), password hash (managed by Payload `auth: true`).

### ventures
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | — | — | — | DEF | DEF | 🌐 ⚠️ A3 |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ❌ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Sensitive fields: `founders[]` (PII: email/phone), `triageTrack`, `triageRationale` (internal assessment — arguably should be hidden from founders; flag for review).

### founders
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Note: update rule is `role !== 'founder'` — any non-founder role (including legacy `user`) can update. Sensitive fields: `email`, `phone` (PII).

### documents (upload)
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | 🔒 own uploads | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ✅ | ✅ | DEF | DEF | ❌ |

Best row-level model in the codebase (query constraint on `uploadedBy`). Read-only fields enforced in admin UI only: `version`, `uploadedBy` (set by hook). Sensitive: financial statements, legal docs.

### dataRoomFiles (upload)
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Financial/registration PDFs readable and **editable by every authenticated user** regardless of venture. Highest-priority gap.

### agreements
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Any authenticated user can flip NDA/MOU `status` (e.g. mark "signed"/"verified"). Should be analyst/admin + provider webhook only.

### onboardingIntakes
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | — | — | — | DEF | DEF | 🌐 (intake form — intentional) |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Highly sensitive fields: `wss.*` (Washington Short Set — **disability data**), `disabilityFlag`, `financials.*`, `gedsi.*`, founder PII. Field-level restriction strongly recommended: WSS/disability data should be limited to admin (+ possibly gedsi-scoped analyst) even if record-level read stays broader.

### media (upload)
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | 🔒 own uploads | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ✅ | ✅ | DEF | DEF | ❌ |

`uploader` set by hook, readOnly in admin UI.

### activityLogs
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A4 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ (immutable) | ❌ | ❌ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ ⚠️ | DEF | DEF | ❌ |

Immutable-by-design (good). ⚠️ admin delete undermines audit integrity — consider ❌ for everyone.

### user-settings
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| read | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| update | ✅ ⚠️ A5 | ✅ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

⚠️ Any user can read/update **any other user's** settings (no ownership constraint despite `unique: true` per user). Should be 🔒 own record.

### system-settings (singleton)
| Operation | founder | miv_analyst | admin | mentor | investor | Public |
|---|---|---|---|---|---|---|
| create | ❌ | ❌ | ✅ (singleton-guarded) | DEF | DEF | ❌ |
| read | ✅ | ✅ | ✅ | DEF | DEF | ❌ |
| update | ❌ | ❌ | ✅ | DEF | DEF | ❌ |
| delete | ❌ | ❌ | ✅ | DEF | DEF | ❌ |

Cleanest access model in the codebase. Sensitive fields: `enableSignup`, `sessionTimeoutMinutes`, `maxUploadMB`, `allowedMimeTypes`.

---

## 3. Anomaly register (inputs to the review)

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| A1 | Review | `users.create` is public (`anyone`) — open self-signup, default role `founder`. | Confirm intentional; tie to `system-settings.enableSignup` flag which currently isn't enforced. |
| A2 | High | `miv_analyst` can update `users`, including the `role` field → **self/peer escalation to admin**. | Field-level access on `role`: admin-only write. |
| A3 | Review | `ventures.create` is public (`() => true`). | Likely intake flow; confirm, else require auth. |
| A4 | High | Founder can read **all** records in ventures, founders, dataRoomFiles, agreements, onboardingIntakes, activityLogs — cross-venture data leakage incl. other ventures' financials and disability data. | Apply `documents`-style scoped query constraints per venture relationship before Founder release. |
| A5 | High | Any authenticated user can update dataRoomFiles, agreements, and any user's user-settings. | Restrict to analyst/admin (or 🔒 owner for user-settings). |
| A6 | Medium | Frontend (Prisma/NextAuth) role checks are minimal; its 8-role enum is largely decorative and disjoint from backend enforcement. | Adopt canonical roles in Prisma, enforce in API routes/middleware as part of Founder→Admin→Analyst rollout. |
| A7 | Low | `activityLogs` deletable by admin. | Consider immutable for all (audit trail). |

---

## 4. Checklist mapping

1. **One canonical role list** → [`roles.json`](./roles.json) published; adoption wiring documented inside it. Blocked-on-review: mapping/deletion of 7 legacy roles.
2. **List collections/fields** → §2 (all 11 collections; sensitive/protected fields called out per table).
3. **Read/write per role** → §2 matrices (current behaviour) + §3 recommendations.
4. **Mentor/Investor deferred** → explicit DEF column in every table; `status: "DEFERRED"` + "DO NOT BUILD" in `roles.json`.
5. **Review with June + PO** → open items: legacy-role mapping, A1–A7, field-level rules for `users.role`, `triage*`, and WSS/disability data.
