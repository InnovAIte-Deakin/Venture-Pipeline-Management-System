# Venture Intake

This directory owns the `/dashboard/venture-intake` feature.

## Structure

- `page.tsx` is the minimal Next.js route entry.
- `desktop/desktop-view.tsx` preserves the current desktop page composition.
- `components/venture-intake-form.tsx` owns the six-step form, its state, and submission flow.
- `components/venture-guidelines.tsx` contains the feature-specific guidance content.
- `schemas/venture-intake-schema.ts` contains the form validation schema and inferred data type.

General UI primitives, including cards, buttons, inputs, selects, alerts, and file upload, remain in the global `components/ui` directory.

The future approved mobile view belongs in `mobile/mobile-view.tsx`. It should reuse the same form logic rather than duplicate validation, state, or submission behaviour. A feature hook should be added under `hooks/` only when there is genuine reusable Venture Intake behaviour to extract.

The form submits venture data to `/api/ventures` and requests analysis from `/api/ai/analyze-venture` after a successful submission.
