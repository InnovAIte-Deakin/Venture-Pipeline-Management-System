# Page Refactor Priority

## Purpose and scope

This report audits the canonical active frontend route pages on
`refactor/miv-clean-baseline` under:

- `miv/app/dashboard/**/page.tsx`
- `miv/app/user-dashboard/**/page.tsx`
- `miv/app/auth/**/page.tsx`
- `miv/app/page.tsx`

The inventory was taken on 2026-07-25. Archived files, backups, alternate
implementations, test routes, and files outside the requested paths were not
counted. In particular, this excludes the archived/test material under
`miv/archive`, the removed `dashboard/test-environment` route, the removed
`app/test-*` routes, the archived capital-facilitation variants, the removed
dashboard backup, and `miv/app/venture-intake/page.tsx` because that last route
is outside the requested path set.

No conclusion in this report authorizes Prompt 8 or a source-code change.

## Counting method

- **LOC** is the physical line count of the current file.
- **S** is the number of `useState` calls (one state value per call).
- **E** is the number of `useEffect` calls.
- **F** is the number of direct global `fetch(...)` call sites in the page.
  Calls hidden behind an API client are not counted as direct fetches. This is
  why `/dashboard/ventures` has `F=0` even though it loads data through
  `@/lib/api/ventures`.
- **D** is the number of dialog/modal JSX definitions in the page, including
  custom full-screen modal overlays. It is source-definition count, not the
  number of dialogs that a mapped list could create at runtime.
- **T** is the number of rendered HTML or UI-library table definitions.
- **C** is the number of rendered chart definitions. Recharts axes, legends,
  tooltips, and containers are not counted as separate charts. Two hand-built
  SVG/CSS chart definitions in each user-dashboard page are counted.
- **X** is the number of substantial inline data/render transformation blocks:
  a `.map`, `.filter`, `.reduce`, or `.sort` callback spanning at least six
  lines. This deliberately includes large repeated JSX mappings because those
  blocks increase the risk of changing page layout for mobile.
- **Logic mixed** indicates that domain calculations, data shaping, API
  orchestration, or mutation workflows live in the page alongside rendering.
- **Reuse** distinguishes a strong domain/page component boundary from use of
  UI primitives only. “None” means the page is largely raw JSX even if it uses
  icon components.
- **Static** describes the active page UI, not whether the file happens to
  contain static fixture data.

## Classification summary

| Category | Meaning | Count |
| --- | --- | ---: |
| A | Must refactor before mobile work | 22 |
| B | Should refactor later | 6 |
| C | Small and safe; no refactor needed | 11 |
| D | Duplicate, test-only, obsolete, or unclear | 1 |
| **Total** | **Active pages reviewed** | **40** |

## Page-by-page audit

