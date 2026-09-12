# T22 Sustainability Refactor

This feature is colocated under `app/dashboard/sustainability`.

## Structure

- `page.tsx`: data fetching, state and unchanged sustainability calculations.
- `hooks/use-viewport.ts`: SSR-safe 1024px desktop/mobile selector.
- `components/desktop`: existing desktop presentation and desktop metrics.
- `components/mobile`: independently editable mobile presentation and mobile metrics.
- `components/charts`: shared extracted chart components.
- `lib`: existing nature-project calculation helper.
- `types`: feature-local TypeScript contracts.

The desktop and mobile entry components are independent so future mobile redesign work does not require editing the desktop presentation.
