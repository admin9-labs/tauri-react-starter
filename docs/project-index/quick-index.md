# Quick Index

## Change Routing

- Add or change a route: start with `src/app/routes.ts`, then `src/app/App.tsx`.
- Change sidebar navigation or utilities: start with
  `src/components/layout/AppShell.tsx` and
  `src/components/layout/sidebar-nav-item.tsx`.
- Change page toolbar behavior: start with `src/components/layout/PageToolbar.tsx`.
- Change page layout or surfaces: start with `src/components/layout/page.tsx`.

## Change UI Controls

- Buttons: `src/components/ui/button.tsx`; link-like actions use `Button asChild`.
- Icon-only actions: `src/components/ui/action-icon.tsx`.
- Sidebar/filter lists: `src/components/patterns/source-list.tsx`.
- Theme-style segmented choices: `src/components/ui/segmented-control.tsx`.
- Select inputs: `src/components/ui/native-select.tsx`.
- Dialogs and confirmations: `src/components/ui/modal.tsx` and
  `src/components/patterns/confirm-dialog.tsx`.
- Loading state: `src/components/ui/content-state.tsx`.
- Empty state and property display patterns:
  `src/components/patterns/content-state.tsx` and
  `src/components/patterns/property-grid.tsx`.
- App composition patterns: `src/components/patterns/`.
- UI wrapper boundaries: `docs/tech/ui-components.md`.
- Command palette entries: `src/components/layout/command-menu.tsx`.

## Change Records

- Record list, filters, seed button, and inspector preview:
  `src/pages/RecordsPage.tsx`.
- Record detail edit/save/delete: `src/pages/RecordDetailPage.tsx`.
- Repository behavior: `src/data/repositories/exampleRecordRepository.ts`.
- Row mapping: `src/data/mappers/exampleRecordMapper.ts`.
- Shared types: `src/types/app.ts`.

## Change SQLite

- Runtime migration SQL: `src-tauri/src/lib.rs`.
- Frontend migration descriptors: `src/data/migrations.ts`.
- Runtime connection: `src/data/connection.ts`.
- Database contract and mock: `src/data/sqlDatabase.ts`, `src/data/browserMockDatabase.ts`.

## Change Tests

- Unit app flows: `src/tests/unit/app.test.tsx`.
- Shell behavior: `src/tests/unit/app-shell.test.tsx`.
- Data behavior: `src/tests/unit/data.test.ts`.
- Browser app flows: `src/tests/e2e/app.spec.ts`.