| Route | File path | LOC | S | E | F | D | T | C | X | Logic mixed | Reuse | Mainly static | Complexity summary |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| `/` | `miv/app/page.tsx` | 1,272 | 7 | 2 | 0 | 1 | 0 | 0 | 3 | Light | UI primitives plus `Logo` | Yes | Very large marketing page with navigation, accessibility overlay, repeated feature/pricing/testimonial content, and responsive section layout in one component. |
| `/auth/login` | `miv/app/auth/login/page.tsx` | 187 | 5 | 0 | 1 | 0 | 0 | 0 | 0 | Light form/request orchestration | UI primitives only | No | Small authentication form with password visibility, error/loading state, one request, and redirect handling. |
| `/auth/register` | `miv/app/auth/register/page.tsx` | 252 | 5 | 0 | 1 | 0 | 0 | 0 | 0 | Light form/request orchestration | UI primitives only | No | Small registration form; its field count is higher than login but the state and submission flow remain local and understandable. |
| `/dashboard` | `miv/app/dashboard/page.tsx` | 1,480 | 16 | 1 | 5 | 1 | 0 | 0 | 10 | Yes | Strong: analytics, data-table, filters, notifications, and workflow components | No | Large orchestration page combining five requests, aggregate calculations, filters, notifications, export/logout actions, tab composition, and enterprise widgets. |
| `/dashboard/advanced-reports` | `miv/app/dashboard/advanced-reports/page.tsx` | 1,394 | 22 | 1 | 5 | 0 | 0 | 4 | 12 | Yes | UI primitives only | No | Report generation, scheduling, export, chart selection, five data sources, dashboard-builder drag/drop, and derived analytics all share one page. |
| `/dashboard/ai-analysis` | `miv/app/dashboard/ai-analysis/page.tsx` | 590 | 6 | 1 | 1 | 0 | 0 | 0 | 8 | Yes | UI primitives only | No | Moderate analysis workspace with locally generated risk scores, recommendations, and insights plus venture selection and analysis-result rendering. |
| `/dashboard/calendar` | `miv/app/dashboard/calendar/page.tsx` | 793 | 10 | 2 | 2 | 0 | 0 | 0 | 10 | Yes | UI primitives only | No | Near-800-line calendar with two data flows, search/type/priority/status filters, month navigation, multiple views, analytics, and event rendering. |
| `/dashboard/capital-facilitation` | `miv/app/dashboard/capital-facilitation/page.tsx` | 899 | 7 | 1 | 1 | 0 | 0 | 0 | 10 | Yes | UI primitives only | No | Converts venture records into capital requests, investors, funding stages, progress, decisions, and timelines through page-local calculations. |
| `/dashboard/custom-dashboards` | `miv/app/dashboard/custom-dashboards/page.tsx` | 1,020 | 11 | 2 | 2 | 2 | 0 | 2 | 3 | Yes | UI primitives only | No | Dashboard catalog, filters, portfolio data, create/edit/delete/duplicate/favourite actions, widget configuration, two dialogs, and chart previews are coupled. |
| `/dashboard/deal-flow` | `miv/app/dashboard/deal-flow/page.tsx` | 2,648 | 17 | 1 | 1 | 4 | 1 | 0 | 12 | Yes | UI primitives only | No | Very large pipeline page with business scoring, venture-to-deal mapping, many filters, board/table modes, export, and four substantial dialogs. |
| `/dashboard/diagnostics` | `miv/app/dashboard/diagnostics/page.tsx` | 476 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | No active logic; obsolete declarations remain | Strong: `ReadinessTracker` | Delegated | The active page renders only a heading and `ReadinessTracker`; almost the entire file is unused fixture data, types, imports, and helpers from an obsolete implementation. |
| `/dashboard/documents` | `miv/app/dashboard/documents/page.tsx` | 792 | 10 | 2 | 5 | 0 | 1 | 0 | 4 | Yes | UI primitives only | No | Near-800-line document manager with initial and filtered loading, upload/drop handling, delete mutation, analytics, filters, and a wide action table. |
| `/dashboard/due-diligence` | `miv/app/dashboard/due-diligence/page.tsx` | 3,222 | 30 | 1 | 1 | 4 | 1 | 0 | 16 | Yes | UI primitives only | No | Largest page in scope: scoring and checklist generation, grouping, filtering, sorting, paging, selection, reporting, venture/item views, and four dialogs are intertwined. |
| `/dashboard/exit-strategy` | `miv/app/dashboard/exit-strategy/page.tsx` | 1,430 | 11 | 1 | 1 | 2 | 1 | 3 | 21 | Yes | UI primitives only | No | Venture transformation, market comparables, exit scenarios, filtering, three charts, table/card views, and two implemented planning dialogs form a monolith. |
| `/dashboard/fund-management` | `miv/app/dashboard/fund-management/page.tsx` | 2,565 | 20 | 2 | 1 | 3 | 5 | 1 | 29 | Yes | UI primitives only | No | Dense multi-domain workspace for funds, LPs, calls, distributions, operations, reports, documents, lifecycle, five tables, a chart, and three dialogs. |
| `/dashboard/gedsi-tracker` | `miv/app/dashboard/gedsi-tracker/page.tsx` | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | No | Strong: `GEDSITracker` | Delegated | Ideal route wrapper; all feature behavior is already outside the page. |
| `/dashboard/help-support` | `miv/app/dashboard/help-support/page.tsx` | 306 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | No | UI primitives only | Yes | Static help cards, FAQ/tutorial content, and an unconnected contact form; long only because the content is written explicitly. |
| `/dashboard/impact-documents` | `miv/app/dashboard/impact-documents/page.tsx` | 528 | 9 | 2 | 4 | 0 | 1 | 0 | 3 | Yes | None | No | Raw-HTML document administration page with load/filter state, status mutation, delete/download flows, summary stats, and a responsive-table risk. |
| `/dashboard/impact-reports` | `miv/app/dashboard/impact-reports/page.tsx` | 575 | 4 | 1 | 2 | 0 | 1 | 2 | 10 | Yes | UI primitives only | No | Two-source reporting page computes portfolio and GEDSI aggregates inline and renders KPI cards, two charts, a sector table, and export behavior. |
| `/dashboard/investment-rounds` | `miv/app/dashboard/investment-rounds/page.tsx` | 1,618 | 15 | 1 | 1 | 2 | 1 | 0 | 15 | Yes | UI primitives only | No | Large venture-to-round transformation, GEDSI/risk/target calculations, six filters, card/table views, export, and add/view dialogs. |
| `/dashboard/iris-metrics` | `miv/app/dashboard/iris-metrics/page.tsx` | 162 | 5 | 1 | 1 | 0 | 1 | 0 | 1 | Light | UI primitives only | No | Small searchable, paginated metric catalog with one request and a four-column table. |
| `/dashboard/notifications` | `miv/app/dashboard/notifications/page.tsx` | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | No | Strong: feature page re-export | Delegated | Ideal route-level re-export of the notification feature page. |
| `/dashboard/performance-analytics` | `miv/app/dashboard/performance-analytics/page.tsx` | 1,145 | 5 | 2 | 4 | 0 | 0 | 5 | 16 | Yes | UI primitives only | No | Four-source analytics orchestration, KPI and trend calculations, generated insights/risk/optimisation data, real-time polling, five charts, and tabbed detail. |
| `/dashboard/portfolio` | `miv/app/dashboard/portfolio/page.tsx` | 1,393 | 12 | 2 | 1 | 2 | 0 | 0 | 6 | Yes | UI primitives only | No | Venture transformation, score/insight calculations, filters, export, company detail, keyboard/body-scroll effects, and two custom full-screen modals. |
| `/dashboard/social-impact` | `miv/app/dashboard/social-impact/page.tsx` | 754 | 6 | 1 | 1 | 0 | 0 | 1 | 7 | Yes | UI primitives only | No | Impact/GEDSI aggregation, category/status filtering, many derived indicators, cards and progress lists, and a pie chart are page-local. |
| `/dashboard/sustainability` | `miv/app/dashboard/sustainability/page.tsx` | 919 | 5 | 1 | 1 | 0 | 0 | 4 | 5 | Yes | UI primitives only | No | Large analytics page deriving environmental, social, carbon-credit, and nature-project data and rendering four charts plus a digital-twin mode. |
| `/dashboard/system-settings` | `miv/app/dashboard/system-settings/page.tsx` | 1,141 | 18 | 1 | 2 | 0 | 0 | 1 | 0 | Yes | UI primitives only | No | Six settings domains, profile/password requests, independent save statuses, import/export handlers, theme/accessibility state, and a performance chart share one page. |
| `/dashboard/team-management` | `miv/app/dashboard/team-management/page.tsx` | 1,536 | 16 | 3 | 8 | 6 | 0 | 0 | 11 | Yes | UI primitives only | No | Four resources each have request/mutation logic; member/project search, cards, detail views, and six dialog definitions make mobile interaction risk high. |
| `/dashboard/venture-intake` | `miv/app/dashboard/venture-intake/page.tsx` | 303 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | No | Strong: `VentureIntakeForm` | Mostly | The interactive form is already extracted; the route page mainly supplies guidance, tips, support, and privacy content. |
| `/dashboard/ventures` | `miv/app/dashboard/ventures/page.tsx` | 438 | 7 | 1 | 0 | 0 | 1 | 0 | 2 | Moderate | UI primitives plus shared API client | No | Maintainable venture index with client-based loading, search and three filters, summary reductions, routing, and one wide table. |
| `/dashboard/ventures/[id]` | `miv/app/dashboard/ventures/[id]/page.tsx` | 931 | 3 | 1 | 1 | 0 | 0 | 0 | 12 | Yes | UI primitives only | No | Low state count masks a very large detail renderer with formatting and GEDSI calculations, many tab sections, activity lists, financials, and nested data maps. |
| `/dashboard/workflows` | `miv/app/dashboard/workflows/page.tsx` | 137 | 2 | 1 | 2 | 0 | 0 | 0 | 1 | Light | UI primitives only | No | Compact workflow list with load and run actions; the two direct requests do not create a large page-level maintenance burden. |
| `/dashboard/workflows/[id]/builder` | `miv/app/dashboard/workflows/[id]/builder/page.tsx` | 716 | 7 | 2 | 4 | 0 | 0 | 0 | 8 | Yes | UI primitives only | No | Drag-positioned workflow canvas, node editor, definition conversion, save/run actions, run history, and pointer handling present high touch/mobile risk. |
| `/dashboard/workflows/[id]/monitor` | `miv/app/dashboard/workflows/[id]/monitor/page.tsx` | 429 | 4 | 1 | 3 | 0 | 0 | 0 | 1 | Moderate | UI primitives only | No | Moderate monitor with workflow/run loading, manual execution, run statistics, status formatting, tabs, and a selected-run detail panel. |
| `/dashboard/workflows/wizard` | `miv/app/dashboard/workflows/wizard/page.tsx` | 663 | 7 | 1 | 2 | 0 | 0 | 0 | 5 | Yes | UI primitives only | No | Multi-step template, trigger, action-array, review, ownership lookup, and create flow is maintainable now but risky to adapt inline for mobile. |
| `/user-dashboard` | `miv/app/user-dashboard/page.tsx` | 313 | 1 | 0 | 0 | 0 | 0 | 2 | 4 | No | None | Yes | Mostly fixture-driven dashboard cards with quick links, notifications, KPIs, and two simple hand-built CSS charts. |
| `/user-dashboard/diagnostics` | `miv/app/user-dashboard/diagnostics/page.tsx` | 215 | 0 | 0 | 0 | 0 | 0 | 2 | 1 | Light score-display calculations | None | Yes | Static venture diagnostic detail with two hand-built SVG donut charts and assessment-area bars; compact despite raw JSX. |
| `/user-dashboard/documents` | `miv/app/user-dashboard/documents/page.tsx` | 427 | 8 | 1 | 4 | 0 | 0 | 0 | 1 | Yes | None | No | Upload/drop, per-file upload progress, load/delete/download requests, filters, messages, and raw card rendering create moderate mobile upload risk. |
| `/user-dashboard/profile` | `miv/app/user-dashboard/profile/page.tsx` | 317 | 6 | 1 | 3 | 0 | 0 | 0 | 0 | Yes | None | No | Profile load/save and password-change flows, two message channels, raw form controls, and duplicated request handling sit just above the small-page boundary. |
| `/user-dashboard/support` | `miv/app/user-dashboard/support/page.tsx` | 183 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | No | None | Yes | Small static support/FAQ page with one accordion index state and direct contact links. |

