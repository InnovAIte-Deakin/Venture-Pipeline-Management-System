# VPMS - GEDSI Tracker

Data Flow & Handover Documentation

Task - GEDSI Tracker Module Implementation & Refactoring

| Item | Details |
| --- | --- |
| Feature | Dashboard - GEDSI Tracker |
| Task | Implementation and responsive UI refactoring |
| Current work | Frontend module isolation under App Router route group and responsive mobile/desktop views |
| Pull request | #107 - GEDSI Tracker Frontend Implementation |
| Handover purpose | Explain current frontend data structure, component hierarchy, file/folder purposes, accessibility/testing roadmap, and recommended future work |

## 1. Feature Overview

The GEDSI (Gender Equality, Disability, and Social Inclusion) Tracker provides a dashboard view of metrics related to gender equality, disability, and social inclusion. It presents high-level overview metrics, demographic filtering options, interactive details via modals, and structured desktop and mobile layouts.

The page supports responsive layouts and handles modular component separation for clean maintenance under the App Router route group.

## 2. Key Frontend Files, Folders, and Their Purposes

To support future developers jumping into this feature, the specific purpose of each file and folder within the GEDSI tracker module is outlined below:

| File / Folder Path | Purpose & Responsibility |
| --- | --- |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/` | Route group directory isolating the entire GEDSI tracker feature within the Next.js App Router layout. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/page.tsx` | Thin Next.js route component acting as the entry point that mounts the core tracker page layout. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/components/` | Directory containing modular UI sub-components used across the dashboard. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/components/overview-cards.tsx` | Displays high-level summary metrics, KPIs, and visual indicator badges. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/components/filters-bar.tsx` | Provides advanced filtering options, multi-select dropdowns, and search inputs. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/components/modals/` | Houses accessible dialog wrappers and detailed record views for deep-dive insights. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/desktop/` | Directory dedicated to wide-screen layout components. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/desktop/desktop-view.tsx` | Tailored tabular layout and comparative analytics optimized for wide screens. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/mobile/` | Directory dedicated to compact form-factor layout components. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/mobile/mobile-view.tsx` | Card-based stacking and touch-friendly UI optimized for smaller mobile screens. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/hooks/` | Directory containing custom React hooks for business logic encapsulation. |
| `app/dashboard/(impact-gedsi)/gedsi-tracker/hooks/use-gedsi-data.ts` | Centralizes business logic, data fetching, active filters, pagination, and loading states. |

## 3. What Data the Page Needs

| Data group | Fields / examples | Used for |
| --- | --- | --- |
| Inclusion metrics | genderRatios, disabilitySupportRate, inclusionScore | KPI cards and overview indicator badges |
| Demographic filters | sector, region, demographicCategory, search query | Filtering and slicing data across inclusion dimensions |
| Record details | recordId, participantName, category, status, timestamps | Populating desktop tables, mobile cards, and modal deep-dives |
| Summary calculations | totalRecordsFiltered, inclusionAverages, compliancePercentages | Dashboard summary widgets and high-level analytics |

## 4. Current Data Source, Database Integration, and Data Flow

The application architecture interacts with two separate database layers in the broader project stack (Payload CMS and Prisma), alongside fallback options. The exact breakdown per data requirement is identified below:

| Database / Data Layer | Identification & Usage Status | Details / Implementation |
| --- | --- | --- |
| **Payload CMS** | **Primary / Partially Used** | Used for structured content management, document schemas, and primary administrative record endpoints backing the dashboard content. |
| **Prisma** | **Secondary / Partially Used** | Utilized for relational data models, user profiles, and underlying organizational entity mapping where relational integrity is required. |
| **Mock Data / Fallbacks** | **Completely / Partially Mocked** | Used in local testing or specific unlinked analytics widgets where live database endpoints are still being wired via `use-gedsi-data.ts`. |

The tracker module relies on custom hook orchestration to fetch and manage state locally for rendering across view layouts.

| Step | Current flow |
| --- | --- |
| 1 | `page.tsx` mounts the dashboard module layout. |
| 2 | `use-gedsi-data.ts` manages asynchronous data fetching (coordinating with Payload/Prisma API endpoints or mock datasets) and state initialization. |
| 3 | `filters-bar.tsx` captures user-selected demographic and search options. |
| 4 | State filters and metrics are processed locally or through hook handlers. |
| 5 | The filtered model is passed down to `overview-cards.tsx`, `desktop-view.tsx`, and `mobile-view.tsx`. |
| 6 | Interactive row selections trigger modal components for granular record inspections. |

**Simplified flow:** Payload/Prisma API / Mock Data → `use-gedsi-data` hook → Local state & filter handling → Responsive desktop/mobile components & modals

## 5. API, Database, Static, Fallback and Local Data

| Category | Current implementation | Assessment |
| --- | --- | --- |
| API / Hook data | Handled via custom hook (`use-gedsi-data.ts`) | Provides core state management and asynchronous data orchestration. |
| Database Layer | Split between Payload CMS and Prisma models | Requires explicit identification per route (Payload for content/CMS entities, Prisma for relational records, or mock data for isolated components). |
| Static configuration | Demographic mapping and filter options defined locally/within constants | Appropriate for UI options, ensuring alignment with system-wide enums. |
| Local filtering | Filters, search parameters, and pagination handled client-side | Responsive for current data volume; scale considerations needed for larger datasets. |
| Fallback values | Default state placeholders for loading/error scenarios | Ensures graceful degradation when data streams are delayed. |

## 6. Data That Is Missing or Not Properly Connected

- Direct backend audit logs for individual inclusion modifications.
- Real-time websocket updates for collaborative filtering views.
- Fully automated export mechanisms for generated GEDSI compliance reports.
- Advanced multi-level drill-down parameters for localized regional demographics.

## 7. Recommended Work for Next Trimester & Future Implementation

### 1. Accessibility (a11y) Improvements
*   **WAI-ARIA Compliance:** Implement comprehensive ARIA roles, live regions for dynamic filter updates, and explicit labeling across all overview cards and data tables.
*   **Keyboard Navigation & Focus Management:** Ensure seamless tab-index sequencing through `filters-bar.tsx` and trap focus correctly inside active modal components.
*   **High Contrast & Screen Reader Optimization:** Add support for high-contrast themes and descriptive `aria-label` attributes for graphic indicators and charts.

### 2. Testing Strategy
*   **Unit & Hook Testing:** Implement Jest and React Testing Library tests for `use-gedsi-data.ts` to validate state filtering and asynchronous error handling.
*   **Component Testing:** Write isolated tests for `overview-cards.tsx` and `filters-bar.tsx` to verify user interactions and edge cases (e.g., empty filter states).
*   **End-to-End (E2E) Testing:** Integrate Cypress or Playwright test suites to validate cross-device navigation flows between `desktop-view.tsx` and `mobile-view.tsx`.

### 3. Additional Architectural Enhancements
*   **Server-Side Pagination:** Optimize performance for large datasets by moving filtering and pagination logic to the backend API layer.
*   **Export Functionality:** Enable direct PDF/CSV generation of filtered GEDSI analytics right from the UI dashboard header.

## 8. Handover Risks / Important Notes

- Client-side filtering performance should be monitored if record counts scale significantly beyond initial thresholds.
- UI components depend on strict prop contracts defined in the hook; direct data mutations outside of `use-gedsi-data.ts` should be avoided.
- Visual updates must preserve the isolated route group directory structure (`(impact-gedsi)/gedsi-tracker`) to prevent routing conflicts.

## 9. Current Status

The GEDSI tracker module implementation has been completed, structured into the App Router route group, and organized into clean component files (overview cards, filters bar, modals, desktop/mobile views, and custom hooks). PR #107 has been submitted for review. The focus moving forward is on accessibility compliance, test suite coverage, and advanced backend integrations.

## 10. Short Handover Summary for Team

**Current source:** Custom data hook (`use-gedsi-data.ts`) connecting to Payload CMS/Prisma database layers or mock data.

**Current architecture:** App Router route group (`(impact-gedsi)/gedsi-tracker`) with explicitly defined file/folder responsibilities and separated desktop/mobile views.

**Current calculations:** Client-side filter handling and state management.

**Database identification:** Explicitly states utilization of Payload CMS (for core CMS documents), Prisma (for relational records), and fallback mock data.

**Main gap:** Automated export tools, server-side pagination scaling, and comprehensive a11y/E2E test coverage.

**Next priority:** Implement WAI-ARIA accessibility enhancements, write unit/E2E testing suites, and maintain clean separation across Payload and Prisma data sources.
