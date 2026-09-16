# Diagnostics Readiness Tracker Module — Development Documentation

## Overview

The **Diagnostics Readiness Tracker** is a frontend feature developed for the Venture Pipeline Management System (VPMS) dashboard under the admin review and readiness route group.

Its purpose is to help users review the requirements that must be completed before a venture can proceed to readiness assessment. The feature provides an interactive checklist, completion statistics, progress feedback and an overall readiness status.

This document records the current implementation of the feature, including its architecture, component structure, state-management approach, responsive design, testing coverage, known limitations and possible future improvements.

The feature implementation has been completed. However, repository integration work remains outstanding because the feature branch has not yet been synchronised with the latest `integration/frontend` branch and the pull request contains merge conflicts.

---

## Feature Location

The Diagnostics page is located at:

```text
miv/app/dashboard/(g3-admin-review-readiness)/diagnostics/page.tsx
```

The application route is:

```text
/dashboard/diagnostics
```

The reusable feature components are located in:

```text
miv/components/diagnostics/
```

Access to dashboard routes is controlled by the application’s shared authentication and proxy implementation. Authentication is not implemented directly inside the Diagnostics feature.

---

## Architecture and Directory Structure

The original Diagnostics page contained a large amount of page-level code, mock information and logic. It was refactored so that the page acts as a small route entry point while the Readiness Tracker is separated into reusable components.

The current structure is:

```text
miv/
├── app/
│   └── dashboard/
│       └── (g3-admin-review-readiness)/
│           └── diagnostics/
│               └── page.tsx
├── components/
│   └── diagnostics/
│       ├── README.md
│       ├── readiness-checklist-item.tsx
│       ├── readiness-checklist.tsx
│       ├── readiness-data.ts
│       ├── readiness-summary.tsx
│       ├── readiness-tracker.tsx
│       ├── readiness-utils.ts
│       └── types.ts
└── tests/
    └── int/
        └── readiness-utils.int.spec.ts
```

The obsolete tracker previously located at:

```text
miv/components/readiness-tracker.tsx
```

was removed to prevent duplicate implementations and reduce maintenance risk.

---

## Current State

The Diagnostics Readiness Tracker currently exists as a functional frontend feature.

It displays a predefined set of readiness requirements and allows users to mark each requirement as complete or incomplete. The interface immediately recalculates the completed-item count, readiness percentage, progress bar and overall readiness status.

The tracker currently uses local frontend data. It is not connected to a backend API or database, and checklist changes are not permanently saved.

Refreshing or leaving the page resets the tracker to its original state.

---

## Implemented Functionality

The following functionality has been implemented:

- Five predefined readiness checklist items
- Interactive checkboxes
- Completed-item count
- Total-item count
- Calculated readiness percentage
- Visual progress bar
- “Done” status for completed requirements
- “To do” status for incomplete requirements
- “In progress” overall status while requirements remain incomplete
- “Ready for review” status when every requirement is complete
- Immediate UI updates after checkbox changes
- Responsive desktop and mobile presentation
- Accessible checkbox labels
- Reusable TypeScript data structures
- Reusable progress-calculation logic
- Automated tests for readiness calculations

---

## Core Components

### 1. Diagnostics Page (`page.tsx`)

The Diagnostics page provides the route-level entry point for the feature.

Its responsibilities include:

- Displaying the Diagnostics page heading
- Displaying supporting information about the readiness assessment
- Rendering the modular `ReadinessTracker`
- Keeping page-level code small and focused

The page does not directly manage checklist data or progress calculations.

---

### 2. Readiness Tracker (`readiness-tracker.tsx`)

The `ReadinessTracker` is the main feature container.

Its responsibilities include:

- Holding the current readiness items in React state
- Handling checkbox changes
- Updating the selected readiness item
- Calling the readiness calculation utility
- Passing calculated results to the summary
- Passing readiness items and event handlers to the checklist

The tracker accepts an optional `initialItems` property. If no external items are provided, the tracker uses the predefined items from `readiness-data.ts`.

This property provides a starting point for future API integration because external readiness information can be supplied without replacing the presentation components.

---

### 3. Readiness Summary (`readiness-summary.tsx`)

The `ReadinessSummary` component displays the overall readiness result.

It displays:

- The Readiness Tracker heading
- The number of completed items
- The total number of items
- The completion percentage
- A visual progress bar
- The current overall status

The overall status displays:

```text
In progress
```

while requirements remain incomplete.

When every requirement is complete, it displays:

```text
Ready for review
```

The summary automatically updates whenever the tracker state changes.

---

### 4. Readiness Checklist (`readiness-checklist.tsx`)

The `ReadinessChecklist` component renders the complete list of readiness requirements.