## Refactor decisions and recommended order

The order below is a risk order, not an instruction to refactor every Category A
page in one change. Each page should retain its current route contract. Domain
logic/hooks should be separated before responsive layout work begins.

### Category A — must refactor before mobile work

| Order | Route | Refactor recommendation | Suggested extracted components/hooks | Mobile risk |
| ---: | --- | --- | --- | --- |
| A01 | `/dashboard/due-diligence` | Split data/domain logic, list/detail modes, reports, and dialogs before any responsive redesign. | `useDueDiligenceData`, `dueDiligenceCalculations`, `DueDiligenceFilters`, `VentureDueDiligenceList`, `ChecklistTable`, `ReportConfigDialog`, `DueDiligenceItemDialogs` | Critical |
| A02 | `/dashboard/deal-flow` | Establish a page shell around a deal-flow feature and isolate score/mapping logic and each view/dialog. | `useDealFlow`, `dealFlowCalculations`, `DealFlowFilters`, `PipelineBoard`, `DealTable`, `DealDetailDialog`, `DealEditorDialog`, `StageDealsDialog` | Critical |
| A03 | `/dashboard/fund-management` | Divide by fund-management domain and move response shaping and status rules out of the renderer. | `useFundManagement`, `FundOverview`, `FundLifecyclePanel`, `LimitedPartnerTable`, `CapitalCallsTable`, `DistributionsTable`, `FundOperationsPanel`, fund dialogs | Critical |
| A04 | `/dashboard/team-management` | Create resource hooks/services and independent tab sections; extract all create/detail dialogs. | `useTeamMembers`, `useProjects`, `useAnnouncements`, `useTeamEvents`, `TeamMembersPanel`, `ProjectsPanel`, `AnnouncementsPanel`, `EventsPanel`, dialog components | Critical |
| A05 | `/dashboard` | Keep the existing enterprise components, but turn the page into an orchestration shell with one dashboard data hook and extracted summary/tab sections. | `useEnterpriseDashboardData`, `dashboardAggregates`, `DashboardHeader`, `DashboardKpis`, `VentureOverviewTab`, `DashboardFilterDialog` | High |
| A06 | `/dashboard/advanced-reports` | Separate data loading, report configuration/generation, chart rendering, and dashboard-builder behavior. | `useAdvancedReportsData`, `ReportFilters`, `ReportConfiguration`, `ReportChart`, `ReportSchedulePanel`, `DashboardBuilder`, `useDashboardLayout` | Critical |
| A07 | `/dashboard/investment-rounds` | Move venture-to-round conversion and risk/GEDSI calculations into domain helpers, then split list/table and dialogs. | `useInvestmentRounds`, `investmentRoundCalculations`, `RoundFilters`, `RoundCards`, `InvestmentRoundsTable`, `AddRoundDialog`, `RoundDetailDialog` | High |
| A08 | `/dashboard/exit-strategy` | Separate strategy transformation/scenario calculations from presentation and isolate each visualization and dialog. | `useExitStrategies`, `exitStrategyCalculations`, `ExitStrategyFilters`, `StrategyCards`, `ExitStrategyTable`, `ScenarioCharts`, `ScenarioPlannerDialog`, `PlanExitDialog` | High |
| A09 | `/dashboard/performance-analytics` | Extract analytics loading/polling and all generated insight calculations before changing the chart grid. | `usePerformanceAnalytics`, `performanceCalculations`, `AnalyticsKpis`, `TrendCharts`, `AIInsightsPanel`, `RiskAssessmentPanel`, `OptimisationPanel` | High |
| A10 | `/dashboard/portfolio` | Move company mapping/scoring and action workflows into a feature hook; replace custom overlays with isolated dialog components. | `usePortfolio`, `portfolioCalculations`, `PortfolioFilters`, `PortfolioGrid`, `CompanyDetailDialog`, `PortfolioActionDialog`, `PortfolioExportAction` | High |
| A11 | `/dashboard/system-settings` | Split each settings domain into a section/form and centralise save/load state in hooks or form controllers. | `useUserSettings`, `ProfileSettingsForm`, `PasswordForm`, `NotificationSettings`, `AccessibilitySettings`, `AppearanceSettings`, `DataSettings`, `SystemPerformancePanel` | High |
| A12 | `/dashboard/custom-dashboards` | Separate catalog/query state, mutations, dashboard editor forms, and chart/widget preview rendering. | `useCustomDashboards`, `DashboardFilters`, `DashboardCatalog`, `DashboardCard`, `DashboardEditorDialog`, `WidgetPreview`, `PortfolioChart` | High |
| A13 | `/dashboard/sustainability` | Extract sustainability derivations and chart-ready models, then componentise each analytics section. | `useSustainabilityData`, `sustainabilityCalculations`, `SustainabilityKpis`, `ESGRadar`, `CarbonCharts`, `NatureProjectsPanel`, `DigitalTwinPanel` | High |
| A14 | `/dashboard/capital-facilitation` | Move all venture-to-capital calculations into a domain adapter and split the request, investor, and timeline views. | `useCapitalFacilitation`, `capitalFacilitationCalculations`, `CapitalRequestList`, `CapitalRequestDetail`, `InvestorPartnersPanel`, `FundingTimeline` | High |
| A15 | `/dashboard/ventures/[id]` | Turn the route into data loading plus a composed venture-detail feature; move GEDSI and formatting logic out of JSX. | `useVentureDetail`, `ventureDetailCalculations`, `VentureHeader`, `VentureOverview`, `FinancialsPanel`, `GEDSIProfile`, `ActivityTimeline`, detail tab components | High |
| A16 | `/` | Break the long marketing page into semantic sections while preserving content and behavior; do this before mobile styling to avoid editing one 1,272-line JSX tree. | `MarketingHeader`, `HeroSection`, `PlatformFeatures`, `HowItWorks`, `ImpactMetrics`, `PricingSection`, `Testimonials`, `MarketingFooter`, `AccessibilityPanel` | High layout risk; low business risk |
| A17 | `/dashboard/calendar` | Extract calendar data/query state, filter controls, and each calendar/list representation before responsive work. | `useCalendarData`, `CalendarHeader`, `CalendarFilters`, `CalendarGrid`, `CalendarAgenda`, `EventCard`, `CalendarAnalytics` | High |
| A18 | `/dashboard/documents` | Separate query/upload/mutation logic and provide distinct desktop-table and mobile-card presentation components. | `useDocuments`, `useDocumentUpload`, `DocumentFilters`, `DocumentDropzone`, `DocumentTable`, `DocumentCards`, `DocumentAnalytics` | High |
| A19 | `/dashboard/workflows/[id]/builder` | Isolate the workflow model adapter and pointer/drag behavior from node editing and run history before deciding the mobile interaction model. | `useWorkflowBuilder`, `workflowDefinitionAdapter`, `WorkflowCanvas`, `WorkflowNode`, `NodeEditor`, `WorkflowToolbar`, `RunHistoryPanel` | Critical interaction risk |
| A20 | `/dashboard/social-impact` | Extract impact aggregations and chart models, then split overview, category, and venture sections. | `useSocialImpactData`, `socialImpactCalculations`, `ImpactKpis`, `ImpactCategoryChart`, `ImpactCategoryPanel`, `VentureImpactList` | High |
| A21 | `/dashboard/impact-reports` | Move report aggregations/export orchestration out of the page and componentise the chart/table sections. | `useImpactReportData`, `impactReportCalculations`, `ImpactReportKpis`, `ImpactTrendChart`, `GEDSIChart`, `SectorImpactTable`, `ReportExportAction` | High |
| A22 | `/dashboard/impact-documents` | Introduce a document API hook and shared document presentation before adapting the table for small screens. | `useImpactDocuments`, `DocumentStats`, `ImpactDocumentFilters`, `ImpactDocumentTable`, `ImpactDocumentCards`, `DocumentStatusAction` | High |

