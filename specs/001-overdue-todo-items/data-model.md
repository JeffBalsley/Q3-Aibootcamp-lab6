# Phase 1 Data Model: Support for Overdue Todo Items

## Entities

### Todo (existing entity — unchanged fields)

| Field | Type | Notes |
|-------|------|-------|
| `id` | number/string | Existing identifier, unchanged |
| `title` | string | Existing, unchanged |
| `dueDate` | string (`YYYY-MM-DD`) \| null | Existing, unchanged; optional |
| `completed` | number (`0`/`1`) | Existing, unchanged (see `TodoCard.js` usage: `todo.completed === 1`) |

No fields are added, removed, or renamed on the `Todo` entity. No backend model, migration, or API
contract changes are required.

### Overdue (new — derived, non-persisted view state)

Not a stored entity. It is a boolean computed at render time from the existing `Todo` fields:

| Derived Value | Type | Computed From | Rule |
|----------------|------|----------------|------|
| `overdue` | boolean | `dueDate`, `completed` | `true` iff `dueDate` is set AND `dueDate` (local calendar date) is strictly before today's local calendar date AND `completed` is falsy (`0`) |

**Validation / edge-case rules** (from spec Edge Cases and FR-002–FR-004):

1. `dueDate` is `null`/`undefined`/empty string → `overdue = false`.
2. `dueDate` equals today's local date → `overdue = false` (not yet overdue).
3. `dueDate` is in the future → `overdue = false`.
4. `dueDate` is in the past AND `completed` is `1` → `overdue = false`.
5. `dueDate` is in the past AND `completed` is `0` → `overdue = true`.

**State transitions**: `overdue` is not stored, so there is no persisted state machine. Its value
is recomputed on every render from current `dueDate`/`completed`, meaning it "transitions"
immediately and implicitly whenever:
- `completed` flips from `0` → `1` (overdue → not overdue), or
- `dueDate` is edited to a future/today date (overdue → not overdue), or
- the ambient current date advances past `dueDate` on next render (not overdue → overdue).

## Contracts

No new or changed API contracts. This feature does not modify request/response shapes exposed by
`packages/backend`; `packages/frontend/src/services/todoService.js` calls are unchanged. See
[plan.md](./plan.md) Constitution Check — Principle V (Reliable Boundaries) is unaffected.
