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
}

const parser = new Parser({
  customFields: {
    item: [
      ['book_id', 'book_id'],
      ['author_name', 'author_name'],
      ['book_large_image_url', 'book_large_image_url'],
      ['user_rating', 'user_rating'],
      ['user_read_at', 'user_read_at'],
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
        title: item.title || '',
        author_name: (item as any).author_name || '',
        book_large_image_url: (item as any).book_large_image_url || '',
        link: item.link || '',
        user_rating: Number((item as any).user_rating) || 0,
        user_read_at: (item as any).user_read_at,
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
  ['goodreads-shelf'],
  {
    revalidate: 3600, // 1 hour
    tags: ['goodreads']
  }
);
