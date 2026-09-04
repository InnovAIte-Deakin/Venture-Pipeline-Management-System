# ADR: Resolve the Next.js 16 / Next.js 15 split between `miv` and `miv-backend`

**Status:** Accepted
**Date:** 2026-09-04
**Author:** Akshit Bhullar
**Related:** PR #57 (`fix/middleware-to-proxy`), Sprint 2 task "Resolve the Next 16 / Next 15 split between the two apps"

---

## Context

`miv` (frontend) and `miv-backend` (Payload CMS backend) currently run different major versions of Next.js:

- `miv`: Next.js `^16.2.1`
- `miv-backend`: Next.js `15.4.4`, via Payload CMS `3.49.1`

This was investigated against PR #57, which is the most recent PR to substantially touch `miv`'s dependencies and lint/type tooling. The `next` version itself was **not** changed by PR #57 — it appears as unchanged context in that PR's `package.json` diff, meaning the jump to Next 16 happened in an earlier, undocumented change. PR #57 is not the source of the split; it's simply the most recent PR touching related tooling.

## Decision

**Revert `miv` (frontend) to Next.js 15.x. Do not upgrade `miv-backend` to Next.js 16.**

## Reasoning

1. **Payload CMS does not support Next.js 16 on the version we run.** Payload's official Next.js compatibility only reaches Next 16 as of **Payload 3.73.0**, paired specifically with **Next 16.2.x**. Our backend runs Payload `3.49.1` — well below that. Payload's documented supported ranges are `15.2.9–15.2.x`, `15.3.9–15.3.x`, `15.4.11–15.4.x`, and `16.2.6+`. Next `15.5.x`–`16.1.x` is explicitly **not supported and will not be supported in the future**.

2. **Upgrading the backend to Next 16 is not a small change.** It would require upgrading Payload from `3.49.1` to `3.73.0+` at the same time — a large jump across an actively-developed CMS framework, not a routine dependency bump.

3. **Known, currently-open issues exist with this exact combination.** Payload + Next 16 + Turbopack has active, reported memory leaks in the admin panel (community discussion, unresolved at time of writing). Adopting this combination now means inheriting bugs that aren't fixed yet, on our production CMS.

4. **The frontend has no such constraint.** `miv` is a standalone Next.js app (Prisma + NextAuth), with no CMS framework tightly coupling it to a specific Next.js version. Reverting it to Next 15 is a contained, low-risk change compared to the backend option.

5. **Asymmetric risk.** If the backend upgrade goes wrong, it affects the CMS, all content data, and the admin panel every team member depends on daily. If the frontend revert goes wrong, it's contained to one app, and we already have a working Next 15 baseline to fall back to (miv-backend proves Next 15 + Payload works reliably).

## Consequences

- `miv`'s `package.json` `next` dependency moves from `^16.2.1` to a Next 15.x version. Any Next 16-specific APIs or config used in `miv` since the (undocumented) upgrade will need to be identified and reverted or polyfilled.
- The two apps will share the same major Next.js version again, simplifying the shared build/CI pipeline and reducing the chance of subtle cross-app tooling mismatches.
- **Follow-up action, tracked separately:** `miv-backend` is currently on Next `15.4.4`, below Payload's documented minimum supported patch of `15.4.11` for the 15.4.x line (this minimum exists due to a patched CVE). This should be bumped to at least `15.4.11` regardless of the 16 decision above — low-risk patch-level bump, not part of this ADR's scope but noted here so it isn't lost.
- We revisit upgrading to Next 16 once Payload's 3.73.0+ line has had time to mature and the reported Turbopack memory leak is resolved upstream.

## Verification

- [ ] Both apps build successfully after the revert
- [ ] The proxy/rewrite between `miv` and `miv-backend` (established in PR #57) still functions correctly
- [ ] Payload version confirmed compatible with the landed Next.js version
- [ ] Team notified before merging, given local dev environments will need to reinstall dependencies
