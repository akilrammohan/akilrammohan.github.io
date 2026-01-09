import { fetchShelf } from '@/lib/goodreads';
import { ExpandableSection } from '@/components/ExpandableSection';
import Image from 'next/image';

export const revalidate = 3600; // ISR: revalidate hourly

export const metadata = {
  title: 'Bookshelf',
};

export default async function BookshelfPage() {
  const [favoriteBooks, siteBooks] = await Promise.all([
    fetchShelf('favorites'),
    fetchShelf('site'),
  ]);

  const favoriteIds = new Set(favoriteBooks.map(book => book.book_id));
  const otherSiteBooks = siteBooks
    .filter(book => !favoriteIds.has(book.book_id))
    .sort((a, b) => b.user_rating - a.user_rating);

  return (
    <div className="bookshelf-full-width">
      <h1 className="floating-title">Bookshelf</h1>

      <div className="sections-container">
        <ExpandableSection label="about">
          <p>
            books from my{' '}
            <a
              href="https://www.goodreads.com/user/show/109135301-akil-rammohan"
              target="_blank"
              rel="noopener noreferrer"
            >
              goodreads
            </a>{' '}
            lib. mostly literary fiction with some scifi, fantasy, and nonfic.
          </p>
        </ExpandableSection>

        {favoriteBooks.length > 0 && (
          <ExpandableSection label="favorites">
            <div className="favorites-grid">
              {favoriteBooks.map(book => (
                <a
                  key={book.book_id}
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={book.book_large_image_url || '/placeholder-cover.svg'}
                    alt={`Cover of ${book.title}`}
                    width={200}
                    height={300}
                    className="favorite-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </ExpandableSection>
        )}

        {otherSiteBooks.length > 0 && (
          <ExpandableSection label="other (ordered by rating descending)">
            <div className="read-grid">
              {otherSiteBooks.map(book => (
                <a
                  key={book.book_id}
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={book.book_large_image_url || '/placeholder-cover.svg'}
                    alt={`Cover of ${book.title}`}
                    width={200}
                    height={300}
                    className="read-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </ExpandableSection>
        )}

        {favoriteBooks.length === 0 && otherSiteBooks.length === 0 && (
          <p className="empty-state">No books found. Check back later!</p>
        )}
      </div>
    </div>
  );
}
