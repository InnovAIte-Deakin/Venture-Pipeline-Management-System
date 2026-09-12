# Workflows

Current status for the Workflows route after the route-local refactor and follow-up cleanup.

## Route

- URL: `/dashboard/workflows`
- Route file: `miv/app/dashboard/(operations)/workflows/page.tsx`
- Next.js route group: `(operations)` is not part of the URL.
- Parent layout: `miv/app/dashboard/layout.tsx`

This feature is a client-side operations console for creating, editing, running, and monitoring automation workflows. The dashboard pages call the workflow API routes under `/api/workflows` and keep workflow-specific constants, helper logic, and types inside this route folder.

## Current Status

The T27 refactor is functionally wired for the dashboard workflow screens.

Resolved:

- Shared workflow config, types, and utility logic were moved out of page files.
- Shared workflow files now live in route-local `constants/`, `lib/`, and `types/` folders to match nearby dashboard feature structure.
- Workflow list, wizard, builder, and monitor imports were updated to the new local paths.
- The PR-added `miv/.env.test.example` was removed from this cleanup because it was outside the stated workflow feature scope.
- The workflow notification API no longer uses invalid notification type `"WORKFLOW"`; it now uses the existing Prisma enum value `"SYSTEM_UPDATE"` and stores workflow details in metadata.
- Basic mobile responsiveness was improved for headers, action rows, wizard progress, action cards, monitor run rows, and the builder canvas/sidebar layout.

## Folder Structure

```text
workflows/
  page.tsx
  README.md
  constants/
    workflow.constants.ts
  lib/
    workflow-utils.ts
  types/
    workflow.ts
  wizard/
    page.tsx
  [id]/
    builder/
      page.tsx
    monitor/
      page.tsx
```

## Behavior

- Workflow list loads up to 50 workflows from `/api/workflows?limit=50`.
- Workflow list can run active workflows with `POST /api/workflows/run`.
- Wizard can create workflows from scratch or from predefined templates.
- Wizard reads the optional `template` search parameter and preselects a matching template.
- Builder loads a workflow and recent runs, converts the stored definition into editable nodes, and saves changes back to `/api/workflows/:id`.
- Builder supports adding, selecting, dragging, duplicating, deleting, and editing basic node properties.
- Monitor loads workflow details and recent runs, shows execution stats, and displays run input/output JSON for the selected run.

## API Contract

| Endpoint | Current use | Response shape |
| --- | --- | --- |
| `/api/workflows?limit=50` | List workflows | expected to return `{ results }` |
| `/api/workflows` | Create workflow | expected to return the created workflow |
| `/api/workflows/:id` | Read/update workflow | expected to return one workflow |
| `/api/workflows/:id/runs?limit=...` | List workflow runs | expected to return `{ results }` |
| `/api/workflows/run` | Start a workflow run | expected to return the created run |
| `/api/users?limit=1` | Wizard dev-mode creator lookup | expected to return `{ users }` |

When changing API response shape, update `types/workflow.ts`, `lib/workflow-utils.ts`, and the affected page together.

## Shared Logic

- `constants/workflow.constants.ts` owns workflow templates, trigger options, action options, condition options, and builder node palettes.
- `types/workflow.ts` owns route-local UI/API types for workflows, workflow definitions, nodes, runs, templates, options, and run stats.
- `lib/workflow-utils.ts` owns definition-to-node conversion, node-to-definition conversion, run stat calculation, and duration formatting.

Keep React components out of `lib/`. Keep display options and template definitions in `constants/`.

## Mobile Notes

The current pages now avoid the most obvious narrow-screen layout breaks:

- List page header and workflow card actions stack on mobile.
- Wizard content has horizontal protection for the progress indicator and full-width controls where needed.
- Builder switches from desktop side-by-side layout to stacked sidebar and scrollable canvas on smaller screens.
- Monitor header, stats grid, and run rows stack cleanly on smaller screens.

The builder is still not a fully mobile-native workflow editor. The canvas remains a large draggable workspace and mouse dragging is the primary interaction model.

## Known Remaining Issues

1. Several predefined templates contain step types that are not implemented by `/api/workflows/run`, such as `send_welcome_email`, `create_tasks`, `notify_team`, `create_checklist`, `assign_reviewers`, `set_deadline`, `schedule_reminders`, `check_gedsi_metrics`, and reporting/risk-analysis actions. Running those templates can fail with `Unknown step type`.
2. Builder drag-and-drop is mouse-based. Touch dragging and keyboard node movement are not implemented.
3. Builder node ordering is derived from node ids like `step-0`. Duplicated or newly added action ids based on timestamps may not preserve visual ordering exactly when saved.
4. The wizard uses `alert()` for error/success feedback and selects the first user from `/api/users?limit=1` as creator in dev mode.
5. Workflow types still use `Record<string, any>` for configs because each action/trigger type does not yet have a strict config schema.
6. The workflow list run button does not inspect the run response or show a durable toast/error state.
7. The monitor run detail JSON panels are readable but still dense on mobile.
8. Full browser-level visual verification on mobile and desktop has not been completed.

## Validation

Latest checks run from `miv/`:

- `npm.cmd exec eslint -- "app/dashboard/(operations)/workflows/**/*.tsx" "app/dashboard/(operations)/workflows/**/*.ts" "app/api/(operations)/workflows/**/*.ts"`: passed.
- `npm.cmd run typecheck 2>&1 | Select-String -Pattern "workflows"`: no workflow-path errors after the notification enum fix.
- `git diff --check`: passed.
- Full `npm.cmd run typecheck`: still fails because of unrelated existing TypeScript errors elsewhere in the repo, including impact analytics, documents/email routes, dashboard pages, Prisma seed scripts, and other non-workflow areas.

## Development Notes

- Keep `page.tsx`, `wizard/page.tsx`, `[id]/builder/page.tsx`, and `[id]/monitor/page.tsx` focused on route composition and UI state.
- Add new trigger/action/condition options in `constants/workflow.constants.ts`.
- Add shared workflow helpers in `lib/workflow-utils.ts` only when they are not React-specific.
- Add stricter config types in `types/workflow.ts` when backend action contracts are defined.
- If a template adds a new action type, update the workflow runner before exposing it as runnable.
- If a remaining issue is fixed, update this README in the same change.
