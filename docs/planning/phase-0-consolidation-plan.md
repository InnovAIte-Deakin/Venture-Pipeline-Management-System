# Phase 0 Plan — `documents` / `dataRoomFiles` Consolidation

**Companion document:** [`docs/adr/ADR-0001-documents-dataroomfiles-consolidation.md`](../adr/ADR-0001-documents-dataroomfiles-consolidation.md) — **currently unsigned**. See that document for the sign-off blocker.

**See also:** [`docs/rbac/RBAC_MATRIX.md`](../rbac/RBAC_MATRIX.md) — a separate, already-in-flight access-control audit that independently covers both `documents` and `dataRoomFiles` (anomalies A4, A5). This plan cross-references it rather than re-deciding access control from scratch; see §2 below.

Task tracking, deadlines, and owner/backup assignment for this effort live in MS Planner — deliberately not duplicated here.

> ⚠️ **Every section below is pending ADR-0001 sign-off.** It is prepared in advance so Phase 1 (execution/cutover) can start immediately on approval — it is **not** authorization to begin schema changes, migration scripts, or cutover activity now. Phase 0 = documentation and governance only.

## Decision log

| Date | Decision | Made by | Notes |
|---|---|---|---|
| 2026-09-04 | Opened ADR-0001 as `Proposed`; drafted this Phase 0 plan | Claude (Fable 5), at user request | No prior ADR/plan existed for this consolidation anywhere in the repo |
| 2026-09-04 | Scoped this effort to `documents` vs `dataRoomFiles` only, excluding the separate `miv` Next.js app's Prisma `Document` model | User (satyadilsched077@gmail.com) | The Prisma system is a third, unrelated vocabulary and a different database entirely (Postgres vs MongoDB) |
| 2026-09-04 | Used role-based placeholders instead of named individuals for the ADR approvers | User (satyadilsched077@gmail.com) | Real names to be filled in by the team before this plan is considered frozen |
| 2026-09-04 | Rebased this plan onto latest `origin/main` before drafting the PR | User (satyadilsched077@gmail.com) | Surfaced that `dataRoomFiles`'s access model had already been tightened by a separate, in-flight RBAC audit (anomalies A4/A5) since the plan's first draft — §2 below reflects the corrected, current state |
| 2026-09-04 | Kept task tracking (deadlines, owners) in MS Planner, out of this document | User (satyadilsched077@gmail.com) | This is a capstone project, not an org with a governance/PM tool stack living in the repo |
| — | Which collection survives; unified enum values; status stored vs. computed; final access-control model | **Pending — blocked on ADR-0001 sign-off** | See §3/§4 below for the analysis feeding this decision |

---

## §1 ADR status

**Not signed.** See [ADR-0001](../adr/ADR-0001-documents-dataroomfiles-consolidation.md) for the full context and required approvers. Nothing in §2–§6 below should be read as a final decision — it is preparatory analysis so that once the ADR is signed, Phase 1 can begin without re-deriving this work.

---

## §2 Full inventory

Built from direct reads of both collection definitions on `origin/main`, not a sample.

### `documents` ([`src/collections/documents.ts`](../../miv-backend/src/collections/documents.ts))

| Field | Type | Notes |
|---|---|---|
| `documentType` | select, required | `pitch_deck`, `financial_statements`, `legal_documents`, `gedsi_reports`, `impact_reports`, `other` |
| `status` | select, default `pending_review` | `pending_review`, `approved`, `rejected`, `needs_revision`. Field-level access now gates `create`/`update` to `fieldAdminOrAnalyst` (staff only) — a founder can read but not set their own document's status |
| `version` | number, default `1`, admin read-only | **Flag: never programmatically incremented anywhere in the codebase — effectively a dead field today** |
| `uploadedBy` | relationship → `users`, required, read-only | Server-set on create via a `beforeChange` hook, not user-editable |
| `venture` | relationship → `ventures`, optional | |
| `notes` | textarea | |
| `reviewedBy` | relationship → `users`, optional | Set manually inside the `PATCH /api/documents/[id]` route handler when `status` changes — not a Payload collection hook. Also now field-level gated to staff only. This is the "computed" logic referenced in the governance brief for this phase: it's route-level, not derived at read time |
| `reviewedAt` | date, optional | Same as above — stamped by the API route, field-level staff-gated |
| `filename`, `mimeType`, `filesize`, `url`, `thumbnailURL`, `createdAt`, `updatedAt`, `id` | Payload automatic upload fields | Accepts PDF, Word, Excel, PowerPoint |

Access control (collection-level): `create` open to any authenticated user; `read` scoped — founders see only their own uploads (`uploadedBy` filter), `miv_analyst`/`admin` see all; `update`/`delete` restricted to `miv_analyst`/`admin`.

### `dataRoomFiles` ([`src/collections/dataRoomFiles.ts`](../../miv-backend/src/collections/dataRoomFiles.ts))

