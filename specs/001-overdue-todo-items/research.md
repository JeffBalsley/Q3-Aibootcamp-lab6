# Phase 0 Research: Support for Overdue Todo Items

All items from the feature spec's Clarifications session were already resolved before planning;
no `NEEDS CLARIFICATION` markers remain in the Technical Context. The research below confirms the
technical approach for the remaining open questions (how, not what).

## 1. Where to compute "overdue" status

- **Decision**: Add a small pure function `isOverdue(todo, referenceDate = new Date())` in a new
  `packages/frontend/src/utils/overdue.js` module, imported by `TodoCard.js`.
- **Rationale**: Keeps `TodoCard` focused on rendering (Single Responsibility / Constitution
  Principle II), makes the date-comparison logic independently unit-testable without mounting a
  component, and allows reuse if another view needs overdue status later.
- **Alternatives considered**:
  - Inline comparison directly inside `TodoCard.js` — rejected because it mixes date-math with
    JSX/rendering and is harder to unit test in isolation for edge cases (today/past/future/no
    date/completed).
  - Compute overdue status in `todoService.js` and store it on the todo object — rejected because
    the spec explicitly states this is a derived, non-persisted value computed at render time
    (FR-001), and doing it in the service would risk staleness if the list isn't re-fetched.

## 2. Date comparison semantics (local date, "today" not overdue)

- **Decision**: Compare using date-only (year/month/day) equality/ordering derived from the
  browser's local timezone, not full timestamp comparison, so a due date of "today" is never
  overdue regardless of time-of-day.
- **Rationale**: Spec Edge Cases state a todo due exactly "today" is not overdue and the
  determination must use the user's local date. `dueDate` is stored/edited as a date input
  (`type="date"`), so normalizing both sides to local calendar dates (ignoring time) avoids
  off-by-one errors from timezone offsets when constructing `Date` objects from `YYYY-MM-DD`
  strings.
- **Alternatives considered**: Raw `new Date(dueDate) < new Date()` timestamp comparison —
  rejected because it would mark a todo due "today" as overdue as soon as any time has passed
  today, contradicting the spec.

## 3. Live update on toggle/edit without reload

- **Decision**: No new state or subscription mechanism needed. Since `isOverdue()` is computed
  during `TodoCard`'s render using the todo's current `completed`/`dueDate` props, any state
  update from `onToggle`/`onEdit` (already implemented, causing a re-render with fresh todo props)
  automatically recomputes overdue status.
- **Rationale**: Satisfies FR-007 with no additional complexity; consistent with existing
  unidirectional data flow (parent owns todo list state, re-renders children on change).
- **Alternatives considered**: `useEffect` + local component state to "watch" for date changes —
  rejected as unnecessary; there is no requirement to update the badge while the tab sits open
  and unattended across a midnight rollover (User Story 2's test is "reload after time has
  passed", not "live while idle"), so a render-time computation is sufficient per KISS.

## 4. Accessibility pattern for the badge

- **Decision**: Render the badge as `<span role="status" aria-live="polite">` containing an
  `aria-hidden="true"` `<span>👻</span>` decorative glyph followed by the visible text "Overdue".
- **Rationale**: Matches clarified FR-006 exactly — screen readers announce only "Overdue"
  automatically without requiring focus; the emoji is decorative and excluded from the accessible
  name.
- **Alternatives considered**: `title`/tooltip-only text — rejected, not announced automatically
  and fails the spec's live-region requirement; using an `<img>`/CSS `content` for the ghost —
  rejected as unnecessary complexity versus an inline `aria-hidden` span.

## 5. Styling approach (badge visuals, contrast, theming)

- **Decision**: New CSS rules in `theme.css` (or a colocated stylesheet) using the existing
  `--danger-color` custom property for background and a white/contrasting text color, sized as a
  small pill (rounded, `--radius-sm`/`--radius-md`, small padding using `--space-xs`), placed
  adjacent to `.todo-due-date` without altering that element's existing styles.
- **Rationale**: Reuses existing design tokens already verified for both themes (Constitution
  Principle IV — consistent design system); satisfies FR-005/FR-008 without introducing new
  colors.
- **Alternatives considered**: New dedicated "overdue" color token — rejected per spec Assumptions
  ("reuses the existing... danger color... rather than introducing a new color").

**Output**: All unknowns resolved; no outstanding `NEEDS CLARIFICATION` items remain.
