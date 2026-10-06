# UI Component Rules

These rules separate reusable design-system primitives from app-level
composition patterns. The goal is to keep useful wrappers, not to wrap every
third-party or native element by default.

## Decision Rules

- Keep a wrapper when it owns shared styling, interaction chrome,
  accessibility defaults, third-party primitive configuration, or a tested
  `data-slot` contract.
- Keep thin elements only when their name maps directly to the design language
  and their API stays small.
- Move components out of `src/components/ui/` when they arrange application
  surfaces, page sections, record-specific lists, or shell commands.
- Prefer direct imports for zero-style helpers such as Radix
  `VisuallyHidden`. Wrap them only if the project needs a replacement point or
  a shared naming contract.

## UI Primitive API Budget

`src/components/ui/` primitives should stay narrow. Default to native element
props plus only the project-wide API needed to preserve shared visual or
accessibility behavior.

- Allowed primitive API: `variant`, `size`, `asChild`, required accessibility
  props, tested `data-slot` attributes, and third-party primitive configuration.
- Avoid convenience layout props such as `leftSection`, `rightSection`,
  `header`, `footer`, or business-specific status variants on low-level
  primitives.
- For link-like buttons, use `Button asChild` with an inner `a` or reuse
  `buttonVariants(...)`; do not add cross-element props such as `component="a"`.
- Put repeated icon/text/metadata rows, empty panels, property displays, and
  shell-specific compositions in `src/components/patterns/` or
  `src/components/layout/`.
- Start new combinations in the page. Promote them to `patterns` after a second
  real use case appears. Promote them to `ui` only when they become
  project-wide primitives with shared behavior.

## Keep As UI Primitives

These components justify their wrappers because they encode project-wide UI
contracts:

- `button.tsx` and `action-icon.tsx` own action chrome, variants, size rules,
  `data-slot` attributes, and pointer/focus behavior covered by E2E tests.
  `Button` exports `buttonVariants(...)` for rare non-button reuse and uses
  `asChild` for link-like actions.
- `input.tsx`, `textarea.tsx`, `native-select.tsx`, and
  `segmented-control.tsx` own form-control styling, accessibility roles, and
  native desktop affordances. `SegmentedControl` is a lightweight mode switch,
  not a full tabs or complex radio-group replacement.
- `modal.tsx`, `tooltip.tsx`, and `label.tsx` adapt Radix primitives into this
  app's visual and accessibility defaults.
- `toaster.tsx` and `feedback-toast.tsx` centralize Sonner configuration and
  notification behavior. `FeedbackToast` accepts an optional `id` for independent
  notification instances; callers that omit it retain message-based deduplication.
  Page callers use instance IDs and stable matching close callbacks. Sonner owns
  the close lifecycle; pages must not add a second dismissal timer.
- `typography.tsx` maps semantic text usage to the project typography classes.
- `content-state.tsx` contains only `LoadingState`; richer empty-state layout
  and persistent error/retry layout belong in `patterns`.

## Keep But Avoid Expanding

These wrappers are intentionally thin. Keep them stable and avoid adding broad
variant systems unless multiple real call sites need them.

- `badge.tsx`
- `code-text.tsx`
- `content-state.tsx`
- `kbd.tsx`
- `table.tsx`

## Composition Patterns

The following files belong in `src/components/patterns/` because they
compose reusable layout patterns rather than low-level primitives:

- `confirm-dialog.tsx`
- `content-state.tsx` (`EmptyState` and `ErrorState`; error title, description,
  and optional recovery action use existing UI controls and alert semantics)
- `form-list.tsx`
- `grouped-list.tsx`
- `inspector-panel.tsx`
- `property-grid.tsx`
- `record-list.tsx`
- `source-list.tsx`

These components can still be reused across pages, but future changes should
treat them as app patterns with stronger layout opinions.

## Layout

The command palette is owned by the application shell rather than the general
UI primitive layer:

- `src/components/layout/command-menu.tsx`
- `src/components/layout/shell-command-button.tsx`

## Current Boundary

- `src/components/ui/`: design-system primitives and third-party primitive
  adapters.
- `src/components/patterns/`: reusable app/page composition patterns.
- `src/components/layout/`: shell, navigation, toolbar, page frame, and command
  surfaces.

New wrappers should preserve these boundaries even when the project is still in
starter shape. Prefer one clear primitive plus a pattern composition over one
large primitive with many convenience props.
