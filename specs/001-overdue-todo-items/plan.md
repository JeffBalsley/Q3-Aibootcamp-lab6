# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add a client-side derived "Overdue" indicator to the existing `TodoCard` component: a 👻 + "Overdue"
pill badge shown next to the due date whenever an incomplete todo's due date is strictly before the
current local date. No backend or schema changes are required; overdue status is computed in the
frontend from the existing `dueDate` and `completed` fields on every render, so it reflects toggles,
edits, and day rollovers immediately.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2

**Primary Dependencies**: React 18.2, react-scripts 5.0.1, @testing-library/react 14 (tests only); no new runtime dependencies

**Storage**: N/A — overdue status is a derived, non-persisted value; no schema change to the existing Express/SQLite-backed `todoService`

**Testing**: Jest + React Testing Library (`react-scripts test`), colocated in `src/**/__tests__/`

**Target Platform**: Modern evergreen browsers (existing web app), light/dark theme support via `data-theme`

**Project Type**: Web application (existing `packages/frontend` + `packages/backend` npm workspaces monorepo) — this feature only touches `packages/frontend`

**Performance Goals**: Negligible overhead; overdue check is an O(1) date comparison per todo, computed during existing render cycle

**Constraints**: Must use local device date (no timezone/server-date handling); must meet WCAG AA contrast; must not change existing due-date text styling; no page reload required for updates

**Scale/Scope**: Single component change (`TodoCard.js`) plus a small pure helper function and associated CSS/theme tokens and tests; scope limited to the 3 user stories in the spec

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Defined Product Scope**: PASS. Feature adds only a visual/derived indicator to the existing todo workflow; no new entities, persistence, sorting/filtering/notifications are introduced (per spec Assumptions).
- **II. Clear, Modular Implementation**: PASS. Overdue determination will be extracted into a single small, named helper (e.g., `isOverdue(todo)`) rather than inlined logic duplicated across components, keeping `TodoCard` focused on rendering.
- **III. Behavior-Proven Changes**: PASS (planned). New/updated Jest tests will cover the helper's edge cases (no due date, today, past, future, completed) and the badge's presence/absence and accessibility markup in `TodoCard`.
- **IV. Accessible, Consistent Interface**: PASS (planned). Badge reuses existing `--danger-color` design tokens for both themes, meets WCAG AA per spec FR-008, and uses `aria-live="polite"` with `aria-hidden` on the decorative emoji per FR-006.
- **V. Reliable Boundaries and Feedback**: PASS. No new frontend-backend boundary is introduced; existing REST calls for toggle/edit are unchanged and already handle errors.

No violations identified; Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js               # add Overdue badge rendering
│   │   └── __tests__/
│   │       └── TodoCard.test.js      # add overdue rendering/a11y tests
│   ├── utils/                        # NEW: shared date/status helpers
│   │   ├── overdue.js                # NEW: isOverdue(todo) pure helper
│   │   └── __tests__/
│   │       └── overdue.test.js       # NEW: edge-case unit tests
│   └── styles/
│       └── theme.css                 # reuse existing --danger-color tokens
└── package.json                      # unchanged (no new dependencies)

packages/backend/                     # untouched by this feature
```

**Structure Decision**: Existing npm-workspaces monorepo (`packages/frontend` +
`packages/backend`) is retained as-is. This feature is frontend-only: a new
`src/utils/overdue.js` pure helper (with its own unit tests) is added and
consumed by the existing `src/components/TodoCard.js`, keeping the derived
overdue logic out of the component per the "Clear, Modular Implementation"
principle. No backend changes, no new API contracts.

## Complexity Tracking

*No violations — section not applicable.*
