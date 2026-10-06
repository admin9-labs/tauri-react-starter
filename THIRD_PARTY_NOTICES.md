# Third-party notices

The project source is licensed under [MIT](LICENSE). Bundled third-party assets
retain their own licenses.

## Geist Mono

- Files: `public/fonts/GeistMono-Regular.woff2` and `GeistMono-Medium.woff2`.
- Source: [vercel/geist-font](https://github.com/vercel/geist-font).
- Copyright 2024 The Geist Project Authors.
- License: [SIL Open Font License 1.1](public/fonts/OFL.txt).
- Both bundled files identify themselves as version 1.700 and include the above
  copyright and license information in their font metadata.

The font license is also copied into the frontend build with the other public
assets. It is independent of the project's MIT license.

## Tauri template icons

- Files: `src-tauri/icons/`, excluding the license text.
- Source: [create-tauri-app template](https://github.com/tauri-apps/create-tauri-app/tree/5813af8d642c061fc049742895b21b44c24654e6/templates/_base_/src-tauri/icons).
- Copyright (c) 2019–2022 Tauri Programme within The Commons Conservancy.
- License: [MIT](src-tauri/icons/LICENSE_MIT.txt), selected from the upstream
  MIT/Apache-2.0 dual license.

These are unchanged template icons, not an ADMIN9 product logo. Replace them
when adapting the starter to your own application.

## Dependencies

JavaScript and Rust dependencies are installed from the versions recorded in
`pnpm-lock.yaml` and `src-tauri/Cargo.lock`. Each dependency retains its own
license; this notice does not relicense those packages. When distributing a
derived application's binary, include the notices required by the dependencies
and assets you actually bundle.
