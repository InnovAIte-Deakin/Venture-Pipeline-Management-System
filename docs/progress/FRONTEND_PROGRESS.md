**VPMS Weekly Progress – Frontend Stream**

Trimester 2, 2026

| Purpose: This document records the Frontend stream’s planned work, completed work, technical findings, and carry-over items for each sprint. It is maintained with support from the Documentation stream. |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

**Frontend Stream Scope**

The Frontend stream is responsible for implementing and maintaining the VPMS user interface, integrating frontend pages with backend APIs, supporting role-specific user experiences, improving mobile responsiveness and accessibility, and preparing the application for production deployment.

**Main Technologies**

- Next.js, React and TypeScript

- Tailwind CSS and reusable shadcn-style UI components

- Figma for UI/UX design and prototype validation

- REST API integration with the VPMS backend

- GitHub for branches, pull requests and code review

- Vercel as the intended frontend deployment platform

**Frontend Team Structure**

| **Group** | **Department**                | **Main Ownership**                                                                                      | **Expected Output**                                                                      |
|-----------|-------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| 1         | User Access & Security        | Login, signup, password recovery, Google SSO, protected routes, role redirection and JWT handling.      | Working authentication UI, route checks, redirect tests and an authentication issue log. |
| 2         | Founder Venture Submission    | Start New Venture flow, venture forms, document upload, validation and low-literacy founder experience. | Complete founder flow, upload states, mobile QA and founder journey notes.               |
| 3         | Admin Review & Pipeline       | Document review, venture review, readiness status, pipeline stages, filters and approval actions.       | Review tables, status-change flow, search/filter behaviour and workflow test cases.      |
| 4         | Dashboard, Impact & Reporting | Impact dashboard, analytics, GEDSI metrics, charts, funding tracker, AI insights and reporting.         | Dashboard UI, data-state checks, reports, export layouts and integration evidence.       |
| 5         | Platform Quality & Experience | Global search, notifications, support, settings, responsiveness, accessibility and release readiness.   | Responsive QA, accessibility review, interface consistency and frontend handover notes.  |

**Onboarding - Weeks 1 to 2**

**Planned**

- Review the previous trimester’s frontend progress, handover documents, approved designs and unfinished work.

- Meet with the Product Owner, project leaders, Backend stream and Documentation stream to confirm the T2 2026 direction.

- Review the frontend repository, system architecture, known issues and mobile-first requirements.

- Divide the Frontend stream into product-area groups with clear ownership.

- Assign technical, UI/UX, testing, accessibility, integration and documentation responsibilities.

- Create the Frontend Weekly Planner and establish communication channels.

**Completed**

- Reviewed previous frontend achievements, including authentication interfaces, role-based dashboards, document upload, impact dashboards, global search, diagnostic pages and Help & Support.

- Reviewed previous mobile-first Figma work, navigation improvements, accessibility changes and user journey refinements.

- Reviewed the current repository and identified technical risks that should be addressed before large new features are developed.

- Organised the Frontend stream into five product departments with clear expected outputs.

- Allocated team members based on preferred role, skills and project needs.

- Established the team rule that every group should include a balance of UI/UX, implementation, integration checking, testing, accessibility and documentation.

- Prepared the initial Frontend Weekly Planner and Sprint 1 work areas.

**Technical Findings Identified During Onboarding**

| **Area**              | **Finding**                                                                                                                            |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Authentication**    | Multiple approaches are currently mixed, including NextAuth, Payload authentication, backend cookies and temporary frontend bypasses.  |
| **Protected Routes**  | Some dashboard layouts currently force authentication to succeed instead of validating a real session.                                 |
| **API Security**      | Several frontend API routes do not consistently enforce authentication or role permissions.                                            |
| **Architecture**      | Frontend and backend responsibilities overlap, creating unclear sources of truth for data and authentication.                          |
| **API Usage**         | API calls are spread across pages and components and use different route formats.                                                      |
| **Page Complexity**   | Several dashboard pages contain more than 1,000 to 3,000 lines, making them difficult to maintain and adapt for mobile.                |
| **Mobile Readiness**  | The application contains responsive classes but is not yet fully mobile-first, especially in the user dashboard and table-heavy pages. |
| **Accessibility**     | Browser zoom is disabled and scrollbars are hidden, which may create accessibility issues.                                             |
| **Production Safety** | Test routes, seed routes, mock data, duplicate pages and development files require cleanup before deployment.                          |
| **Developer Setup**   | Windows setup, package management and dependency installation require standardisation.                                                 |

