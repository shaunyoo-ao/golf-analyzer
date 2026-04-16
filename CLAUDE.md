# CLAUDE.md

This file provides guidance for AI assistants (like Claude) working in this repository.

## Project Overview

**golf-analyzer** is a golf play analyzer built using an AI workflow. The project is currently in its initial state — only a README exists. Development has not yet begun.

- **Repository:** shaunyoo-ao/golf-analyzer
- **Purpose:** Analyze golf play using AI-driven workflows

## Repository State

This is a greenfield project. There is currently:
- No source code
- No dependencies or package manager configuration
- No tests
- No CI/CD configuration
- No environment configuration

When development begins, update this file to reflect the actual structure, conventions, and workflows established.

## Development Branch

Active development should occur on feature branches. The main branch holds stable, reviewed code. The current documentation branch is `claude/add-claude-documentation-Fqbu3`.

## Guidelines for AI Assistants

### Before Making Changes

1. **Read before editing.** Always read a file before modifying it.
2. **Understand the scope.** Don't add features or refactor code beyond what is asked.
3. **Check for existing patterns.** Follow whatever conventions are already established in the codebase.

### Coding Conventions (to be established)

Since no code exists yet, conventions should be decided when the first implementation choices are made. Document them here as they are established. Suggested areas to define:

- Language and runtime (e.g., Python 3.11+, Node.js 20+)
- Package manager (e.g., pip/poetry, npm/pnpm/yarn)
- Code formatter and linter
- Test framework and coverage requirements
- Directory structure (e.g., `src/`, `tests/`, `docs/`)
- Naming conventions (snake_case vs camelCase, file naming)

### Commit Conventions

Use clear, descriptive commit messages. Prefix with a type where applicable:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `test:` — adding or updating tests
- `refactor:` — code restructuring without behavior change
- `chore:` — build process, dependency updates, tooling

### Security

- Never commit secrets, API keys, or credentials. Use environment variables.
- Add `.env` to `.gitignore` before any secrets are introduced.
- Validate all external input at system boundaries.

### AI Workflow Considerations

Given the project's focus on AI workflows:
- Document model choices and prompt structures clearly.
- Pin model versions to avoid unexpected behavior changes.
- Store prompt templates as versioned files, not hardcoded strings.
- Consider cost, latency, and rate limits when designing AI pipelines.

## Updating This File

Update this CLAUDE.md whenever:
- New dependencies or tools are added
- A directory structure is established
- Testing or linting workflows are configured
- CI/CD is set up
- Important architectural decisions are made
