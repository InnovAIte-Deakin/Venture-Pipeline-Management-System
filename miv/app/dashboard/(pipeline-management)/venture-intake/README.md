# T25 - Venture Intake Handover

## Document status

- **Inspection date:** 2 September 2026
- **Verified code base:** current `refactor/notifications-integration` working tree, based on `upstream/integration/frontend-sprint-1-t2-2026` at `1a8e6db`.
- **Relevant merged work:** Venture Intake merge commit `93d7f03` (`refactor/venture-intake`, PR #92).
- Statements marked **Verified** come directly from the inspected source code or Git history.
- Statements marked **Needs confirmation** require a product, backend, authentication, or deployment decision.
- Statements marked **Recommendation** describe suggested future work rather than completed work.

## 1. Feature overview and purpose

**Verified:** Venture Intake is a six-step founder-facing form available at `/dashboard/venture-intake`. It collects information about a venture, its team, market, readiness, accessibility and disability inclusion, and GEDSI goals. After validation, the frontend creates a Venture record and then requests a separate AI analysis.

The feature also presents application guidance through a feature-local, one-open-at-a-time accordion. The English guideline content is stored separately from the React components to make a future Khmer content file possible without introducing a localisation framework yet.

## 2. Data required by the page

### Step 1 – Basic Information

- `name` – required venture name.
- `sector` – required selection from a static sector list.
- `location` – required location text.
- `contactEmail` – required valid email address.
- `contactPhone` – optional phone number.

### Step 2 – Team & Foundation

- `founderTypes` – one or more founder categories.
- `teamSize` – one of `1-2`, `3-5`, `6-10`, `11-20`, `21-50`, or `50+`.
- `foundingYear` – required by the frontend form as text.
- `pitchSummary` – at least 10 characters.
- `inclusionFocus` – required inclusion description.

### Step 3 – Market & Business

- `targetMarket` – required target-market description.
- `revenueModel` – required selection from a static list.
- `challenges` – required challenges description.
- `supportNeeded` – required support description.
- `timeline` – required investment-readiness timeline.

### Step 4 – Readiness Assessment

- Operational readiness booleans: business plan, financial projections, legal structure, team composition, and market research.
- Capital readiness booleans: pitch deck, financial statements, investor materials, due-diligence readiness, and funding history.

### Step 5 – Accessibility & Disability Inclusion

- Optional Washington Group answers for seeing, hearing, walking/mobility, cognition, self-care, and communication.
- Optional disability-inclusion flags for disability-led leadership, inclusive hiring, and accessible products/services.
- Optional accessibility and inclusion notes.

### Step 6 – GEDSI Goals and documents

- `gedsiGoals` – at least one goal from the static GEDSI list.
- Optional supporting files selected through the shared `FileUpload` component.

### Analysis result consumed by the page

- Readiness score.
- GEDSI alignment score.
- Recommendations.
- Suggested metrics containing a code and name.
- The API also prepares a risk assessment, although the inspected success view does not render that field.

## 3. Current data sources

| Source | Current use | Status |
| --- | --- | --- |
| User input | Supplies the six form steps | **Verified** |
| React Hook Form state | Stores watched form values and errors in the browser | **Verified** |
| Zod schema | Validates required fields and field shapes | **Verified** |
| Static feature data | Sector, founder type, team-size, revenue-model, and GEDSI options | **Verified** |
| Static English content | Supplies accordion headings, labels, descriptions and body text | **Verified** |
| `POST /api/ventures` | Validates, converts and creates the Venture | **Verified** |
| Prisma | Reads and writes current Venture, User, Activity and related records | **Verified** |
| PostgreSQL through Prisma | Current persistence layer identified by the project Prisma schema | **Verified at code level; deployment configuration not inspected** |
| `POST /api/ai/analyze-venture` | Loads the saved Venture, requests AI analysis, stores the result and returns it | **Verified** |
| Local fallback calculations | Used when the AI response is not valid JSON | **Verified** |
| Supporting file selector | Receives selected files and logs them to the console | **Verified; no upload persistence is connected** |
| Mock data | No Venture Intake mock dataset is imported by the inspected feature | **Verified** |

The guidelines are static application content rather than database data. They currently include seven stable sections: form tips, common mistakes, after submission, strong applications, resources, support and privacy.

## 4. APIs, database, Prisma, form state and local calculations

### Form validation

The feature uses `react-hook-form`, `zodResolver` and `ventureIntakeSchema`. Form mode is `onChange`. The Next action calls `trigger()` only for the fields belonging to the current step, so a failed step remains visible and the first invalid control can receive focus. Final submission still passes through `handleSubmit(onSubmit)`.

Step 5 Washington Group and disability-inclusion fields are optional. Step 6 requires at least one GEDSI goal, and its checkbox updates call `setValue(..., { shouldValidate: true })` so the message updates immediately.

### Venture creation API

`POST /api/ventures` parses the request with `createVentureSchema`. Before `prisma.venture.create()` it converts:

- `1-2` → `1`
- `3-5` → `3`
- `6-10` → `6`
- `11-20` → `11`
- `21-50` → `21`
- `50+` → `50`
- A validated four-digit `foundingYear` string → integer

Unknown team-size ranges and non-four-digit founding-year values produce HTTP 400 validation responses. `founderTypes` is stored as a JSON string. Other structured fields are accepted as JSON-compatible values by the Prisma model.

Authentication in this Ventures route is commented out for development. The route selects the first User record, or creates a development User if none exists, and uses that User as `createdBy`. The route also starts background calculations and several AI-service tasks, writes Activity records, and returns the new Venture with HTTP 201.

### Separate AI-analysis API

`POST /api/ai/analyze-venture` requires `getServerSession()` to return a user. Without it, the route returns HTTP 401. When authenticated, it:

1. Reads `ventureId` from the request.
2. Loads the Venture with GEDSI metrics, activities and documents.
3. Builds an AI prompt from stored Venture data.
4. Calls `AIServices.generateContent()`.
5. Parses the response as JSON.
6. Falls back to local readiness, GEDSI, recommendation and metric calculations if JSON parsing fails.
7. Saves the result to `Venture.aiAnalysis` and creates an Activity record.

The fallback readiness score counts selected operational and capital readiness booleans. The GEDSI fallback starts from a base score and adds values based on founder types and inclusion-focus keywords, capped at 100. Suggested fallback metrics also use founder categories, inclusion keywords and sector checks.

## 5. Current frontend data flow

1. The browser renders the six-step form and static option lists.
2. React Hook Form stores entered values; Zod supplies validation errors.
3. Next validates only the current step. Previous changes the step without validation.
4. On Step 6, `handleSubmit` validates the complete form.
5. If no Venture has been created for this component instance, the browser sends the form JSON to `POST /api/ventures`.
6. After HTTP 201, the frontend stores the returned Venture ID, records that creation succeeded and calls `POST /api/ai/analyze-venture` with that ID.
7. If analysis succeeds, the UI renders scores, recommendations and suggested metrics.
8. If analysis fails, the UI confirms that the application was saved, explains that resubmission is unnecessary, and offers **Retry Analysis**.
9. Retry Analysis uses only the stored Venture ID and does not call `POST /api/ventures` again.
10. If initial Venture creation fails, the form remains available and displays a generic submission error, allowing a complete retry.

The stored Venture ID and duplicate prevention exist only in component memory. Reloading or remounting the page clears them.

## 6. Missing or incomplete data connections

### Verified gaps

- The supporting-document callback only logs selected files. It does not upload them or connect them to `Venture.documents`.
- The Venture-creation route does not use the signed-in user because its authentication check is commented out. It uses the first User or creates a development User.
- The AI-analysis route does require a NextAuth session, creating inconsistent authentication requirements between creation and analysis. This explains the observed `201` followed by `401` flow.
- Duplicate prevention survives only for the current mounted form instance. A page reload after creation loses the stored ID.
- The Venture creation API starts background AI tasks in addition to the explicit `/api/ai/analyze-venture` call. Ownership and intended separation of these two analysis paths should be reviewed.
- The analysis Activity uses `session.user.email` as `userId`; the Prisma relationship expects a User ID. This may fail unless the session value and database ID happen to match.
- The inspected route-level README is partly stale: it refers to `desktop/desktop-view.tsx`, while the current `page.tsx` renders the form and guidelines directly, and some listed component paths no longer match the split-step structure.
- No Khmer guideline content file exists yet.

### Needs confirmation

- Which backend service will own supporting-document storage and the document metadata contract.
- Whether the product requires the synchronous analysis route, the creation-route background analyses, or both.
- The intended authenticated-user mapping for Venture ownership and Activity creation.
- Whether guideline timing statements and the `support@miv.org` address are approved operational content.
- Whether the current AI provider and model configuration will remain after backend/database migration.

## 7. Work completed this trimester

**Verified from Git history and PR #92:**

- Reviewed and improved the six-step form.
- Added per-step validation and readiness defaults.
- Corrected Submit & Analyze visibility and submitting-state behaviour.
- Added API-boundary conversion for team size and founding year.
- Colocated Venture Intake-specific form, schema, content and guideline components in the feature folder.
- Replaced long guideline content with an accessible accordion.
- Separated English guideline content into a typed, locale-ready file.
- Added partial-success handling for AI-analysis failure.
- Stored the created Venture ID in component state and prevented duplicate creation during Retry Analysis.
- Added accessible required-field communication, error relationships, live regions, focus management and larger touch targets.
- Improved layouts for narrow screens while preserving the existing desktop composition.
- The later Integration commit `99a9692` split each form step into a separate component and moved shared step options/types into feature-local files. This later refactor was authored separately and should not be claimed as the student's own work.

## 8. Known issues and limitations

- AI analysis returns 401 when no valid NextAuth session is available.
- The root authentication fix belongs to shared authentication/backend ownership and should not be bypassed in the frontend.
- Supporting documents are not persisted.
- Creation currently depends on development-user fallback behaviour.
- Analysis response fields are typed as `any` in the frontend.
- The success view's **View Venture Dashboard** button has no inspected navigation handler.
- The analysis response may vary by AI provider; only JSON parsing has a local fallback.
- The fallback scoring rules are simple heuristics, not a confirmed investment methodology.
- The page does not recover the created Venture ID after refresh.
- Feature documentation needs updating after the later split-step refactor.

## 9. Recommendations for next trimester

1. **Authentication and ownership:** make Venture creation and AI analysis use the same authenticated user and resolve User ID mapping in the backend.
2. **Backend migration:** move Prisma schema, migrations and direct database responsibility fully into the backend, then replace frontend route assumptions with a documented backend API contract.
3. **Document upload:** implement a backend-owned upload/storage endpoint, validation, progress and association to the created Venture.
4. **Idempotency:** add a backend idempotency key or draft/submission identifier so refreshes and network retries cannot create duplicates.
5. **Analysis architecture:** choose one authoritative analysis workflow and avoid overlapping background and explicit analysis processes.
6. **Types:** define a typed AI-analysis response instead of using `any`.
7. **Automated coverage:** add component and API-contract tests for all six steps, numeric conversion, creation failure, analysis success, 401 partial success and Retry Analysis.
8. **Localisation:** add an approved `guidelines.km.ts` using the same typed keys; do not machine-translate sensitive guidance without review.
9. **Content review:** verify support contact details, timing statements and guideline accuracy with the feature owner.
10. **README maintenance:** update the route README to match the current split-step structure and actual rendering entry point.

## 10. Relevant files, routes and public URLs

### Frontend files

- `miv/app/dashboard/(g2-founder-submission)/venture-intake/page.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/venture-intake-form.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/field-error.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-1-basic-information.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-2-team-foundation.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-3-market-business.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-4-readiness-assessment.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-5-accessibility-dli.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/step-6-gedsi-goals.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/venture-intake-options.ts`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/steps/venture-intake-step-props.ts`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/guidelines/venture-guidelines.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/components/guidelines/guideline-accordion.tsx`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/content/guidelines.en.ts`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/schemas/venture-intake-schema.ts`
- `miv/app/dashboard/(g2-founder-submission)/venture-intake/README.md`
- Shared upload UI: `miv/components/ui/file-upload.tsx`

### API and database files

- Venture API: `miv/app/api/(g3-venture-pipeline)/ventures/route.ts`
- AI-analysis API: `miv/app/api/(g4-reporting-insights)/ai/analyze-venture/route.ts`
- Current Prisma model: `miv/prisma/schema.prisma`

### Runtime URLs

- Page: `/dashboard/venture-intake`
- Venture creation: `POST /api/ventures`
- AI analysis: `POST /api/ai/analyze-venture`
- Typical local page URL: `http://localhost:3000/dashboard/venture-intake`

No deployed public host was verified during this inspection.

## 11. Testing performed

### Verified historical evidence

The PR #92 merge commit records the following completed checks:

- Form component review.
- Step-by-step validation.
- Venture submission.
- Success and partial-success states.
- Error feedback.
- Keyboard accessibility.
- Mobile layouts at 360px and 390px.
- Desktop layout functionality.
- `git diff --check`.
- Focused TypeScript verification for Venture Intake.

The PR record also states that Venture creation returned HTTP 201, AI analysis returned HTTP 401 without a valid NextAuth session, and the UI allowed analysis retry without creating a second Venture.

### Evidence boundary

No automated Venture Intake test file was found by the current filename/path search. Tests were not rerun while producing this handover, so this document does not claim that the historical results still pass on the present branch. The current branch should receive a fresh type check and browser/API regression run before release.

## 12. Evidence placeholders

- **PR #92 URL:** `(https://github.com/InnovAIte-Deakin/Venture-Pipeline-Management-System/pull/92)`
- **Primary merge commit:** `93d7f03`
- **Feature implementation commit:** `3c14197`
- **Accessibility commit:** `3a17e13`
- **Earlier step-validation commit:** `232a7f3`
- **GEDSI/submit commit:** `d802192`
- **Later Integration split-step commit (not authored as this student's work):** `99a9692`

## Handover note on database responsibility

The current Next.js application still imports Prisma directly from API routes, and `miv/prisma/schema.prisma` defines the relevant models. The project plan is to move Prisma, migrations and database responsibility fully to the backend. During that migration, the frontend team should treat the backend API contract as authoritative and verify all payload types, authentication, ownership rules, error formats and file-upload behaviour before removing the current frontend-side database routes.
