# RBAC API-Level Enforcement — Implementation Plan

**Ticket:** Enforce RBAC at API level per matrix (T2 flagship security deliverable).
**Status:** PLAN — for sign-off at the sprint review (June + Satya). No enforcement code written yet.
**Base:** `main @ 8ca72b8` (#59 matrix + #57 code).
**Spec:** [`RBAC_MATRIX.md`](./RBAC_MATRIX.md) · [`roles.json`](./roles.json).

---

## 0. Chosen approach (locked)

**`overrideAccess: false` + harden the collection/field access rules**, so the matrix rules become the **single enforcement point** for the admin panel, the generated REST API, **and** the app's own routes.

Why this over per-handler guards:
- One source of truth. §2/§4 of the matrix already specify the rules; we implement them once in `src/collections/*` + `src/globals/*` and everything inherits them.
- No per-route duplication to drift out of sync.
- The Local API already carries `req.user`; we stop telling it to ignore access.

**The core change:** every Local API call in a route handler that currently runs as `overrideAccess: true` (the default) must (a) pass the authenticated `user`/`req`, and (b) set `overrideAccess: false`. Today `overrideAccess` appears nowhere in `miv-backend/src`, so this is an explicit, auditable addition at ~17 backend call sites (and the frontend routes that proxy them).

---

## 1. Preconditions / blockers (resolve at sprint review before the gated phases)

| Blocker | Blocks | Needed decision |
|---|---|---|
| **Role mapping** (legacy `user`, `MANAGER`, `VENTURE_MANAGER`, `GEDSI_ANALYST`, `CAPITAL_FACILITATOR`, `EXTERNAL_STAKEHOLDER`) | Route-guard targets (§3), any rule that references a non-canonical role | Map or delete each; data migration first (see roles.json `adoption.orderedSequence`) |
| **`founderOfVenture` is broken** (maps `ventures.founders[].user`; no `user` field on that array) | Founder venture-scoping for ventures/agreements/dataRoomFiles/onboardingIntakes (item 4) | Add a `user` relationship to the ventures `founders` array (schema + migration) **or** scope via the `founders` collection (has a `user` relationship). Recommendation: scope via `founders` — no schema migration |
| **Founder has no Prisma enum value**; `user` still read by `login/page.tsx` | Frontend role adoption + redirect | Migration + settle redirect rule (both in matrix §1/§7) |

**Unblocked now** (no decision required): Users `create` door, `users.role` field-lock, media `args.doc` bug (A9), over-permissive updates (A5), global `settings` (A8).

---

## 2. Phased plan (mapped to the 5 checklist items)

### Phase 1 — Collection access rules (item 1) — *mostly unblocked*
Harden `src/collections/*` and `src/globals/*` to the matrix §2 declared rules. Reuse `src/access/roles.ts` helpers (`adminOrAnalyst`, `selfOrAdminAccess`) — currently imported by nothing.
- **users**: `create: anyone` → `create: adminOnly` (close the open door; the register route creates via Local API and will be handled in Phase 3, so signup still works). `update`/`read` → `adminOrAnalyst`.
- **globals/settings** (A8): `read: () => true` → authenticated; `update: role !== 'founder'` → `adminOnly`.
- **dataRoomFiles / agreements** (A5): `update` any-authenticated → `adminOrAnalyst` (+ founder-scoped once §1 blocker resolved).
- **user-settings** (A5): `read`/`update` → `selfOrAdminAccess` (own record only).
- **activityLogs** (A7): consider `delete: () => false`.

### Phase 2 — Field-level rules (item 2) — *unblocked*
Implement matrix §4 via field-level `access.update`/`access.read`:
- `users.role` → `update: adminOnly` (fixes A2 escalation).
- `documents.status`, `documents.reviewedBy`, `documents.reviewedAt` → `update: adminOrAnalyst`.
- `ventures.triageTrack`, `ventures.triageRationale` → `read`/`update: adminOrAnalyst` (hide from founder).
- `onboardingIntakes.wss.*`, `disabilityFlag` → tightest: `read`/`update: adminOnly` (disability data).

### Phase 3 — Route enforcement (item 3) — *gated on mapping*
Flip Local API calls to `overrideAccess: false` and pass `user`. Order by group (matrix §3): backend `users`/`documents`/`sytem-settings` first, then the g1–g5 frontend proxies. **Special cases that intentionally run privileged** (must stay `overrideAccess: true` with their own explicit guard): the public `intake/submit` and `register` flows, and any system seed. Target R/W per role per matrix §3 — **fill in once mapping is settled**.

### Phase 4 — Where-scoping pattern (item 4) — *partially gated*
Copy the `Documents.read` pattern (returns a `Where` constraint on the owner, not a boolean) to every collection that should be owner/venture-scoped:
- **Owner-field collections (ready): media** — replace the broken `args.doc` read (A9) with `{ uploader: { equals: req.user.id } }`.
- **Venture-scoped collections (gated): ventures, agreements, dataRoomFiles, onboardingIntakes** — implement `founderOfVenture` correctly (scope via `founders` collection: look up founder rows where `user = req.user.id`, collect `venture` ids, return `{ venture: { in: [...] } }`). Fixes A4. Blocked on the §1 relationship decision.

### Phase 5 — Peer review vs matrix (item 5)
Cell-by-cell walkthrough of the implemented rules against matrix §2/§4/§3 with June (+ Satya for mapping). Every deviation either updates the code or updates the matrix — no silent drift.

---

## 3. Testing (per flow × per env — mirror the auth-audit method)
- **Unit**: per-collection access functions with mocked `req.user` for each canonical role (admin/analyst/founder) + unauthenticated.
- **Integration (local)**: probe battery through the running stack — for each collection/route, assert the matrix cell for each role (200/403/scoped result). Reuse the local-probe approach from the auth audit.
- **Regression guard**: confirm the public flows (`intake/submit`, `register`) still succeed after the `overrideAccess:false` migration.
- **Vercel**: re-run the matrix probes against a deployment once a URL/access exists (still outstanding from the auth audit).

## 4. Rollout / sequencing
1. Data migration for legacy roles (roles.json `adoption.orderedSequence`) — must precede any rule that names canonical-only roles.
2. Phases 1–2 (unblocked) → reviewable PR #1.
3. Resolve §1 blockers at sprint review.
4. Phases 3–4 → reviewable PR #2 (the actual API-level enforcement).
5. Phase 5 sign-off → merge.
6. **Hold the CI role-lint check** until pipeline #56 is green (per roles.json).

## 5. Open decisions for the sprint review
1. Legacy-role mapping (map-or-delete each of the 6) + redirect rule.
2. Founder venture-scoping: add `user` to `ventures.founders` **or** scope via `founders` collection (plan assumes the latter).
3. Confirm which routes are intentionally privileged (`intake/submit`, `register`, seeds) and keep `overrideAccess: true` with an explicit guard.
4. Confirm field-level target for WSS/disability data (admin-only vs admin + gedsi-scoped analyst).
