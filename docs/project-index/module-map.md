# Module Map

## App And Routing

- `src/app/App.tsx` is the route switch.
- `src/app/routes.ts` is the single route contract for hash URLs.
- `src/app/useHashRoute.ts` observes hash changes.
- `src/app/theme.tsx` owns theme preference, persistence, and document dataset
  attributes.

## Layout

- `src/components/layout/AppShell.tsx` owns sidebar navigation, utility actions,
  settings modal, command menu, and the main content slot.
- `src/components/layout/PageToolbar.tsx` owns pinned page headers.
- `src/components/layout/page.tsx` owns `Page`, `PageBody`, `Surface`, and
  surface sections only.

## UI Primitives

Use `src/components/ui/` before adding page-specific chrome. Important surfaces:

- `button.tsx` and `action-icon.tsx` for clickable actions.
- `modal.tsx` for dialogs.
- `input.tsx`, `textarea.tsx`, `native-select.tsx`, and
  `segmented-control.tsx` for forms.
- `content-state.tsx` for loading state only.
- `tooltip.tsx`, `label.tsx`, `toaster.tsx`, and `typography.tsx` for shared
  third-party adapters and design-system defaults.

## Composition Patterns

Use `src/components/patterns/` for reusable app/page arrangements that are more
opinionated than primitives:

- `confirm-dialog.tsx` for confirmation flows built on `Modal`.
- `content-state.tsx` for empty and error/retry compositions.
- `source-list.tsx`, `grouped-list.tsx`, and `record-list.tsx` for desktop
  list compositions.
- `form-list.tsx`, `inspector-panel.tsx`, and `property-grid.tsx` for form,
  side-panel, and property-display patterns.

See `docs/tech/ui-components.md` before adding new wrappers.

## Data Layer

- `src/data/migrations.ts` mirrors migration descriptors used by the frontend.
- `src-tauri/src/lib.rs` contains the real SQLite migration SQL registered with
  Tauri.
- `src/data/connection.ts` selects and caches the native or browser connection.
- `src/data/sqlDatabase.ts` defines the narrow database contract.
- `src/data/browserMockDatabase.ts` implements the example-only browser database.
- `src/data/repositories/` is the only page-facing data access layer.
- `src/data/mappers/` converts database rows into app types.
- `src/types/app.ts` defines shared app data types.

## Tests

- `src/tests/unit/` covers app, shell, routes, data, and window layout behavior.
- `src/tests/e2e/app.spec.ts` covers browser-visible app flows.
- `src/tests/render.tsx` provides the shared Testing Library wrapper.
- `src/tests/setup.ts` installs test environment setup.