**Ready to Carry into Sprint 1**

- Confirm ticket ownership and the assigned product-area groups.

- Set up and run the frontend project locally.

- Record setup problems and technical blockers.

- Confirm the canonical frontend branch and package manager.

- Begin the first technical contribution for each team member.

- Start authentication, API, responsiveness, accessibility and page-quality checks.

- Define evidence requirements for pull requests, testing and weekly documentation.

**Sprint 1 – Weeks 3 to 4**

**Planned**

**Frontend Coordination**

- Create and assign Sprint 1 tickets.

- Confirm one technical contribution for every Frontend team member.

- Establish GitHub branch, commit, pull request, review and testing expectations.

- Coordinate with the Backend stream about API contracts and authentication.

- Provide weekly progress updates to the Documentation stream.

**Group 1 – User Access and Security**

- Review login and signup interfaces.

- Review forgot-password and reset-password flows.

- Verify Google SSO behaviour.

- Review JWT and session handling.

- Test protected routes and role-based redirection.

- Prepare an authentication issue log.

**Group 2 – Founder Venture Submission**

- Review the Start New Venture journey.

- Review venture forms, field validation and form states.

- Review document upload UI and upload status.

- Check file-type and file-size messages.

- Test loading, success, validation and error states.

- Perform mobile form QA for users with low digital literacy.

**Group 3 – Admin Review and Pipeline**

- Review admin venture and document tables.

- Review document preview and review interfaces.

- Review approval, rejection and request-changes actions.

- Review pipeline-stage displays.

- Check filtering and search behaviour.

- Prepare review workflow test cases and identify mobile table issues.

**Group 4 – Dashboard, Impact and Reporting**

- Review the Impact Dashboard and analytics cards.

- Check GEDSI, radar-chart and funding tracker interfaces.

- Review AI Insights and reporting interfaces.

- Review report and export layouts.

- Add loading, empty, error and unavailable-data states.

**Group 5 – Platform Quality and Experience**

- Review global search and notifications.

- Review Help & Support, Settings and Edit Profile.

- Perform responsive QA and accessibility checks.

- Record inconsistent layouts, components and terminology.

- Begin frontend handover documentation.

**Completed**

This section should be updated each week by the Frontend lead and Documentation stream. Only work that has been implemented and tested should be recorded as completed. Figma-only work should be marked as Design Completed.

| **Ticket** | **Area**           | **Work Completed**                                                 | **Technical Evidence**                            | **Status** |
|------------|--------------------|--------------------------------------------------------------------|---------------------------------------------------|------------|
| FE-XXX     | Authentication     | Removed a temporary authentication bypass from a dashboard layout. | Pull request, screenshots and route test results. | Completed  |
| FE-XXX     | Venture Submission | Added validation and error states to document upload.              | Pull request and mobile test evidence.            | Completed  |
| FE-XXX     | Admin Review       | Created a mobile card view for the review table.                   | Pull request and responsive screenshots.          | Completed  |
| FE-XXX     | Dashboard          | Connected dashboard cards to an API response.                      | Pull request and API test evidence.               | Completed  |
| FE-XXX     | Platform Quality   | Restored browser zoom and improved accessible labels.              | Pull request and accessibility evidence.          | Completed  |

**Technical Information to Record for Every Completed Contribution**

- Ticket number and feature name.

- Contributor and reviewer.

- Page, route, component or file changed.

- GitHub branch and pull request.

- API endpoint used or modified.

- Authentication and role requirements.

- Data source and request/response format.

- Validation rules and business rules.

- Loading, empty, success, permission-denied and error states.

- Desktop and mobile behaviour.

- Accessibility changes.

- Testing completed and evidence provided.

- Known limitations and remaining risks.

- Related backend dependency.

- Environment variable, configuration or setup change.

**Carried Over to Sprint 2**

- Authentication architecture decision.

- Removal of dashboard authentication bypasses.

- Standardised frontend API client.

- Backend API integration blockers.

- Mobile navigation implementation.

- Mobile table-to-card conversion.

- Large-page refactoring.

- Accessibility fixes.

- Removal of mock or static production data.

- Windows setup standardisation.

- Remaining test failures or unresolved pull-request feedback.
