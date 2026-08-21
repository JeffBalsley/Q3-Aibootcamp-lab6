<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0
Modified principles: none; initial adoption
Added sections: Core Principles, Product and Technical Constraints, Development Workflow
Removed sections: none
Follow-up TODOs: none
-->
# Todo App Constitution

## Core Principles

### I. Defined Product Scope
The application MUST deliver the documented single-user todo workflow: create, view, edit,
complete, and permanently delete todos, with immediate backend persistence. Work outside the
approved feature scope MUST not be added without an explicit requirements update. This preserves
the app's intentionally focused experience and prevents unsupported complexity.

### II. Clear, Modular Implementation
Production code MUST use 2-space indentation, descriptive names, ordered imports, LF line
endings, and no trailing whitespace. Each module, component, and function MUST have one
well-defined responsibility; duplicated behavior MUST be extracted when reuse is justified.
Public or critical JavaScript interfaces MUST document non-obvious contracts with JSDoc or clear
validation. These rules keep the React and Express codebases readable and maintainable.

### III. Behavior-Proven Changes
Every behavior change MUST include or update independent Jest tests that assert observable
outcomes rather than implementation details. Tests MUST use clear Arrange-Act-Assert structure,
mock external dependencies, and clean up their own state. New or changed critical user workflows
MUST be covered; the repository MUST maintain at least 80% coverage across packages when
coverage is measured. Tests are the executable record of required behavior.

### IV. Accessible, Consistent Interface
User-facing changes MUST preserve the documented Material-inspired Halloween design system,
including the 8px spacing grid, color roles, typography hierarchy, and responsive single-column
layout. Interactive controls MUST be keyboard accessible, expose associated labels or accessible
names, retain visible focus indicators, and meet WCAG AA color contrast. Theme selection MUST
persist and default to the system preference on first visit. Consistency and accessibility are
required for an interface users can operate reliably.

### V. Reliable Boundaries and Feedback
Frontend-backend interactions MUST honor the established React-to-Express REST boundary, validate
input at API boundaries, and persist successful mutations immediately. Operations that can fail
MUST handle errors gracefully and present clear, actionable feedback without leaving the UI in an
ambiguous state. Destructive deletion MUST require confirmation. These guarantees protect data and
make failures understandable to the user.

## Product and Technical Constraints

The project MUST remain an npm-workspaces monorepo with a React frontend and Node.js/Express
backend. Todos are global single-user records; authentication, authorization, multi-user
collaboration, priority, categories, recurring tasks, reminders, undo/redo, bulk actions, search,
and advanced filtering are out of scope unless the functional requirements are amended. The
frontend MUST communicate with the backend persistence mechanism; browser-only persistence cannot
replace it.

## Development Workflow

Changes MUST use focused feature branches, atomic commits with descriptive messages, and pull
request review before merge. Before requesting review, contributors MUST run the applicable
frontend and/or backend tests and resolve lint errors and warnings. Reviewers MUST verify the
change against this constitution, functional requirements, coding guidelines, testing guidelines,
and UI guidelines. Complexity, deviations, and requirement changes MUST be recorded in the
relevant specification or pull request.

## Governance

This constitution supersedes conflicting project practices. Amendments MUST be proposed in a
documented change, reviewed with the affected implementation or planning work, and include any
needed migration or compliance plan. Versioning follows semantic rules: MAJOR for incompatible
principle removals or redefinitions, MINOR for added or materially expanded governance, and PATCH
for clarifications that do not change obligations. Every pull request and periodic project review
MUST check compliance; unresolved exceptions require explicit approval and a recorded rationale.

**Version**: 1.0.0 | **Ratified**: 2026-08-21 | **Last Amended**: 2026-08-21
