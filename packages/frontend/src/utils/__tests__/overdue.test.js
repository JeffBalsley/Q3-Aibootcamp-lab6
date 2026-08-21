import { isOverdue } from '../overdue';

describe('isOverdue', () => {
  const reference = new Date(2026, 7, 21); // 2026-08-21 local

  it('returns false when dueDate is null', () => {
    expect(isOverdue({ dueDate: null, completed: 0 }, reference)).toBe(false);
  });

  it('returns false when dueDate is undefined', () => {
    expect(isOverdue({ completed: 0 }, reference)).toBe(false);
  });

  it('returns false when dueDate is an empty string', () => {
    expect(isOverdue({ dueDate: '', completed: 0 }, reference)).toBe(false);
  });

  it('returns false when dueDate is today', () => {
    expect(isOverdue({ dueDate: '2026-08-21', completed: 0 }, reference)).toBe(false);
  });

  it('returns false when dueDate is in the future', () => {
    expect(isOverdue({ dueDate: '2026-08-22', completed: 0 }, reference)).toBe(false);
  });

  it('returns false when dueDate is in the past but todo is completed', () => {
    expect(isOverdue({ dueDate: '2026-08-20', completed: 1 }, reference)).toBe(false);
  });

  it('returns true when dueDate is in the past and todo is incomplete', () => {
    expect(isOverdue({ dueDate: '2026-08-20', completed: 0 }, reference)).toBe(true);
  });

  it('returns true when a fixed past dueDate is checked against a later referenceDate (day rollover)', () => {
    const todo = { dueDate: '2026-08-20', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 20))).toBe(false);
    expect(isOverdue(todo, new Date(2026, 7, 21))).toBe(true);
  });
});
