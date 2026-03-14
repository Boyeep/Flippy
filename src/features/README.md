# Features

This folder is now organized by domain instead of by technical layer.

- `courses/`: course queries, services, and future course-specific state
- `auth/`: auth APIs, hooks, forms, and session logic
- `flashcards/`: flashcard APIs, hooks, and local workflows
- `shared/`: cross-feature infrastructure such as query client and shared UI state

Recommended pattern inside each feature:

- `api/`
- `hooks/`
- `services/`
- `store/`
- `types/`
