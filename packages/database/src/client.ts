import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve database path relative to the database package directory
const databasePath = join(__dirname, '..', 'data', 'database.sqlite');

export const db = drizzle(new Database(databasePath));
