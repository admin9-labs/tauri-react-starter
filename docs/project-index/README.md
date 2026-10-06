# Project Index

This index maps the reusable Tauri React SQLite starter. Use it before changing
navigation, UI primitives, routing, data access, or test setup.

## Confirmed Stack

- Desktop shell: Tauri 2 in `src-tauri/`
- Frontend: Vite, React 19, TypeScript, Tailwind CSS v4
- UI layer: project-owned primitives in `src/components/ui/`
- Composition patterns: reusable app/page patterns in `src/components/patterns/`
- Data layer: Tauri SQL plugin, SQLite migrations, repository wrappers
- Tests: Vitest, Testing Library, Playwright

## Reading Order

1. `entrypoints.md` for startup commands, routes, app shell, and service entrypoints.
2. `module-map.md` for source ownership boundaries.
3. `core-flows.md` for user-facing flows and data movement.
4. `infrastructure.md` for build, test, runtime, and config surfaces.
5. `../tech/ui-components.md` for UI primitive and composition-pattern boundaries.
6. `quick-index.md` for change-oriented lookup.

## Scope

The analyzed unit is the root desktop starter app. Imported or generated
artifacts are not part of this index. `node_modules/`, `dist/`, and
`src-tauri/target/` should be treated as generated or third-party output.
