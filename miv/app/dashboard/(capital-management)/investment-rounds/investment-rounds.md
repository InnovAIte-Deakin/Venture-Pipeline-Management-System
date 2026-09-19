**VPMS - Investment Rounds**

Data Flow & Handover Documentation

Task T16 - Review and Improve Investment Round

| Item | Details |
| --- | --- |
| Feature | Dashboard - Investment Rounds |
| Task | T16 - Review and improve Investment Round |
| Current work | Frontend refactor and responsive/mobile UI |
| Pull request | #86 - T16-refactor-UI (investment-rounds) |
| Handover purpose | Explain current frontend data flow, incomplete integrations, and recommended next-trimester work |

## 1. Feature Overview

The Investment Rounds feature provides a dashboard view of venture investment information. It presents funding progress, GEDSI and impact information, risk indicators, founder diversity, sector distribution, timeline information, analytics, AI insights, and a documents area. The refactored route is intentionally small and delegates the feature UI to reusable Investment Rounds components.

The page supports desktop and mobile layouts and includes loading, error/retry, filtering, summary, table/card presentation, detail viewing, and multiple analysis tabs.

## 2. Key Frontend Files

| File | Responsibility |
| --- | --- |
| app/.../investment-rounds/page.tsx | Thin Next.js route that renders InvestmentRoundsPage. |
| components/dashboard/investment-rounds/investment-rounds-page.tsx | Feature composition, loading/error states, tabs, filters and selected-round state. |
| hooks/use-investment-rounds.ts | Fetches venture data, converts ventures to investment rounds, manages filters, loading/error state, and summary calculation. |
| lib/investment-rounds/venture-to-round.ts | Transforms Venture API records into the InvestmentRound view model and supplies fallback/derived values. |
| lib/investment-rounds/calculations.ts | Filtering, totals, averages, percentages, timeline sorting, GEDSI ranking and funding-progress calculations. |
| lib/investment-rounds/constants.ts | Static round types, stages, sectors, founder types, and venture-stage mappings. |
| lib/investment-rounds/types.ts | Type definitions for Venture, InvestmentRound, filters and summary. |
| investment-round-summary.tsx | KPI cards and founder/sector/risk/status distributions. |
| investment-round-tabs.tsx | GEDSI, AI Insights, Timeline, Analytics and Documents panels. |
| investment-rounds-table.tsx | Desktop table and mobile-friendly round presentation. |
| round-filters.tsx | Search and filter controls. |
| round-detail-dialog.tsx | Selected-round impact metrics and AI insight details. |

## 3. What Data the Page Needs

| Data group | Fields / examples | Used for |
| --- | --- | --- |
| Venture identity | id, name, sector, location | Search, table/cards, analytics and round identification |
| Venture lifecycle | stage, status, createdAt, updatedAt | Round type/stage mapping, status, timeline and last update |
| Funding | fundingRaised, lastValuation | Raised amount, target amount, valuation and funding progress |
| Founder / inclusion | founderTypes, inclusionFocus, gedsiGoals | Founder diversity, GEDSI scoring, inclusion labels and sustainability goals |
| AI analysis | gedsiScore/gedsiAlignment, impactScore, sustainabilityScore, riskLevel, recommendation, keyStrengths, areasForImprovement | GEDSI/impact cards, AI Insights and risk presentation |
| Related counts | _count.documents, _count.activities, _count.capitalActivities | Document count is currently mapped into the round model; other counts are available in the Venture type |
| Impact metrics | jobsCreated, communitiesServed, womenLeadership, disabilityInclusive, carbonReduction | Impact summaries and round detail view |
| Investment-round-specific data | target amount, closing date, lead investor, participants, ownership | Funding/timeline/analytics details; several are currently derived or fallback values rather than dedicated backend fields |

## 4. Current Data Source and Data Flow

The current page is not driven by a dedicated Investment Rounds API. The custom hook sends a GET request to `/api/ventures?limit=100`. The response is expected to contain a `ventures` array. Each Venture record is then converted in the browser into an InvestmentRound using `ventureToInvestmentRound()`.

| Step | Current flow |
| --- | --- |
| 1 | InvestmentRoundsPage calls useInvestmentRounds(). |
| 2 | useInvestmentRounds() fetches GET /api/ventures?limit=100. |
| 3 | The returned Venture[] is mapped through ventureToInvestmentRound(). |
| 4 | ventureToInvestmentRound() maps real venture fields and generates/derives missing round-specific values. |
| 5 | filterInvestmentRounds() applies search and dropdown filters locally in the browser. |
| 6 | calculateSummary() calculates dashboard totals, averages and percentages locally. |
| 7 | The page passes the resulting model to KPI, distribution, table/card, GEDSI, AI, timeline and analytics components. |

**Simplified flow: **Venture API → useInvestmentRounds hook → Venture-to-Round transformation → local calculations/filtering → Investment Rounds UI

## 5. API, Database, Static, Fallback and Local Data

