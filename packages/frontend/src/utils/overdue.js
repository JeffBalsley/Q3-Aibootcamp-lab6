/**
 * Determines whether a todo is overdue.
 *
 * A todo is overdue when its `dueDate` (a local calendar date, e.g. "YYYY-MM-DD")
 * is strictly before the local calendar date of `referenceDate`, and the todo is
 * not completed. Time-of-day is ignored on both sides of the comparison, so a
 * todo due "today" is never overdue.
 *
 * @param {{ dueDate?: string|null, completed?: number }} todo - Todo with optional dueDate and completed flag.
 * @param {Date} [referenceDate] - The date to compare against; defaults to now.
 * @returns {boolean} true only if dueDate is set, strictly before today's local date, and completed !== 1.
 */
export function isOverdue(todo, referenceDate = new Date()) {
  if (!todo || !todo.dueDate) {
    return false;
  }

  if (todo.completed === 1) {
    return false;
  }

  const [year, month, day] = todo.dueDate.split('-').map(Number);
  const dueDateLocal = new Date(year, month - 1, day);

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  return dueDateLocal.getTime() < today.getTime();
}
