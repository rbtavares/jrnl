import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

if (!process.env.DATABASE_PATH) {
  throw new Error('DATABASE_PATH is not defined');
}

export const db = drizzle(new Database(process.env.DATABASE_PATH));