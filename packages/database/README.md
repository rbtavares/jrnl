# Database Package

This package provides database configuration and schema for the journal application.

## Setup

### Environment Configuration

Create a `.env` file in the database package root with:

```bash
DATABASE_URL=./data/database.sqlite
```

Or set the environment variable in your shell:

```bash
export DATABASE_URL=./data/database.sqlite
```

### Development

```bash
# Build the package (includes database setup)
npm run build

# Development mode with watch
npm run dev

# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
```

## Build Process

The build process automatically:

1. Compiles TypeScript
2. Ensures database directory exists
3. Creates database file if needed
4. Generates pending migrations
5. Applies migrations to database

## Database Schema

The database uses SQLite with Drizzle ORM. Schema is defined in `src/schema/index.ts`.

## Usage

```typescript
import { db, usersTable } from '@repo/database';

// Query users
const users = await db.select().from(usersTable);
```