### Category B — should refactor later

| Order | Route | Refactor recommendation | Suggested extracted components/hooks | Mobile risk |
| ---: | --- | --- | --- | --- |
| B01 | `/dashboard/ai-analysis` | Keep functional for mobile work if necessary, then extract generated analysis logic and the controls/results split. | `useAIAnalysis`, `analysisCalculations`, `AnalysisControls`, `AnalysisResults`, `InsightList`, `RecommendationList` | Medium |
| B02 | `/dashboard/workflows/wizard` | After the workflow builder, extract step definitions and workflow payload construction so the step layout can evolve independently. | `useWorkflowWizard`, `WorkflowTemplateStep`, `WorkflowDetailsStep`, `WorkflowTriggerStep`, `WorkflowActionsStep`, `WorkflowReviewStep` | Medium-high |
| B03 | `/dashboard/workflows/[id]/monitor` | Extract data/run actions and stats, leaving the route as a compact monitor composition. | `useWorkflowMonitor`, `RunStats`, `RunList`, `RunDetail`, `WorkflowMonitorHeader` | Medium |
| B04 | `/user-dashboard/documents` | Reuse the document hook/dropzone/mobile cards created for admin documents instead of maintaining a separate raw implementation. | Shared `useDocuments`, `DocumentDropzone`, `UserDocumentCard`, `UploadProgressList`, `DocumentMessage` | Medium-high |
| B05 | `/dashboard/ventures` | Retain the shared API client and later separate query/summary state from desktop table and mobile cards. | `useVentureList`, `VentureFilters`, `VentureSummaryCards`, `VentureTable`, `VentureCards` | Medium |
| B06 | `/user-dashboard/profile` | Later consolidate profile/password requests and split the two forms; no prerequisite for the first mobile pass. | `useUserProfile`, `ProfileForm`, `ChangePasswordForm`, `FormStatusMessage` | Medium |

