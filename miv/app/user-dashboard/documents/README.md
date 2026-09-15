# User Documents

## Scope

This feature lets a signed-in venture user upload, view, download and delete their own documents. It also shows the review status returned by the Payload backend.

The Documents implementation is kept inside `app/user-dashboard/documents`. The only changes outside that folder are the shared User Dashboard sidebar and layout updates required to make mobile navigation open, close and dismiss correctly; the desktop shell remains unchanged.

## Structure

- `page.tsx` is the route entry point.
- `components/desktop` contains the desktop presentation.
- `components/mobile` contains the mobile presentation.
- `components/shared` contains notices, status badges and list states used by both views.
- `hooks/use-user-documents.ts` owns feature state and user actions.
- `lib/documents-api.ts` contains the backend requests and response checks.
- `lib/documents-validation.ts` contains client-side upload rules.
- `lib/document-formatters.ts` contains display formatting and summary calculations.
- `constants` and `types` keep the feature configuration and TypeScript contracts local.

## Upload validation

The client checks that:

1. a document type has been selected;
2. exactly one file was chosen;
3. the file is not empty;
4. the file is no larger than 10 MB;
5. the extension is PDF, Word, Excel or PowerPoint; and
6. the browser MIME type matches the extension.

The backend repeats the security-sensitive size and MIME checks. Client validation is used to give the user quicker, clearer feedback.

## Responsive behaviour

Desktop and mobile use dedicated components at the shared `lg` breakpoint, so changes to one layout do not unexpectedly alter the other. The desktop presentation preserves the existing upload-and-list layout. The mobile presentation uses a guided two-step upload panel, compact summary cards and touch-friendly document actions.

The feature uses the VPMS palette, including primary teal `#138075`, tertiary teal `#2A9D8F` and secondary orange `#F4A261`.

## UI states

- Initial loading and manual refresh
- Empty document list
- Upload in progress
- Download and delete in progress
- Success and error feedback with dismiss controls
- Review states: pending, approved, rejected and needs revision

## API routes

- `GET /backend/api/documents`
- `POST /backend/api/documents`
- `DELETE /backend/api/documents?id={id}`
- `GET /backend/api/documents/{id}?download=true`

All requests include credentials because document actions require an authenticated session.

## Verification

Run these commands from the `miv` folder:

```bash
npx eslint app/user-dashboard/documents
npx tsc --noEmit
npx tsx --test app/user-dashboard/documents/lib/*.test.ts
```

For manual testing, verify the page at desktop width and at 375 px and 320 px mobile widths. Test a valid upload as well as missing type, empty file, unsupported type, oversized file, download, delete cancellation and backend error states. Confirm there is no horizontal overflow.