| Field | Type | Notes |
|---|---|---|
| `venture` | relationship → `ventures`, optional | **Typed `as any` in source — flag as a type-safety gap independent of this consolidation** |
| `category` | select, required | `pitch`, `financials`, `policies`, `registration`, `other` |
| `notes` | plain `text` | (`documents.notes` is a `textarea` — same concept, different field type) |
| `filename`, `mimeType`, `filesize`, `url`, `thumbnailURL`, `createdAt`, `updatedAt`, `id` | Payload automatic upload fields | PDF-only |

**No `status`, no uploader/owner field, no reviewer fields, no hooks at all.**

Access control (collection-level, **corrected as of this pass** — see below): `create` open to any authenticated user; `read` is venture-scoped for founders via `founderVentureScopedRead('venture')` (staff see all); `update` restricted to `miv_analyst`/`admin`; `delete` restricted to `admin`.

### A note on access control: don't re-litigate what's already being fixed elsewhere

An earlier pass of this plan (drafted before pulling latest `origin/main`) found `dataRoomFiles` open to **any authenticated user for read and update**, and flagged that as a business decision this ADR would need to resolve. Between that draft and this one, a **separate, already-in-flight RBAC audit** (`docs/rbac/RBAC_MATRIX.md`, anomalies A4 and A5) landed exactly that fix: `dataRoomFiles.read` is now scoped to a founder's own venture (resolved via the `founders` collection's email match — a different, working mechanism from the `founderOfVenture` helper the matrix separately flags as broken), and `dataRoomFiles.update` is now staff-only. **`create` remains open to any authenticated user on both collections — that part is unchanged and symmetric, not a gap.**

Net effect on the ADR's access-control question (see ADR-0001, "Decision needed," item 4): the two collections' access models have converged substantially through unrelated work. What's left to decide is narrower than originally scoped — not *whether* to restrict `dataRoomFiles`, but *which scoping mechanism* (`documents`' per-record `uploadedBy` ownership vs. `dataRoomFiles`' per-founder venture-membership) the merged collection should use, given `dataRoomFiles` has no uploader field to reconstruct ownership from.

### One-side-only fields

`status`, `version`, `uploadedBy`, `reviewedBy`, `reviewedAt` exist only on `documents` — there is no `dataRoomFiles` equivalent for any of them. This is a functional gap, not just naming: today, `dataRoomFiles` has no record of who uploaded a given file at all, which also means a merged collection can't backfill `uploadedBy` for historic `dataRoomFiles` records without an external data source.

---

## §3 Document-type enum reconciliation

Presented symmetrically — the source/target direction is itself one of the things ADR-0001 needs to decide (see §2 above), so this table does not presume which collection survives.

| `documents.documentType` | `dataRoomFiles.category` | Notes / semantic difference |
|---|---|---|
| `pitch_deck` | `pitch` | Clean match — same concept, different wording |
| `financial_statements` | `financials` | Clean match — same concept, different wording |
| `other` | `other` | Labels match, but a shared bucket name doesn't guarantee shared meaning — **requires a manual audit of existing `other`-tagged records on both sides before merge**, not just an automatic union |
| `legal_documents` | *(none)* | Closest partial overlap is `registration`, but `legal_documents` is broader (contracts, IP, compliance) — **business decision required**: keep as a distinct unified value, or fold into `registration`/`other`? |
| `gedsi_reports` | *(none)* | No equivalent at all — **business decision required**: net-new unified value, or reclassify existing GEDSI docs under `other`? |
| `impact_reports` | *(none)* | Same as above — **business decision required** |
| *(none)* | `policies` | No `documents.documentType` equivalent — internal governance docs, distinct from but adjacent to `legal_documents` — **business decision required**: separate value or merged with `legal_documents`? |
| *(none)* | `registration` | No `documents.documentType` equivalent — business/incorporation paperwork, partially overlaps `legal_documents` — **business decision required** |

**4 of 8 distinct values across the two enums have no clean counterpart and require a business decision, not a technical one.** These four are exactly the values that should be raised with `[Product/Data Owner — TBD]` before the ADR is signed, since the migration script's field-mapping logic (§5) depends on this table being finalized first.

---

## §4 Computed vs. stored status decision

`dataRoomFiles` has no status field today; `documents.status` is a stored select field. Critically, **it is not currently derived from `reviewedBy`/`reviewedAt` at all** — it's an independently settable field (now staff-gated at the field level), decoupled from the reviewer stamp except that the API route happens to set both together on a status-changing `PATCH`.

**Tradeoffs:**

- **Keep stored (current `documents` behavior):**
  - *Pros:* Payload's query/filter/sort layer works natively and efficiently against real fields — the admin UI already sorts/filters by `status` (`defaultColumns` includes it). No new derivation logic to write or maintain. Matches current, already-working behavior.
  - *Cons:* stored value can drift from whatever it's nominally derived from if writes to those underlying fields aren't kept in lockstep — though today there's no such underlying field to drift from, since `status` isn't derived from anything.
