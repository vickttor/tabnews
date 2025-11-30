# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TabNews is a clone of tabnews.com.br, built as part of the curso.dev course by Filipe Deschamps. This is a Next.js application with PostgreSQL database, focusing on learning modern web development practices.

**Stack**: Next.js 14, React 18, PostgreSQL 16, Docker, node-pg-migrate

## Development Commands

### Setup and Running
```bash
npm run dev                  # Start dev server (automatically starts services, waits for DB, runs migrations)
npm run services:up          # Start Docker containers (PostgreSQL)
npm run services:stop        # Stop Docker containers
npm run services:down        # Stop and remove Docker containers
npm run services:wait:database  # Wait for PostgreSQL to be ready
```

### Testing
```bash
npm test                     # Run all tests (starts services, runs Jest with Next.js server)
npm run test:watch          # Run tests in watch mode (requires services to be running)
```

**Important**: Tests run with `--runInBand` (serially) to avoid database conflicts. Each test suite uses the orchestrator to wait for services and can clear the database between tests.

### Database Migrations
```bash
npm run migrations:create   # Create a new migration file in infra/migrations/
npm run migrations:up       # Run pending migrations using .env.development
```

Migrations use `node-pg-migrate` and are stored in `infra/migrations/`. The API endpoint `/api/v1/migrations` allows checking (GET) and running (POST) migrations programmatically.

### Code Quality
```bash
npm run lint:prettier:check # Check code formatting
npm run lint:prettier:fix   # Auto-fix formatting issues
npm run lint:eslint:check   # Run ESLint on all files
```

### Git Workflow
```bash
npm run commit              # Use Commitizen for conventional commits
```

This project uses Husky for git hooks and follows conventional commit standards via commitlint.

## Architecture

### Directory Structure

**`pages/`**: Next.js pages and API routes
- `pages/index.js`: Homepage with simple UI
- `pages/api/v1/status/`: Health check endpoint with database connection metrics
- `pages/api/v1/migrations/`: Migration management endpoint (GET for pending, POST to apply)

**`infra/`**: Infrastructure and database code
- `infra/database.js`: PostgreSQL client wrapper with connection pooling and SSL configuration
- `infra/compose.yaml`: Docker Compose configuration for local PostgreSQL
- `infra/migrations/`: Database migration files (node-pg-migrate format)
- `infra/scripts/wait-for-postgres.js`: Script to poll Docker container until PostgreSQL is ready

**`tests/`**: Test suites
- `tests/orchestrator.js`: Test utilities for waiting on services and clearing database
- `tests/integration/api/v1/`: Integration tests mirroring API structure

### Database Architecture

The application uses a single `infra/database.js` module that:
- Creates new PostgreSQL clients per query (no persistent connection)
- Automatically closes connections in finally blocks
- Configures SSL based on environment (production vs development)
- Uses environment variables from `.env.development` for local development

**Connection Pattern**: Each API request gets a fresh database client, queries, and closes the connection. This avoids connection pooling complexity but may need optimization for high traffic.

### API Route Pattern

API routes follow a consistent pattern:
1. Import `database` from `infra/database.js`
2. Execute queries using `database.query()` or manage transactions with `database.getNewClient()`
3. Return JSON responses with appropriate status codes
4. Handle errors with 500 status and log to console

### Testing Strategy

Integration tests:
- Start the Next.js dev server and PostgreSQL via Docker
- Use `orchestrator.waitForAllServices()` to retry until services are ready
- Make HTTP requests to `http://localhost:3000/api/v1/*`
- Can use `orchestrator.clearDatabase()` to reset state between tests
- Tests run serially (`--runInBand`) to prevent race conditions

Test timeout is set to 60 seconds in `jest.config.js` to accommodate service startup time.

### Environment Configuration

**Development**: Uses `.env.development` with local PostgreSQL credentials
- Database runs in Docker container named `postgres-dev` on port 5432
- Default credentials: local_user/local_password/local_db

**Production**: Environment variables should include `NODE_ENV=production` and optionally `CA` for SSL certificate

### Migration System

Migrations use `node-pg-migrate`:
- Files in `infra/migrations/` follow naming: `{timestamp}_{description}.js`
- Each migration exports `up` and `down` functions
- Migrations are tracked in `pgmigrations` table
- Can be run via CLI (`npm run migrations:up`) or API endpoint (`POST /api/v1/migrations`)

### Key Patterns to Follow

**Import paths**: Use absolute imports from root (e.g., `import database from "infra/database.js"`)

**Database queries**: Always use the `database.query()` helper or manage client lifecycle manually with try/finally to ensure connections close

**API responses**: Use consistent JSON structure and HTTP status codes (200/201 for success, 405 for method not allowed, 500 for server errors)

**Test structure**: Organize tests to mirror API structure in `tests/integration/api/v1/`
