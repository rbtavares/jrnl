import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { db, usersTable } from '@repo/database';

const app = new Hono();

app.get('/', async c => {
  await db.insert(usersTable).values({
    email: Date.now().toString(),
    password: Date.now().toString(),
  });
  const users = await db.select().from(usersTable);

  return c.json({ users });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  info => {
    console.log(`API is listening on http://localhost:${info.port}`);
  }
);
