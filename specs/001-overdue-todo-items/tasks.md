---

description: "Task list template for feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included — spec FR-009 explicitly requires automated tests covering the overdue
determination logic and indicator rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is the existing `packages/frontend` + `packages/backend` npm-workspaces monorepo. This
feature is frontend-only; all paths are under `packages/frontend/src/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new utils module location; no dependency or tooling changes needed.

- [X] T001 Create `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` directories (no new dependencies required per plan.md)

**Checkpoint**: Directory structure ready for the `isOverdue` helper and its tests.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the core, reusable `isOverdue(todo, referenceDate)` helper that all user
stories depend on for computing overdue status.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Implement `isOverdue(todo, referenceDate = new Date())` pure helper in `packages/frontend/src/utils/overdue.js`, documented with a JSDoc block describing parameters, return type, and the local-calendar-date comparison contract (per Constitution Principle II), comparing local calendar dates (ignoring time-of-day) per research.md §2: returns `false` when `dueDate` is null/undefined/empty, `false` when `dueDate` equals or is after today's local date, `false` when `todo.completed` is truthy (`=== 1`), and `true` only when `dueDate` is strictly before today's local date AND `completed !== 1`
- [X] T003 [P] Unit tests for `isOverdue()` in `packages/frontend/src/utils/__tests__/overdue.test.js` covering all data-model.md edge cases: no due date, due date today, due date in future, due date in past + completed, due date in past + incomplete

**Checkpoint**: `isOverdue()` helper is implemented and fully unit-tested — user story
implementation can now begin.

---

## Phase 3: User Story 1 - See Overdue Todos at a Glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date show a clear visual "Overdue" badge in the todo
list; all other todos do not.

**Independent Test**: Create todos with due dates in the past, today, and the future (mix of
complete and incomplete). Load the todo list and verify only incomplete todos with a past due
date show the overdue indicator, while all others do not.

### Implementation for User Story 1

- [X] T004 [US1] Import `isOverdue` from `../utils/overdue` and compute an `overdue` boolean per render in `packages/frontend/src/components/TodoCard.js`
- [X] T005 [US1] Render the 👻 + "Overdue" pill badge as a `<span role="status" aria-live="polite">` (containing an `aria-hidden="true"` `<span>👻</span>` glyph followed by the visible text "Overdue") immediately after the existing `.todo-due-date` element in `packages/frontend/src/components/TodoCard.js`, shown only when `overdue` is `true`, without altering `.todo-due-date`'s existing markup/styling
- [X] T006 [US1] Add `.overdue-badge` CSS rule in `packages/frontend/src/styles/theme.css` using existing `--danger-color`, `--radius-sm`/`--radius-md`, and `--space-xs` tokens for a small pill (background/contrasting text), applied consistently in both light and dark theme blocks
- [X] T007 [US1] Add/extend tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` verifying: badge renders for an incomplete todo with a past `dueDate`; badge is absent for incomplete todos due today/future; badge is absent for completed todos regardless of `dueDate`; badge is absent when `dueDate` is not set

**Checkpoint**: User Story 1 is independently functional and testable — overdue todos are
visually distinguished in the list. This is the MVP.

---

## Phase 4: User Story 2 - Overdue Status Stays Accurate Without Manual Refreshing (Priority: P2)

**Goal**: The overdue indicator always reflects the current `completed`/`dueDate` state on every
render, with no stale badges after toggling completion or editing the due date.

**Independent Test**: Mark an overdue todo complete and verify the indicator disappears
immediately; edit a todo's due date to a future date and verify the indicator is removed
immediately; reload the page after time has passed a due date and verify the indicator appears
without any other user action.

### Implementation for User Story 2

