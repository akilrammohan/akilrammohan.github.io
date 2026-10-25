import Parser from 'rss-parser';
import { unstable_cache } from 'next/cache';

export interface GoodreadsBook {
  book_id: string;
  title: string;
  author_name: string;
  book_large_image_url: string;
  link: string;
  user_rating: number;
  user_read_at?: string;
  user_date_added?: string;
}

const parser = new Parser({
  customFields: {
    item: [
      ['book_id', 'book_id'],
      ['author_name', 'author_name'],
      ['book_large_image_url', 'book_large_image_url'],
      ['user_rating', 'user_rating'],
      ['user_read_at', 'user_read_at'],
      ['user_date_added', 'user_date_added'],
    ]
  }
});

async function fetchShelfRaw(shelfUrl: string): Promise<GoodreadsBook[]> {
  try {
    const feed = await parser.parseURL(shelfUrl);

    return feed.items.map(item => {
      // Extract book_id from guid if needed
      const bookId = (item as any).book_id ||
                     (item.guid ? item.guid.split('/').pop()?.split('?')[0] : '') ||
                     '';

      return {
        book_id: bookId,
        title: (item.title || '')
          .replace(/\s*\([^,]+,\s*#\d+\)$/, '') // Remove series notation like "(Series, #1)"
          .replace(/:\s.*$/, ''), // Remove subtitle after colon
        author_name: (item as any).author_name || '',
        book_large_image_url: (item as any).book_large_image_url || '',
        link: item.link || '',
        user_rating: Number((item as any).user_rating) || 0,
        user_read_at: (item as any).user_read_at,
        user_date_added: (item as any).user_date_added,
      };
    });
  } catch (error) {
    console.error('Error fetching Goodreads shelf:', error);
    return [];
  }
}

// Cached with 1-hour revalidation
export const fetchShelf = unstable_cache(
  async (shelf: 'favorites' | 'site') => {
    const url = `https://www.goodreads.com/review/list_rss/109135301?shelf=${shelf}`;
    return fetchShelfRaw(url);
  },
  // Bumped to v2: cached payload now carries user_date_added.
  ['goodreads-shelf-v2'],
  {
    revalidate: 3600, // 1 hour
    tags: ['goodreads']
  }
);

// Goodreads only fills user_read_at when a read date was entered by hand, which
// is rare, so date_added carries most of the signal: a book gets shelved when
// it's finished. Back-added books break that, though, so take whichever of the
// two dates is earlier — a book read years ago but shelved today dates to the
// read date and stays out of the "most recently read" slot.
export const effectiveReadDate = (book: GoodreadsBook): number => {
  const times = [book.user_read_at, book.user_date_added]
    .map(value => (value ? new Date(value).getTime() : NaN))
    .filter(time => !Number.isNaN(time));

  if (times.length === 0) return 0;
  return Math.min(...times);
};
