# Infrastructure

## Build And Tooling

- `package.json` defines the root frontend and Tauri scripts.
- `vite.config.ts` configures React, Tailwind CSS v4, alias `@`, Vite dev port
  `1420`, and Vitest.
- `tsconfig.json`, `tsconfig.test.json` and `tsconfig.node.json` separate app,
  test and Node/tooling type checks.
- `eslint.config.js` checks lint and module import boundaries.
- `.node-version`, `package.json` and `rust-toolchain.toml` own tool versions.
- `scripts/check-toolchain.mjs` checks the selected binaries.
- `.github/workflows/check.yml` runs the shared checks and unsigned native build.
- `playwright.config.ts` drives browser E2E tests.

## Tauri Runtime

- `src-tauri/tauri.conf.json` defines the desktop product, build commands,
  window config, CSP, bundle icons, and SQL plugin preload.
- `src-tauri/src/lib.rs` registers `tauri_plugin_opener` and
  `tauri_plugin_sql`.
- `src-tauri/Cargo.toml` and `src-tauri/Cargo.lock` own Rust dependencies.

## SQLite

The database URL is `sqlite:desktop-starter.db`. The authoritative migration SQL
is in `src-tauri/src/lib.rs`; `src/data/migrations.ts` keeps matching frontend
metadata for code and docs.

Browser and test runs use the mock implementation in `src/data/browserMockDatabase.ts`,
so Web E2E can validate the app without a native desktop runtime. The mock
implements only example queries and does not prove SQLite migrations or
transactions; update its handlers when replacing an entity.

## Styling

`DESIGN.md` is the visual source of truth. Tokens and global app behavior live in
`src/index.css`; component files should consume those tokens rather than adding
new design systems.

## Verification

Commands, scope selection and native procedures are maintained in
[engineering](../tech/engineering.md#验证范围). Passing conditions are in
[acceptance criteria](../product/07-acceptance-criteria.md).