Its responsibilities include:

- Receiving the current list of readiness items
- Rendering one `ReadinessChecklistItem` for each item
- Providing stable item keys
- Passing checkbox changes to the parent tracker

This separation prevents the main tracker component from containing all checklist presentation logic.

---

### 5. Readiness Checklist Item (`readiness-checklist-item.tsx`)

The `ReadinessChecklistItem` component displays one readiness requirement.

Each item includes:

- A consistent checklist icon
- The requirement label
- A supporting description
- An interactive checkbox
- A “Done” or “To do” badge
- Visual styling for completed items
- An accessible checkbox label

The same component is used for every readiness requirement, reducing duplicated markup and styling.

---

### 6. Readiness Data (`readiness-data.ts`)

The `readiness-data.ts` file stores the initial predefined readiness requirements.

Keeping the data separate from the presentation components makes the feature easier to maintain and prepares it for future replacement with API data.

The current data is local and does not represent information retrieved for a selected venture.

---

### 7. Readiness Utility (`readiness-utils.ts`)

The `readiness-utils.ts` file contains the reusable `calculateReadinessProgress` function.

The function calculates:

- The number of completed items
- The total number of items
- The readiness percentage
- Whether every readiness item is complete
- Whether the venture is ready for review

Separating these calculations from the React components makes the logic easier to understand, reuse and test.

The function also safely handles an empty readiness list by returning zero progress rather than dividing by zero.

---

### 8. Shared Types (`types.ts`)

The `types.ts` file defines the TypeScript structure used by the feature.

The readiness item type contains:

- A unique item identifier
- A label
- A description
- A completion value

Using a shared type helps keep the data consistent across the tracker, checklist, individual checklist items, local data and calculation utility.

---

## State Management and Data Flow

The Readiness Tracker currently uses React’s `useState` hook to manage readiness information on the client.

The current data flow is:

```text
Initial readiness data
        ↓
ReadinessTracker state
        ↓
ReadinessChecklist
        ↓
ReadinessChecklistItem
        ↓
Checkbox interaction
        ↓
Tracker event handler
        ↓
Updated readiness state
        ↓
Recalculated summary and progress
```

When a user changes a checkbox:

1. The checklist item sends the item identifier and new checked value to the tracker.
2. The tracker updates the matching readiness item.
3. The `calculateReadinessProgress` utility recalculates the result.
4. The summary receives the updated completed count, total count and percentage.
5. The UI displays the new progress and readiness status.

This state currently exists only in the browser. It is not sent to the backend or saved in the database.

---

## User Interface

The Readiness Tracker UI was updated using the provided design reference while preserving the original feature text and behaviour.

The visual implementation includes:

- Teal accent colours
- White checklist rows
- Light-grey supporting surfaces
- Clear progress information
- Consistent icons
- Visible status badges
- A contained card layout
- Clear separation between checklist items
- Responsive spacing and typography

The redesign focused mainly on colours and layout without unnecessarily changing the feature’s content or expected outputs.

---

## Responsive Design

The Readiness Tracker was designed to work across desktop and mobile screen sizes.

### Desktop Presentation

The desktop presentation includes:

- A contained card layout
- Clearly aligned checklist rows
- Readable supporting descriptions
- Visible status badges and checkboxes
- A summary section containing the overall progress
- Appropriate spacing for wider displays

### Mobile Presentation

The mobile presentation includes:

- Responsive spacing
- Readable text on narrow screens
- Touch-friendly checkbox interactions
- Visible “Done” and “To do” statuses
- A layout that does not depend on desktop width
- Content that remains usable without horizontal scrolling

Separate desktop and mobile component folders were not required because the same modular components adapt using responsive styling.

---

## Accessibility

The current implementation includes several accessibility considerations:

- Checkboxes are connected to their readiness labels.
- Each checkbox has an accessible description of the action it performs.
- Decorative icons are hidden from assistive technologies.
- Checklist items use semantic list markup.
- Progress information is presented using a progress component.
- Colour is supported by text labels such as “Done” and “To do” rather than being the only status indicator.

Further accessibility testing could still be performed in a future development stage.

---

## Testing

Automated readiness-calculation tests are located at:

```text
miv/tests/int/readiness-utils.int.spec.ts
```

The tests currently verify:

- Partial completion is calculated correctly.
- The completed-item count is correct.
- The total-item count is correct.
- Percentage progress is correct.
- Completing every item produces the ready-for-review state.

The automated tests can be run with:

```bash
npx vitest run --config ./vitest.config.mts tests/int/readiness-utils.int.spec.ts
```

During development, both tests passed successfully.

The feature was also manually tested for:

