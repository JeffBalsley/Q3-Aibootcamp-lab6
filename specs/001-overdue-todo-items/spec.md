# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date, so they can prioritize their work and quickly see which tasks are past their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Overdue Todos at a Glance (Priority: P1)

As a todo application user, I want incomplete todos whose due date has passed to be visually distinguished in my todo list, so that I can quickly spot which tasks need my attention without comparing every due date to today's date myself.

**Why this priority**: This is the core value of the feature. Without a clear visual signal, users must manually check each due date, which defeats the purpose of the request. This alone delivers the requested value and is independently shippable.

**Independent Test**: Create todos with due dates in the past, today, and the future (mix of complete and incomplete). Load the todo list and verify only incomplete todos with a past due date show the overdue indicator, while all others do not.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date earlier than today, **When** the todo list is displayed, **Then** the todo shows a clear overdue indicator.
2. **Given** an incomplete todo with a due date of today or in the future, **When** the todo list is displayed, **Then** the todo does not show an overdue indicator.
3. **Given** a completed todo with a due date earlier than today, **When** the todo list is displayed, **Then** the todo does not show an overdue indicator.
4. **Given** a todo with no due date set, **When** the todo list is displayed, **Then** the todo does not show an overdue indicator.

---

### User Story 2 - Overdue Status Stays Accurate Without Manual Refreshing (Priority: P2)

As a todo application user, I want a todo's overdue indicator to reflect the current date every time I view or update my list, so that the indicator is trustworthy and I never have to guess if it's stale.

**Why this priority**: Users rely on this signal to prioritize work; a stale or incorrect indicator would undermine trust in the feature. This builds on User Story 1 by ensuring correctness over time and after edits.

**Independent Test**: Mark an overdue todo complete and verify the indicator disappears immediately; edit a todo's due date to a future date and verify the indicator is removed; reload the page after time has passed a due date and verify the indicator appears without any other user action.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user marks it complete, **Then** the overdue indicator is removed immediately.
2. **Given** an overdue todo, **When** the user edits its due date to a future date, **Then** the overdue indicator is removed immediately.
3. **Given** a todo due today, **When** the current date advances past the due date and the list is next displayed, **Then** the todo shows the overdue indicator without requiring any edit to the todo itself.

---

### User Story 3 - Overdue Status Is Perceivable by All Users (Priority: P3)

As a todo application user who relies on assistive technology or has difficulty distinguishing colors, I want the overdue indicator to be conveyed through more than color alone, so that I can identify overdue todos regardless of how I perceive the interface.

**Why this priority**: This ensures the feature is usable by all users and complies with the project's accessibility principle. It is an enhancement to the core indicator delivered in User Story 1 rather than a separate capability.

**Independent Test**: Inspect the overdue indicator with a screen reader and in a grayscale rendering of the UI; verify overdue status is announced/readable as text and is distinguishable without color.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** a screen reader reads the todo item, **Then** the overdue status is announced as text (not conveyed by color alone).
2. **Given** an overdue todo rendered without color (e.g., grayscale), **When** a sighted user views the list, **Then** the todo is still distinguishable as overdue via a label or icon.

### Edge Cases

- A todo due exactly "today" is not overdue; it becomes overdue starting the day after its due date.
- A todo with no due date is never considered overdue.
- A completed todo is never considered overdue, even if its due date has passed.
- Marking an overdue todo complete or editing its due date to the future immediately clears the overdue indicator on next render.
- The overdue determination MUST use the user's local date so the indicator matches what the user perceives as "today".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine whether a todo is overdue by comparing its due date to the current date each time the todo list is rendered.
- **FR-002**: A todo MUST be considered overdue only when all of the following are true: it has a due date set, that due date is earlier than the current date, and the todo is not marked complete.
- **FR-003**: Completed todos MUST NOT be marked overdue, regardless of due date.
- **FR-004**: Todos without a due date MUST NOT be marked overdue.
- **FR-005**: System MUST visually distinguish overdue todos in the todo list using a distinct, accessible visual treatment (e.g., color and icon/label combination).
- **FR-006**: The overdue indicator MUST include a non-color-dependent cue (text label or icon with accessible name) so overdue status is perceivable without relying on color alone.
- **FR-007**: Overdue status MUST update immediately when a todo is marked complete or its due date is edited, without requiring a page reload.
- **FR-008**: The overdue visual treatment MUST meet WCAG AA color contrast requirements in both light and dark themes, consistent with existing design system colors.
- **FR-009**: The feature MUST include automated tests covering the overdue determination logic (including the edge cases above) and the rendering of the overdue indicator.

### Key Entities

- **Todo**: Existing entity representing a task with a title, optional due date, and completion status. This feature adds a derived, non-persisted "Overdue" state computed from the existing due date and completion status; no new stored field is introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list within 2 seconds of viewing it, without checking any date manually.
- **SC-002**: 100% of incomplete todos with a past due date display the overdue indicator; 0% of completed or non-due todos display it.
- **SC-003**: The overdue indicator remains accurate immediately after completing a todo or changing its due date, with no stale indicators observed.
- **SC-004**: The overdue indicator meets WCAG AA contrast standards and is identifiable without color in 100% of manual accessibility spot checks.

## Assumptions

- "Overdue" means the todo's due date is strictly before the current local date and the todo is not yet marked complete; a todo due "today" is not yet overdue.
- The current date is determined by the user's local device/browser clock; no server-side timezone handling is introduced.
- Overdue status is computed dynamically from the existing due date and completion fields; no new data is persisted and no backend schema change is required.
- This feature only adds a visual/textual indicator; it does not add sorting, filtering, grouping, or notifications related to overdue todos, per the project's defined scope.
- The overdue indicator reuses the existing Halloween-themed design system's color roles (e.g., the existing danger color) paired with a text/icon cue, rather than introducing a new color.
