import { fetchShelf } from '@/lib/goodreads';
import { ExpandableSection } from '@/components/ExpandableSection';
import { GroupedSections } from '@/components/GroupedSections';
import Navigation from '@/components/Navigation';

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
    <div className="main-content-column">
      <Navigation />
      <h1 className="floating-title">Akil's Bookshelf</h1>

      <GroupedSections className="bookshelf">
        <ExpandableSection
          label="about"
          lines={[
            <>books from my{' '}
              <a
                href="https://www.goodreads.com/user/show/109135301-akil-rammohan"
                target="_blank"
                rel="noopener noreferrer"
              >
                goodreads
              </a>{' '}
              lib</>,
            'mostly literary fiction with some scifi, fantasy, and nonfic',
          ]}
        />

        {favoriteBooks.length > 0 && (
          <ExpandableSection
            label="favorites"
            lines={favoriteBooks.map(book => (
              <span key={book.book_id}>
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.title}
                </a>
                {' '}by {book.author_name}
              </span>
            ))}
          />
        )}

        {otherSiteBooks.length > 0 && (
          <ExpandableSection
            label="other (ordered by rating descending)"
            lines={otherSiteBooks.map(book => (
              <span key={book.book_id}>
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.title}
                </a>
                {' '}by {book.author_name}
              </span>
            ))}
          />
        )}

        {favoriteBooks.length === 0 && otherSiteBooks.length === 0 && (
          <p className="empty-state">No books found. Check back later!</p>
        )}
      </GroupedSections>
    </div>
  );
}
