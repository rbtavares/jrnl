import { z } from 'zod';

export interface Note {
  id: number;
  title: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}

export const NoteSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export type NoteSchemaType = z.infer<typeof NoteSchema>;

