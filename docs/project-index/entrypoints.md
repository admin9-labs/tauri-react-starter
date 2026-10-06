# Entrypoints

## Startup

Commands and verification methods are maintained in [engineering](../tech/engineering.md).
`src-tauri/tauri.conf.json` owns desktop startup and build hooks.

## Frontend App

- `src/main.tsx` mounts the React app.
- `src/app/App.tsx` chooses the active page from the hash route.
- `src/app/routes.ts` defines hash URLs and route parsing.
- `src/components/layout/AppShell.tsx` owns the fixed sidebar, command palette,
  settings modal, and main content slot.

## Pages

- `src/pages/DashboardPage.tsx` is the starter overview and links into records.
- `src/pages/RecordsPage.tsx` owns record seeding, filters, list preview, and
  inspector navigation.
- `src/pages/RecordDetailPage.tsx` owns record read, edit, save, delete, and
  detail inspector behavior.
- `src/pages/ComponentsPage.tsx` owns the component showcase.
- `src/pages/SettingsPage.tsx` exports the theme panel used by the app-shell modal; there is no settings route.

## Desktop Shell

- `src-tauri/src/lib.rs` registers Tauri plugins and SQLite migrations.
- `src-tauri/src/main.rs` starts the Tauri runtime.
- `src-tauri/capabilities/default.json` controls allowed plugin capabilities.
