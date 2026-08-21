# Quickstart: Validate Overdue Todo Items

Prerequisites: Node.js and npm installed; repository dependencies installed (`npm run install:all`
from repo root, once, if not already done).

## 1. Run automated tests

```bash
npm run test:frontend
```

Expected: all existing frontend tests pass, plus new tests for:
- `src/utils/__tests__/overdue.test.js` — covers `isOverdue()` edge cases (no due date, today,
  past + incomplete, past + completed, future).
- `src/components/__tests__/TodoCard.test.js` — covers badge presence/absence and accessible
  markup (`aria-live="polite"`, hidden emoji, visible "Overdue" text).

## 2. Manual end-to-end check (User Story 1 — see overdue at a glance)

```bash
npm start
```

1. Open the app in a browser.
2. Add a todo with a due date set to yesterday (leave incomplete) → verify the card shows the
   👻 "Overdue" badge next to the due date, and the due date text itself is unstyled/unchanged.
3. Add a todo due today, and one due tomorrow → verify neither shows the badge.
4. Add a todo with no due date → verify no badge.

## 3. Manual check — status stays accurate (User Story 2)

1. Mark the overdue todo from step 2 above as complete → badge disappears immediately, no reload.
2. Edit that same todo's due date to a future date → badge stays absent (todo remains incomplete
   but no longer overdue).
3. Edit a future-dated todo's due date to yesterday → badge appears immediately.

## 4. Manual accessibility check (User Story 3)

1. Using a screen reader (e.g., VoiceOver, NVDA), navigate to an overdue todo card → verify
   "Overdue" is announced without needing to focus the badge (live region), and the 👻 emoji is
   not read aloud.
2. Toggle the OS/browser to a grayscale rendering (or use browser dev tools' color-blindness
   emulation) → verify the overdue todo is still distinguishable via the "Overdue" text label.
3. Verify contrast of the badge text/background meets WCAG AA in both light and dark theme (use
   the existing theme toggle) — reuses `--danger-color` tokens already verified elsewhere in the
   design system.

## Success criteria mapping

| Quickstart step | Spec success criterion |
|---|---|
| Step 2 | SC-001, SC-002 |
| Step 3 | SC-003 |
| Step 4 | SC-004 |