- **Compute at read time (e.g., derive from `reviewedBy`/`reviewedAt` presence plus an explicit rejection flag):**
  - *Pros:* single source of truth if the underlying fields are the real signal.
  - *Cons:* Payload's admin UI and API query/filter/sort layer favor stored fields over virtual/derived ones — filtering the documents list by status would get materially slower or more complex. Recomputation logic would need to be written and kept in sync in two places during any transition/shadow window (§5), which is precisely the kind of duplicated-logic risk this phase exists to avoid.

**Recommended decision (pending ADR ratification): keep `status` stored.** Reasoning: it's already the real field the admin UI and access-adjacent workflows rely on; `dataRoomFiles` has zero equivalent today so adding a stored field to the merged collection is a low-risk superset rather than a behavior change; and computing it would introduce new derivation logic that doesn't exist anywhere in the codebase today, with all the dual-implementation risk that comes with introducing it during a migration window.

---

## §5 Migration plan with rollback

**Not authorized to run until ADR-0001 is signed.** Sequenced as follows, each step with an explicit rollback so nobody is improvising rollback logic mid-incident.

| # | Step | Rollback path |
|---|---|---|
| 1 | **Additive schema change**: add the unified fields (per §2/§3/§4 decisions) to the surviving collection. No data moved yet. | Revert the schema change (delete the added fields). Verified by confirming the collection's existing records and API responses are byte-identical to pre-change. |
| 2 | **Freeze the losing collection** (see §6) — effective from a named date, enforced via review + automated check. | Lift the freeze (revert the access-control/CI gate). Verified by confirming a test write to the losing collection succeeds again. |
| 3 | **One-time backfill script**: read every record from the losing collection, transform via the §3 enum mapping and §2 field mapping, write into the surviving collection. Every migrated record is tagged with a `migrationBatchId`. Original IDs preserved via a `legacyId` reference field for traceability. | Delete all records in the surviving collection tagged with that `migrationBatchId`. Verified by re-running the count reconciliation (step 4) and confirming zero tagged records remain — safe because the source (losing) collection is never mutated during this step, only read. |
| 4 | **Validation gate** (must pass before proceeding): record-count reconciliation (source count == migrated count), field-by-field spot-check of a statistically meaningful sample, upload-file integrity check (blob copied/linked correctly), relationship integrity check (`venture` links preserved). | A failed validation gate is not itself a rollback trigger — it blocks progression to step 5 and sends the batch back to step 3 for a fix-and-rerun. |
| 5 | **Shadow/parallel-run window**: losing collection stays intact, unmodified, and readable as a fallback; surviving collection is the primary read/write path for all new code. | Point API/frontend routes back at the losing collection via a feature flag/env var. Verified by confirming reads/writes against the original collection resume functioning with no client-visible errors. |
| 6 | **Cutover**: all API routes and frontend references point exclusively at the surviving collection. | Same mechanism as step 5 — the losing collection was never deleted, so it remains a live fallback until step 7. |
| 7 | **Decommission**: only after a clean shadow window with zero incidents, **archive (not hard-delete)** the losing collection's data. | Restore from archive. Verified via checksum/count match against the pre-archive snapshot. |

**Key principle:** the losing collection is never hard-deleted until the very last step, and only after a proven stable shadow period — that's what keeps every earlier rollback cheap and low-risk rather than a scramble.

---

## §6 Freeze policy (draft — announcement + enforcement not yet actioned)

Once ADR-0001 names the losing collection, no new code should write to it. This needs to be a formal, communicated freeze — not an assumption — with enforcement beyond a verbal agreement:

1. **PR review checklist item**: any diff touching the losing collection's `src/collections/*.ts` file or its API routes gets flagged for review against the freeze.
2. **Automated check**: a CI/lint rule (or pre-commit hook) flagging `payload.create`/`payload.update` calls targeting the losing collection's slug outside an explicitly allowlisted migration-script path. Note: `docs/rbac/RBAC_MATRIX.md` records that the team is deliberately holding off adding a role-lint CI check until the real pipeline (`#56`) is green — the same constraint likely applies here.
3. Once cutover (§5 step 6) begins, the losing collection's `create` access-control function itself can be hardened to reject writes from anything but a migration service account — a hard technical control beyond code review, applied only after the freeze has been socialized (not as the first line of defense, to avoid surprising in-flight work).

The announcement text, effective date, and communication channel are tracked in MS Planner alongside the rest of the task breakdown for this effort, not duplicated here.

---

## Before Phase 1 may begin

ADR-0001 must be signed, the §3 enum reconciliation's four flagged business-decision values resolved, and the §4 status decision ratified. Scheduling, ownership, and sign-off tracking for getting there live in MS Planner.
