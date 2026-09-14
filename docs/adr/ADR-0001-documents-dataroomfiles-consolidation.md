# ADR-0001: Consolidate the `documents` and `dataRoomFiles` Collections

**Status:** Proposed — **NOT signed off. This is the blocker for the entire Phase 0 effort.**

**Date opened:** 2026-09-04

**Companion documents:**
- [`docs/planning/phase-0-consolidation-plan.md`](../planning/phase-0-consolidation-plan.md) — full inventory, enum reconciliation, computed-status analysis, migration/rollback plan, and freeze policy prepared in advance of this ADR being signed.
- [`docs/rbac/RBAC_MATRIX.md`](../rbac/RBAC_MATRIX.md) — a separate, already-in-flight access-control audit that independently touches both collections (anomalies A4, A5). Read alongside this ADR; see the Related work section below.

Task tracking, deadlines, and owner assignment for this effort are managed in MS Planner, not in this document.

---

## Blocker (read this first)

This ADR has not been signed by the required approvers. **No schema change, migration script, or cutover activity may begin until it is signed.** The rest of this document, and the companion planning document, are prepared *in advance* so that execution can start immediately once sign-off happens — they are not evidence that the decision is final, and no one should treat them as authorization to begin Phase 1 work.

**Required approvers:**
- `[Engineering Lead — TBD]`
- `[Product/Data Owner — TBD]`

(The codebase defines in-app roles — `admin`, `miv_analyst`, `founder`, legacy `user` — but none of these map to an organizational sign-off authority. `admin` is the closest in-app analog to a data owner, being the only role with full CRUD across every collection and `system-settings`, but a named human approver is still required. `docs/rbac/RBAC_MATRIX.md` names a standing review forum where the canonical role list itself is being settled; this ADR may fit naturally into that same review rather than a separate one — that scheduling call belongs in MS Planner.)

---

## Context

`miv-backend` (the Payload CMS backend) has two live, actively-used collections that both store venture-scoped file uploads:

- **`documents`** ([`src/collections/documents.ts`](../../miv-backend/src/collections/documents.ts)) — has a `documentType` enum, a `status` review workflow (`pending_review → approved/rejected/needs_revision`, now field-level gated to staff only), reviewer tracking, and an ownership-scoped read model. Not listed in `miv-backend/README.md`'s "Stage 1" canonical collection list, suggesting it was added later, out of band.
- **`dataRoomFiles`** ([`src/collections/dataRoomFiles.ts`](../../miv-backend/src/collections/dataRoomFiles.ts)) — has a `category` enum instead of `documentType`, no status/review workflow, no uploader tracking, and (as of a recent, separate fix — see Related work) a venture-scoped read model and staff-only update. *Is* listed as an original Stage 1 collection.

Both are registered in `payload.config.ts` and neither is disabled, deprecated, or flagged in code comments as legacy. No prior ADR, migration plan, or governance document addressing *this specific duplication* (merging the two collections) exists anywhere in the repository — confirmed by direct search of `docs/`, `CLEANUP_SUMMARY.md`, `SEED_NOTES.md`, and a repo-wide search for an `adr/`/`decisions/` directory.

A third, unrelated system was also found during research — the separate `miv` Next.js application has its own Prisma/Postgres `Document` model with a third, different `DocumentType` enum vocabulary. **That system is explicitly out of scope for this ADR and this consolidation effort.**

### Related work: this is not the only open governance item touching these collections

`docs/rbac/RBAC_MATRIX.md` is a separate, currently-DRAFT access-control audit that independently flagged `dataRoomFiles`'s access model as too permissive (anomalies **A4** — founder read not properly venture-scoped, **A5** — any authenticated user could update). **Those two anomalies have already been fixed in code** (`dataRoomFiles.ts` now uses `founderVentureScopedRead('venture')` for read and `adminOrAnalyst` for update — see inline comments citing A4/A5 directly), even though the RBAC matrix's own tables haven't been updated to reflect that fix yet. This ADR should be sequenced with awareness of that audit: **do not duplicate its access-control decision-making** — cross-reference it rather than re-litigating access control from scratch. Full field-by-field evidence for the claims above is in [§2 of the companion planning document](../planning/phase-0-consolidation-plan.md#2-full-inventory).

## Decision needed

This ADR must resolve three questions, each detailed with supporting analysis in the companion planning document:

1. **Which collection survives, and which is retired?** Neither codebase evidence nor documentation states a direction. `dataRoomFiles` has the "Stage 1 canonical" designation; `documents` has the more complete feature set (review workflow, ownership tracking). This is a product/business call, not a technical one.
2. **What does the unified `documentType`/`category` enum look like?** See the reconciliation table in [§3 of the companion planning document](../planning/phase-0-consolidation-plan.md#3-document-type-enum-reconciliation) — 4 of the 8 distinct values across both enums have no clean counterpart on the other side and require an explicit business decision.
3. **Does the merged collection's `status` field stay stored, or become computed at read time?** See the tradeoff analysis and recommendation in [§4 of the companion planning document](../planning/phase-0-consolidation-plan.md#4-computed-vs-stored-status-decision).

A fourth question, now narrower than it might first appear thanks to the RBAC fix described above: **should the merged collection's read/update model follow `documents`' ownership-scoped pattern, or `dataRoomFiles`' now-venture-scoped pattern?** The two models have converged significantly (both now restrict write to staff, both scope founder read), but the *mechanism* differs — `documents` scopes by `uploadedBy` (who uploaded it), `dataRoomFiles` now scopes by the founder's venture membership (via the `founders` collection). `dataRoomFiles` also still has no uploader/owner field at all, so an ownership-based model can't be reconstructed for its existing records without inference.

## Consequences of leaving this unresolved

While this ADR stays unsigned, new code may keep being written against either collection, widening the gap the eventual migration has to close. The freeze described in the companion planning document (§6) cannot be enforced until this ADR names which store loses.

## Decision

*(To be completed upon sign-off — do not fill in without approver sign-off recorded in the decision log in the companion planning document.)*

## Approval

| Approver | Role | Signed | Date |
|---|---|---|---|
| `[Engineering Lead — TBD]` | Required | ☐ | |
| `[Product/Data Owner — TBD]` | Required | ☐ | |
