# Impact Reports

## Feature Overview

The Impact Reports feature gives users a clear overview of venture impact data. It presents key performance indicators, sector comparisons, detailed metrics, and changes over time. My assigned feature was G4-02 Impact Reports in the Frontend stream.

## Work Completed

I refactored the original Impact Reports page into smaller reusable components and improved its responsive layout. The completed work includes:

- KPI summary cards for the main impact values.
- An Impact by Sector chart for comparing sector performance.
- A Detailed Impact Metrics table.
- An Impact Over Time chart.
- Responsive layouts for desktop and mobile screens.
- Loading and error states to give users clear feedback.
- Use of real venture dates instead of generated dates.
- General cleanup of the main page to reduce the amount of logic in one file.

## Component Structure

The feature was divided into the following components:

| Component | Purpose |
| --- | --- |
| `impact-kpi-cards.tsx` | Displays the main impact KPI values in summary cards. |
| `impact-by-sector-chart.tsx` | Groups and displays impact information by sector. |
| `detailed-impact-metrics-table.tsx` | Displays detailed metrics in a structured table. |
| `impact-over-time-chart.tsx` | Displays changes in impact data over time. |
| `impact-reports-status.tsx` | Displays loading and error feedback. |
| `page.tsx` | Loads the data and combines the Impact Reports components. |

## Responsive Design

The page was updated to work on both desktop and mobile screen sizes. Cards, charts, and table content were arranged so that the information remains readable on smaller screens. This work also helped align the feature with the updated dashboard design used by the Frontend stream.

## Data Handling and User Feedback

The page uses venture data to prepare the values shown in the cards, charts, and table. Real venture dates are used for the time-based chart. Loading and error states were added so that the page does not appear blank while information is being retrieved or when a request fails.

## Testing and Verification

The feature was checked through the local development environment and TypeScript checking. The individual Impact Reports components were also reviewed through Git commits and pull request evidence.

Known project-level issues encountered during testing included unavailable Backend services and an unrelated TypeScript error in the GEDSI API route. These issues affected full-project testing but were outside the Impact Reports component work.

## Pull Request and Commit Evidence

- Pull Request: PR #118 - G4-02 Impact Reports.
- `ef4fcb0` - Extract KPI cards component.
- `4aa568e` - Colocate KPI cards with the feature.
- `573128f` - Extract sector chart component.
- `2cfeb59` - Add metrics table and responsive UI.
- `8a37a96` - Add Impact Over Time chart.
- `4daf162` - Add loading and error states.
- `db9e789` - Use real venture dates.

## Known Limitations

- Full live-data testing requires the Backend service and database to be running.
- Some project-wide route and authentication issues may prevent direct access in certain branches.
- Further integration testing should be completed after all Frontend and Backend changes are merged.

## Recommendations for the Next Trimester

- Confirm the final API response structure with the Backend team.
- Add automated component and integration tests.
- Improve empty-data messages for charts and tables.
- Add export support if it is required by the Product Owner.
- Check accessibility, keyboard navigation, and chart labels.

## Handover Summary

The Impact Reports feature has been refactored into reusable components and updated for responsive use. The next team should focus mainly on live Backend integration, automated testing, and final accessibility checks rather than rebuilding the page structure.
