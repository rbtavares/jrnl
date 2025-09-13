import { z } from 'zod';

export interface GenericEntry {
  title: string;
  content: string;
}

export interface Entry extends GenericEntry {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export const GenericEntrySchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
});

export const EntrySchema = GenericEntrySchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EntryFromSchema = z.infer<typeof EntrySchema>;
export type GenericEntryFromSchema = z.infer<typeof GenericEntrySchema>;