| Category | Current implementation | Assessment |
| --- | --- | --- |
| API data | GET /api/ventures?limit=100 | Real frontend API call used as the primary source. |
| Database | No direct database access exists in the reviewed Investment Rounds frontend code. | The frontend depends on the ventures API. The database implementation behind that API is outside the reviewed files. |
| Static configuration | Round types, stages, sectors, founder types and stage mappings are defined in constants.ts. | Appropriate for UI options/mappings, but should remain aligned with backend enums/business rules. |
| Local calculations | Filtering, funding progress, totals, averages, percentages, top GEDSI rounds and timeline sorting are calculated client-side. | Useful presentation logic; business-critical calculations may later be better centralized. |
| Derived values | GEDSI and risk can be calculated from venture fields when AI analysis does not supply them; target amount is estimated from stage/funding. | Fallback logic keeps the UI populated but should not be confused with authoritative investment data. |
| Placeholder/fallback values | Lead investor, participants, some valuation/default text, recommendations/strengths/improvements and several impact metrics can be supplied as defaults. | These should be replaced by persisted backend data where the product requires real values. |
| Randomly generated values | Fallback impact/sustainability scores, ownership, jobs created, communities served, women leadership, disability inclusion and carbon reduction use Math.random() in some cases. | Major handover issue: values can change between refreshes and are not suitable as authoritative reporting data. |
| Documents tab | UI currently displays an empty state with Upload Documents / Share All controls. | Not connected to document retrieval/upload behaviour in the reviewed feature code. |
| Add Round | Header contains an 'Add Round Form Coming Soon' placeholder. | Creation workflow is not implemented in the reviewed feature. |

## 6. Data That Is Missing or Not Properly Connected

- Dedicated investment-round records: The feature currently adapts Venture records rather than retrieving a dedicated Investment Round entity/API.
- Stable impact metrics: Several impact metrics are randomly generated. They should come from stored, auditable backend fields.
- Authoritative target amount: Target amount is estimated from funding and stage rules instead of a stored round target.
- Closing date: The current transformation uses the venture updatedAt date as the round closing date, which is not necessarily a true investment closing date.
- Investor and participant data: Lead investor is set to 'MIV Fund' and participants to 'MIV Fund' / 'Co-investors' rather than being retrieved as round relationships.
- Ownership: Ownership is randomly generated rather than retrieved from an investment record.
- Valuation fallback: If lastValuation is missing, the UI falls back to $5M; this can present a value that is not real.
- AI/impact fallbacks: When AI fields are absent, several scores and recommendations are generated locally. The UI should distinguish calculated estimates from stored/AI-produced results.
- Documents integration: The Documents tab is not connected to round documents, upload, sharing, permissions or backend persistence.
- Create/edit workflow: The Add Round experience is a placeholder; create/update operations are not implemented in the reviewed feature.
## 7. Recommended Work for Next Trimester

**1. Create/confirm a dedicated Investment Round data model and API**
Define authoritative fields such as ventureId, round type, target amount, raised amount, opening/closing dates, status, valuation, ownership, lead investor and participants.

**2. Remove random production metrics**
Replace Math.random()-based values with persisted backend metrics. If sample data is needed for development, clearly label and isolate it as mock data.

**3. Connect impact and GEDSI metrics**
Store or retrieve jobs created, communities served, women leadership, disability inclusion, carbon reduction, GEDSI, impact and sustainability values from a reliable source.

**4. Integrate investor relationships**
Connect lead investors and participants to real entities/records rather than fixed display strings.

**5. Complete Documents integration**
Load documents for the selected round and implement upload/share actions with permissions and backend persistence.

**6. Implement Add/Edit Investment Round**
Replace the current placeholder with validated create/edit forms connected to the backend.

**7. Clarify AI data provenance**
Show whether a score/recommendation is stored AI output, locally derived fallback, or unavailable. Avoid silently presenting estimates as authoritative.

**8. Align frontend/backend enums**
Keep stage, status, round type, sector and founder-type values consistent across API, database and UI.

**9. Improve API scalability**
The current request fetches up to 100 ventures and filters client-side. Consider server-side pagination/filtering when the dataset grows.

**10. Add automated tests**
Cover venture-to-round mapping, fallback behaviour, filtering, summary calculations, error/loading states and responsive rendering.

## 8. Handover Risks / Important Notes

- Dashboard numbers may change after a page refresh because some fallback metrics use random generation.
- The Investment Rounds UI can look complete even when some displayed values are estimated, defaulted or generated locally.
- The reviewed frontend does not prove which database tables or ORM models power /api/ventures; that backend route should be documented separately by the backend/integration team.
- When the new dashboard theme is applied, preserve the existing hook/view-model separation so visual changes do not reintroduce a large monolithic page.
## 9. Current T16 Status

T16 has refactored the Investment Rounds frontend into reusable feature files and improved responsive/mobile presentation while preserving the desktop experience. The feature is now easier to maintain and hand over. PR #86 has been submitted for review. The remaining work identified in this document is primarily data integration, backend ownership, and future feature completion rather than another large frontend refactor.

## 10. Short Handover Summary for Team

**Current source: **/api/ventures?limit=100.

**Current transformation: **Venture records are converted to InvestmentRound objects in the frontend.

**Current calculations: **Filters, summary metrics, percentages, rankings, timeline sorting and funding progress are client-side.

**Main gap: **Several investment-specific and impact fields are fallback, estimated, fixed, or randomly generated instead of being persisted backend data.

**Next priority: **Establish authoritative Investment Round/backend data and connect documents, investors, impact metrics and create/edit workflows.
