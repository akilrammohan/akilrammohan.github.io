import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { goodreadsLoader, BookSchema } from 'astro-loader-goodreads';

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const favoriteBooks = defineCollection({
  loader: goodreadsLoader({
    url: "https://www.goodreads.com/review/list/109135301?shelf=favorites",
    refreshIntervalDays: 1,
  }),
  schema: BookSchema,
});

const readBooks = defineCollection({
  loader: goodreadsLoader({
    url: "https://www.goodreads.com/review/list/109135301?shelf=read",
    refreshIntervalDays: 1,
  }),
  schema: BookSchema,
});

export const collections = { writing, favoriteBooks, readBooks };