### Category C — small and safe; no refactor needed

| Route | Refactor recommendation | Suggested extracted components | Mobile risk | Recommended order |
| --- | --- | --- | --- | --- |
| `/auth/login` | Keep as-is. A shared auth shell/password field is optional only if future auth screens create real duplication. | None now; optional `AuthCard` and `PasswordField` | Low | Do not include in Prompt 8 |
| `/auth/register` | Keep as-is; test the existing form responsively without structural refactoring. | None now; optional shared auth form primitives | Low | Do not include in Prompt 8 |
| `/dashboard/gedsi-tracker` | Keep the route wrapper exactly at this level of responsibility. | Already extracted: `GEDSITracker` | Low | Do not include in Prompt 8 |
| `/dashboard/help-support` | Keep as-is. Content arrays could reduce repetition, but extraction would not materially de-risk mobile work. | None required | Low | Do not include in Prompt 8 |
| `/dashboard/iris-metrics` | Keep as-is; use normal responsive-table treatment in place. | None required; optional `IRISMetricTable` only if reused | Low-medium | Do not include in Prompt 8 |
| `/dashboard/notifications` | Keep the route-level feature re-export. | Already extracted: notification feature page | Low | Do not include in Prompt 8 |
| `/dashboard/venture-intake` | Keep as-is; the complex form is already extracted and the remaining page is explanatory content. | Already extracted: `VentureIntakeForm` | Low | Do not include in Prompt 8 |
| `/dashboard/workflows` | Keep as-is. Two calls alone do not justify fragmenting this compact list page. | None required | Low-medium | Do not include in Prompt 8 |
| `/user-dashboard` | Keep as-is for now; it is a small static composition. Reassess only when fixture data is replaced with live dashboard data. | None required; optional chart components when data becomes live | Low-medium | Do not include in Prompt 8 |
| `/user-dashboard/diagnostics` | Keep as-is for now. The custom donut rendering is compact and the page has no request/state complexity. | None required | Low-medium | Do not include in Prompt 8 |
| `/user-dashboard/support` | Keep as-is. | None required | Low | Do not include in Prompt 8 |

