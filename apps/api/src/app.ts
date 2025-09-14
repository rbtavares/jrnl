import { db, entriesTable } from '@repo/database';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { GenericEntrySchema } from './types.js';

// Create App
export const app = new Hono();

// @GET /health
app.get('/health', async (c) => {
  c.status(200);
  return c.json({ success: true, message: 'OK' });
});

// @GET /entries
app.get('/entries', async (c) => {
  const entries = await db.select().from(entriesTable);
  c.status(200);
  return c.json({ success: true, entries });
});

// @GET /entries/:id
app.get('/entries/:id', async (c) => {
  const { id } = c.req.param();
  const entry = await db
    .select()
    .from(entriesTable)
    .where(eq(entriesTable.id, Number(id)));
  c.status(entry ? 200 : 404);
  return c.json({ success: true, entry });
});

// @POST /entries
app.post('/entries', async (c) => {
  let requestData;
  try {
    requestData = await c.req.json();
  } catch (error) {
    c.status(400);
    return c.json({ success: false, error: 'Invalid JSON in request body' });
  }

  try {
    const validatedData = GenericEntrySchema.parse(requestData);

    const entryInsertReturn = await db.insert(entriesTable).values(validatedData).returning({ id: entriesTable.id });
    if (!entryInsertReturn[0]) {
      c.status(500);
      return c.json({ success: false, error: 'Failed to create entry' });
    } else {
      c.status(201);
      return c.json({ success: true, message: 'Entry created successfully', entryId: entryInsertReturn[0].id });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      c.status(400);
      return c.json({ success: false, error: 'Invalid request data' });
    }
    c.status(500);
    return c.json({ success: false, error: 'Internal server error' });
  }
});

// @PUT /entries/:id
app.put('/entries/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const requestData = await c.req.json();
    const validatedData = GenericEntrySchema.parse(requestData);

    const entry = await db
      .update(entriesTable)
      .set(validatedData)
      .where(eq(entriesTable.id, Number(id)));
    c.status(200);
    return c.json({ success: true, entry });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      c.status(400);
      return c.json({ success: false, error: 'Invalid request data', details: error.message });
    }
    c.status(500);
    return c.json({ success: false, error: 'Internal server error' });
  }
});

// @DELETE /entries/:id
app.delete('/entries/:id', async (c) => {
  const { id } = c.req.param();
  await db.delete(entriesTable).where(eq(entriesTable.id, Number(id)));
  c.status(204);
  return c.json({ success: true, message: 'Entry deleted successfully' });
});

// On App Error
app.onError((err, c) => {
  console.error(err);
  c.status(500);
  return c.json({ success: false, error: 'Internal server error' });
});
