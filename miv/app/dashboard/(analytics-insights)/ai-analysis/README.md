# AI Analysis

## Scope

This folder contains the complete frontend implementation for the AI Analysis
page. The refactor is intentionally feature-local: no files outside this folder
are required or modified.

## Structure

```text
ai-analysis/
├── components/
│   ├── desktop/       # Desktop-only presentation (>= 1024px)
│   ├── mobile/        # Mobile/tablet presentation (< 1024px)
│   └── shared/        # Feedback and status components used by both views
├── constants/         # Analysis type configuration
├── hooks/             # Data/state controller and viewport selection
├── mock-data/         # Existing Quick Analysis venture choices
├── types/             # Feature-specific TypeScript types
├── utils/             # Score, insight and formatting logic
└── page.tsx           # Small page-level composition only
```

## Desktop and mobile views

`page.tsx` uses the feature-local `useViewport` hook to select a presentation at
Tailwind's `lg` breakpoint:

- Desktop (`>= 1024px`) preserves the existing wide layout and four-column tabs.
- Mobile/tablet (`< 1024px`) uses dedicated mobile components, vertical form
  steps, compact cards, touch-friendly controls and a two-by-two tab layout.

The mobile presentation follows the approved VPMS visual reference supplied by
the frontend stream: primary teal `#138075`, secondary orange `#F4A261`,
tertiary teal `#2A9D8F`, neutral `#F8F9FA`, and a Hanken Grotesk-compatible
font stack. Desktop presentation remains unchanged.

The two presentations share the same `useAIAnalysis` controller, types and
calculation utilities, so the feature behaviour remains consistent without
mixing desktop and mobile markup.

## Behaviour preserved

- Venture data is loaded from `/api/ventures?limit=50`.
- Existing score, recommendation and insight generation is preserved.
- Quick Analysis continues to use the existing local venture choices and
  simulated two-second processing flow.
- The current backend/API contract is unchanged.

## UI states

Both presentations support:

- loading;
- API error with retry;
- empty result lists;
- pending, processing, completed and failed status badges;
- completed analysis details and key insights.

## Verification

Run the feature lint check from the `miv` directory:

```bash
./node_modules/.bin/eslint 'app/dashboard/(analytics-insights)/ai-analysis/**/*.{ts,tsx}'
```

Run the project TypeScript check:

```bash
npm run typecheck
```

Manual verification should cover:

1. Desktop at 1024px or wider.
2. Mobile at 320px and 390px.
3. Venture and analysis type selection.
4. Disabled and analyzing button states.
5. Processing result display.
6. All Analyses, Completed, Processing and Key Insights tabs.
7. No horizontal page overflow on mobile.