### Category D — obsolete or unclear active implementation

| Route | Refactor recommendation | Suggested extracted components | Mobile risk | Recommended order |
| --- | --- | --- | --- | --- |
| `/dashboard/diagnostics` | Do not refactor the page for mobile. The active route already delegates to `ReadinessTracker`; first confirm that the unused fixture/types/helpers are obsolete, then remove them in a separately authorised cleanup task. | Already extracted: `ReadinessTracker`; no new component needed | Low for the active UI; medium cleanup ambiguity | Exclude from Prompt 8 |

## Prompt 8 execution order

Prompt 8 should operate on one coherent page/feature slice at a time in this
order:

1. `/dashboard/due-diligence`
2. `/dashboard/deal-flow`
3. `/dashboard/fund-management`
4. `/dashboard/team-management`
5. `/dashboard`
6. `/dashboard/advanced-reports`
7. `/dashboard/investment-rounds`
8. `/dashboard/exit-strategy`
9. `/dashboard/performance-analytics`
10. `/dashboard/portfolio`
11. `/dashboard/system-settings`
12. `/dashboard/custom-dashboards`
13. `/dashboard/sustainability`
14. `/dashboard/capital-facilitation`
15. `/dashboard/ventures/[id]`
16. `/`
17. `/dashboard/calendar`
18. `/dashboard/documents`
19. `/dashboard/workflows/[id]/builder`
20. `/dashboard/social-impact`
21. `/dashboard/impact-reports`
22. `/dashboard/impact-documents`

