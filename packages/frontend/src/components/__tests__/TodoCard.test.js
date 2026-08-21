import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

function pastDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function futureDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue badge', () => {
    it('renders the badge for an incomplete todo with a past due date', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate(), completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not render the badge for an incomplete todo due today', () => {
      const today = new Date().toISOString().slice(0, 10);
      const todo = { ...mockTodo, dueDate: today, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not render the badge for an incomplete todo due in the future', () => {
      const todo = { ...mockTodo, dueDate: futureDate(), completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not render the badge for a completed todo regardless of due date', () => {
      const todo = { ...mockTodo, dueDate: pastDate(), completed: 1 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not render the badge when dueDate is not set', () => {
      const todo = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('disappears on re-render after todo.completed changes from 0 to 1', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate(), completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('disappears on re-render after todo.dueDate changes from a past date to a future date', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate(), completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, dueDate: futureDate() }} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('exposes the visible text "Overdue" with the emoji hidden from assistive tech', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate(), completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-live', 'polite');
      expect(badge.textContent.trim()).toBe('👻 Overdue');

      const glyph = badge.querySelector('[aria-hidden="true"]');
      expect(glyph).toBeInTheDocument();
      expect(glyph).toHaveTextContent('👻');
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });
});