- Selecting checklist items
- Clearing checklist items
- Updating the completed-item count
- Updating percentage progress
- Updating the progress bar
- Displaying completed-item styling
- Displaying “Done” and “To do” statuses
- Displaying “In progress” when items remain incomplete
- Displaying “Ready for review” when all items are complete
- Desktop presentation
- Mobile responsive presentation

A targeted TypeScript check was performed for the Diagnostics components and returned no Diagnostics-related TypeScript errors.

The complete project TypeScript check still reports errors in other parts of the repository. Those errors were outside the scope of the Diagnostics feature.

---

## Current Limitations

The following limitations remain in the current implementation:

- Readiness requirements use predefined local frontend data.
- The tracker is not connected to a backend API.
- The tracker is not connected to the database.
- Checklist changes are not saved permanently.
- Progress resets when the page is refreshed.
- Readiness information is not associated with a selected venture.
- Users cannot create readiness requirements.
- Users cannot edit readiness requirements.
- Users cannot remove readiness requirements.
- The feature does not record who completed an item.
- Completion timestamps are not recorded.
- There is no readiness audit history.
- There are no API loading states.
- There are no saving, success or API-error states.
- Automated tests currently cover calculation logic but not complete component interaction.
- End-to-end tests have not been added.
- Authentication is managed by the wider application and is outside the Diagnostics module.

---

## Future Implementation Ideas

The following improvements could be considered during the next trimester:

- Connect the tracker to a backend readiness API.
- Load readiness requirements for a selected venture.
- Save checklist changes to the database.
- Add loading, saving, success and error feedback.
- Record which user completed each readiness requirement.
- Record completion dates and times.
- Store readiness history and audit information.
- Allow administrators to configure readiness requirements.
- Allow authorised users to add, edit or remove requirements.
- Add reviewer comments to checklist items.
- Attach evidence or supporting documents to requirements.
- Add role-based controls for completion and approval.
- Connect readiness completion to the wider venture-review workflow.
- Add component-level interaction tests.
- Add end-to-end tests for login and readiness updates.
- Add persistence tests for backend integration.
- Consider optimistic updates with rollback when an API request fails.
- Review the feature against additional accessibility testing tools.

---

## Outstanding Integration Work

The frontend feature implementation has been completed, but repository integration work remains pending.

Feedback received during review requested that the feature branch be synchronised with the latest:

```text
integration/frontend
```

The current pull request contains merge conflicts because the Diagnostics feature was developed against an earlier repository state.

The remaining repository work includes:

1. Pulling the latest `integration/frontend` branch.
2. Updating the Diagnostics feature branch with the latest integration changes.
3. Resolving the resulting merge conflicts.
4. Ensuring the modular Diagnostics page remains in place.
5. Ensuring the deleted legacy tracker is not restored accidentally.
6. Verifying compatibility with the updated authentication implementation.
7. Rerunning the readiness utility tests.
8. Rechecking desktop and mobile presentation.
9. Updating the pull request after the conflicts are resolved.

This is a repository integration issue rather than a limitation of the Readiness Tracker’s frontend behaviour.

---

## Handover Notes

The current implementation should be treated as a functional and responsive frontend feature with tested readiness-calculation logic.

The implementation separates:

- Route-level presentation
- Feature state
- Summary presentation
- Checklist presentation
- Individual checklist-item presentation
- Local data
- Shared types
- Progress calculations
- Automated tests

The optional `initialItems` property provides a starting point for future API integration. A future developer should be able to provide venture-specific readiness data without replacing the current UI components.

Before the feature can be merged, the feature branch must be synchronised with the latest `integration/frontend` branch and all merge conflicts must be resolved.

After resolving the conflicts, the next developer should verify:

- The Diagnostics page imports the modular tracker correctly.
- The obsolete tracker is not restored.
- Authentication and protected-route behaviour work with the integration branch.
- The readiness utility tests still pass.
- Checkbox interactions still update progress correctly.
- The “Ready for review” state still appears when all items are complete.
- Desktop and mobile layouts remain responsive.

---

## Deployment and Review Status

- **Feature:** Diagnostics Readiness Tracker
- **Implementation status:** Frontend implementation completed
- **Integration status:** Pending
- **Pull request status:** Requires synchronisation with `integration/frontend` and merge-conflict resolution
- **Scope:** Diagnostics page refactoring, responsive readiness UI, reusable component structure, removal of obsolete code, TypeScript data modelling, documentation and readiness calculation tests
- **Backend integration:** Not implemented
- **Database persistence:** Not implemented
- **Automated testing:** Readiness calculation tests implemented and passing
- **Responsive testing:** Manually tested on desktop and mobile
- **Required next action:** Synchronise with `integration/frontend`, resolve conflicts, rerun tests and update the pull request