After mobile-critical work is unblocked, the Category B follow-up order is:

1. `/dashboard/ai-analysis`
2. `/dashboard/workflows/wizard`
3. `/dashboard/workflows/[id]/monitor`
4. `/user-dashboard/documents`
5. `/dashboard/ventures`
6. `/user-dashboard/profile`

## Pages that should not be refactored

The following pages should not be included in Prompt 8:

- `/auth/login`
- `/auth/register`
- `/dashboard/gedsi-tracker`
- `/dashboard/help-support`
- `/dashboard/iris-metrics`
- `/dashboard/notifications`
- `/dashboard/venture-intake`
- `/dashboard/workflows`
- `/user-dashboard`
- `/user-dashboard/diagnostics`
- `/user-dashboard/support`
- `/dashboard/diagnostics` — exclude from page refactoring; handle only as a
  separately authorised dead-code cleanup after confirming the obsolete
  declarations are unused.

## Final totals

1. **Total active pages:** 40
2. **Category A:** 22
3. **Category B:** 6
4. **Category C:** 11
5. **Category D:** 1
6. **Recommended Prompt 8 execution order:** the 22 Category A routes in the
   order listed above, followed only later by the six Category B routes.
7. **Pages that should not be refactored:** the 11 Category C pages and the one
   Category D page listed above.
