# Repository Guidelines

## Scope And Working Agreements

This source repository is a reusable Tauri 2 + React + TypeScript + SQLite desktop starter. Keep this template free of real business domains. Derived repositories replace the business positioning and product documents while retaining the engineering boundaries.

Make surgical changes, preserve concurrent work, and match the touched module. Do not inspect or edit `.omx/`, or include it in reviews. Never commit credentials or generated user data.

## Authoritative References

- Read `DESIGN.md` before frontend or visual work.
- Read [UI component rules](docs/tech/ui-components.md) before changing primitives or compositions.
- [Engineering contract](docs/tech/engineering.md) owns dependencies, data boundaries, tooling and verification methods.
- [Developer start](docs/tech/developer-start.md) owns copying and adapting this starter.
- [Product scope](docs/product/02-prd.md) and [acceptance criteria](docs/product/07-acceptance-criteria.md) define scope and passing conditions.
- [Project index](docs/project-index/README.md) locates source files and flows.
- [Acceptance record](docs/tech/starter-validation.md) contains historical evidence, not automatic approval for later changes.

Update the authoritative document when its contract changes; other documents should link to it rather than duplicate its rules.

## Development Access

Run commands from the repository root. `pnpm dev` serves `http://localhost:1420`; `pnpm tauri dev` starts the native app. No login is required. Critical smoke paths are dashboard, record list/detail/edit/delete, component showcase, command menu and theme settings.

## Change And Delivery Rules

Use the smallest relevant verification first and reuse passing evidence only when its inputs have not changed. Follow the engineering verification matrix; report actual results and unverified scope. Native persistence and supported window sizes need runtime evidence.

Keep TypeScript and Markdown aligned with ESLint/Prettier. Use descriptive kebab-case names for documents. Format modified Rust files with Cargo. Preserve the existing lockfiles unless the requested change requires updating them.

When commits or PRs are requested, keep them focused and descriptive. Include affected scope, relevant verification and UI evidence; do not publish or deploy implicitly.
