# IRIS Metrics

This feature provides the IRIS+ Metrics catalog used in the dashboard.

## Structure

- `page.tsx` - renders the IRIS Metrics interface, including search, filters, desktop table, and mobile cards.
- `hooks/use-iris-metrics.ts` - manages feature state, loading, search, retry behaviour, and data fetching.
- `lib/iris-metrics.api.ts` - handles requests to the IRIS Metrics API.
- `lib/iris-metrics.constants.ts` - stores reusable filter options, result-limit options, and debounce settings.
- `lib/iris-metrics.formatters.ts` - contains reusable display formatting helpers.
- `types/iris-metrics.types.ts` - defines shared TypeScript types for IRIS Metrics data.

## Responsive behaviour

Desktop users see the metrics in a table layout.

Mobile users see the same metric information in a card layout to improve readability on smaller screens.

## Notes

The existing IRIS Metrics API supports search and result limits. Unsupported page-based pagination was intentionally removed to avoid repeated or incorrect results.
