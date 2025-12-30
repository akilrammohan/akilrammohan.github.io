import { fetchShelf } from '@/lib/goodreads';
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
      <h1>Bookshelf</h1>

      <p className="intro">
        Books from my{' '}
        <a
          href="https://www.goodreads.com/user/show/109135301-akil-rammohan"
          target="_blank"
          rel="noopener noreferrer"
        >
          Goodreads
        </a>{' '}
        library.
      </p>

      {favoriteBooks.length > 0 && (
        <section className="favorites-section">
          <h2>Favorites</h2>
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
        </section>
      )}

      {otherSiteBooks.length > 0 && (
        <section className="read-section">
          <h2>Other Books I've Read</h2>
          <p className="section-note">
            Like most people, I began reading way before I signed up for Goodreads. Due to that I had to remember back to add books from the past, so this list is likely incomplete. I also excluded series I read as a kid, like Harry Potter, Rick Riordan books, Hunger Games, etc. Ordered by rating descending.
          </p>
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
        </section>
      )}

      {favoriteBooks.length === 0 && otherSiteBooks.length === 0 && (
        <p className="empty-state">No books found. Check back later!</p>
      )}
    </div>
  );
}
