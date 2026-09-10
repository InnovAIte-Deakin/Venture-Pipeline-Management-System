# ADR: Resolve the Next.js 16 / Next.js 15 split between `miv` and `miv-backend`

**Status:** Accepted (revised)
**Date:** 2026-09-04 (original), revised same day per review feedback
**Author:** Akshit Bhullar
**Reviewed by:** June Choi (Backend Lead)
**Related:** PR #57 (`fix/middleware-to-proxy`), Sprint 2 task "Resolve the Next 16 / Next 15 split between the two apps"

---

## Context

`miv` (frontend) and `miv-backend` (Payload CMS backend) currently run different major versions of Next.js:

- `miv`: Next.js `^16.2.1`
- `miv-backend`: Next.js `15.4.4`, via Payload CMS `3.49.1`

This was investigated against PR #57, which is the most recent PR to substantially touch `miv`'s dependencies and lint/type tooling. The `next` version itself was **not** changed by PR #57 — it appears as unchanged context in that PR's `package.json` diff, meaning the jump to Next 16 happened in an earlier, undocumented change.

## Decision

**Leave `miv` (frontend) on Next.js 16. Bump `miv-backend`'s Next.js version to `15.4.11`.**

This reverses an earlier version of this ADR, which recommended reverting `miv` to Next 15 to match the backend. That recommendation was incorrect and has been withdrawn — see "Revision history" below.

## Reasoning

1. **The version mismatch itself is not a real problem.** Payload's Next.js compatibility constraint applies only to `miv-backend`, which runs Payload directly. `miv` does not run Payload at all — it builds independently against its own `package.json`. Two apps on different Next major versions is not inherently broken; it only matters where a framework (Payload) actually creates a hard dependency on a specific Next version, which is `miv-backend` only.

2. **`miv-backend`'s Next version should still be bumped**, independent of the `miv` question: Payload only supports Next 16 as of Payload `3.73.0`, and we run `3.49.1`. The safe, low-risk move is bumping `miv-backend` to `15.4.11`, Payload's documented minimum supported patch on the 15.4.x line (also resolves a CVE that `15.4.4` predates). This does not require a Payload upgrade and carries no dependency on `miv`.

3. **Reverting `miv` to Next 15 would have caused a real regression.** `miv/proxy.ts` is a Next 16-specific file — Next 15 only picks up `middleware.ts`. On Next 15.4.11, `proxy.ts` silently does not execute at all, meaning the session/auth check (redirecting unauthenticated users away from `/dashboard`) would stop working with no error or warning. This was caught in review, not by testing beforehand — a genuine gap in the original verification, since the `/backend/*` rewrite that was tested is a separate mechanism from the auth middleware and passing one does not confirm the other.

4. **The `miv` version is a frontend-stream decision, not a backend/DevOps one.** Every open frontend PR and Kent's integration branch are on Next 16. Downgrading `miv` unilaterally would conflict with active frontend work outside this task's scope. Consulted with Kent directly given this affects his branch; not a call to make solely within the CI/DevOps pipeline work.

## Consequences

- `miv-backend`'s `next` dependency moves from `15.4.4` to `15.4.11`. Payload CMS is unaffected (still `3.49.1`, within its supported range for this Next version).
- `miv` remains unchanged at Next `^16.2.1`. The original version-mismatch "problem" this task set out to solve is not actually resolved, because — per point 1 above — it was never a real problem to begin with.
- **Follow-up, tracked separately, not part of this ADR's scope:** whether/when `miv-backend` eventually moves to Next 16 + Payload 3.73.0+ remains an open question, to be revisited once that combination's known issues (reported Turbopack admin panel memory leaks) are resolved upstream.

## Verification

- [x] `miv-backend` builds and runs correctly on Next `15.4.11` (verify after the version bump lands)
- [x] Payload version confirmed compatible with `15.4.11`
- [ ] Confirm with Kent that leaving `miv` on Next 16 doesn't need further action from the DevOps/Platform side

## Revision history

**Original decision (superseded):** Revert `miv` to Next 15.4.11 to match `miv-backend`, reasoning that keeping both apps on the same major version reduced risk and tooling mismatch.

**Why it was wrong:** This treated "the two apps should match" as the actual requirement, when the real constraint (Payload compatibility) only applies to `miv-backend`. It also missed that `miv/proxy.ts` is Next 16-only — the revert would have silently disabled the `/dashboard` auth redirect on Next 15, since `middleware.ts` (not `proxy.ts`) is what Next 15 executes. This was caught by June Choi in review before merging, not caught during original verification, because the proxy check performed at the time (`/backend/*` rewrite) tested a different mechanism than the one actually affected. The revert commit was pulled off `devops/add-ci-pipeline` via `git revert` rather than history rewrite, since the branch is shared.