- [X] T008 [US2] Verify (and adjust if needed) that `overdue` in `packages/frontend/src/components/TodoCard.js` is recomputed from props on every render (no memoization/stale state) so it updates immediately when `todo.completed` or `todo.dueDate` change via existing `onToggle`/`onEdit` re-renders
- [X] T009 [P] [US2] Add tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` verifying the badge disappears on re-render after `todo.completed` changes from `0` to `1`, and disappears after `todo.dueDate` changes from a past date to a future date (re-render with updated props, no unmount)
- [X] T010 [P] [US2] Add a unit test in `packages/frontend/src/utils/__tests__/overdue.test.js` asserting `isOverdue()` returns `true` for a fixed past `dueDate` when the injected `referenceDate` advances past it (simulating a day rollover) without any change to the todo itself

**Checkpoint**: Overdue status is verified accurate immediately after completion/edit and after
simulated date advancement — User Stories 1 and 2 are both independently functional.

---

## Phase 5: User Story 3 - Overdue Status Is Perceivable by All Users (Priority: P3)

**Goal**: The overdue indicator is conveyed via accessible text (not color alone) and meets WCAG
AA contrast in both themes.

**Independent Test**: Inspect the overdue indicator with a screen reader and in a grayscale
rendering of the UI; verify overdue status is announced/readable as text and is distinguishable
without color.

### Implementation for User Story 3

- [X] T011 [US3] Confirm/adjust the badge markup in `packages/frontend/src/components/TodoCard.js` so the accessible name is exactly "Overdue" (emoji wrapped in `aria-hidden="true"`, container has `role="status"` and `aria-live="polite"`) per FR-006
- [X] T012 [P] [US3] Add accessibility tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting the badge's accessible text content is "Overdue" (via testing-library queries such as `getByRole('status')`/`getByText`), and that the 👻 glyph element has `aria-hidden="true"`
- [X] T013 [P] [US3] Verify `--danger-color` badge contrast (background vs. text) meets WCAG AA in both the `:root` (light) and `[data-theme="dark"]` blocks of `packages/frontend/src/styles/theme.css`, adjusting the badge text color token if a checked ratio falls short

**Checkpoint**: All three user stories are independently functional, tested, and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across the whole feature.

- [X] T014 Run `npm run test:frontend` from repo root and confirm all existing and new tests pass (per quickstart.md §1)
- [ ] T015 Manually walk through quickstart.md §2–4 (add todos with past/today/future/no due dates; toggle complete; edit due date; screen reader + grayscale checks in both themes) and confirm all steps behave as documented; while walking through §2, time-box the scan of the rendered todo list to confirm overdue todos are identifiable within ~2 seconds (SC-001) and record the observation in the PR description

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion (needs `isOverdue()`). No dependency on other stories.
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion; builds on the badge rendering added in US1 (T004/T005) but does not require US1's tests to be finished.
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion; builds on the badge markup added in US1 (T005) but is independently testable/verifiable.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Foundational only — no dependency on US2/US3. Fully independent MVP.
- **User Story 2 (P2)**: Foundational + reuses the badge element from US1's implementation tasks (T004/T005) for its re-render assertions.
- **User Story 3 (P3)**: Foundational + reuses the badge element from US1's implementation task (T005) for its accessibility assertions.

### Within Each User Story

- Implementation tasks generally precede their corresponding test tasks only where tests need the markup to assert against (tests-after here since FR-009 doesn't mandate TDD ordering); T003 in Foundational is written test-first for the pure helper.
- Tasks touching different files are marked `[P]` and can run in parallel; tasks touching the same file (`TodoCard.js`) within a phase run sequentially.

---

## Parallel Execution Examples

### Foundational phase

```
T002 (implement isOverdue in overdue.js) → then T003 [P] (unit tests in overdue.test.js) can run alongside subsequent story work once T002 lands.
```

### User Story 2

```
T009 [P] and T010 [P] touch different test files (TodoCard.test.js vs. overdue.test.js) and can run in parallel after T008.
```

### User Story 3

```
T012 [P] and T013 [P] touch different files (TodoCard.test.js vs. theme.css) and can run in parallel after T011.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue()` helper + its unit tests) — CRITICAL, blocks everything else
3. Complete Phase 3: User Story 1 (badge rendering, styling, and tests)
4. **STOP and VALIDATE**: Run `npm run test:frontend` and manually verify quickstart.md §2 — this alone delivers the requested overdue-visibility value
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Add User Story 2 → Test independently (toggle/edit/re-render behavior) → Deploy/Demo
3. Add User Story 3 → Test independently (accessibility/contrast) → Deploy/Demo
4. Run Polish phase (full test suite + manual quickstart walkthrough) → Final release
