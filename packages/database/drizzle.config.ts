import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_PATH) {
  throw new Error('DATABASE_PATH is not defined');
}

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH,
  },
  verbose: true,
  strict: true,
});
