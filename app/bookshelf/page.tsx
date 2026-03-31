import { fetchShelf } from '@/lib/goodreads';
import { Navigation } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

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
    <div className="container">
      <h1>Akil Rammohan's Bookshelf</h1>
      <Navigation />

      <p>
        I've been reading voraciously my whole life, and figured I should try to track it on{' '}
        <a href="https://www.goodreads.com/user/show/109135301-akil-rammohan" target="_blank" rel="noopener noreferrer">goodreads</a>{' '}
        (and sync it here), but I'm sure I forgot many books when I went through adding stuff to goodreads. I.e. this is far from an exhaustive list.
      </p>

      {favoriteBooks.length > 0 && (
        <>
          <h2>favorites</h2>
          <ul>
            {favoriteBooks.map(book => (
              <li key={book.book_id}>
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  {book.title}
                </a>{' '}
                by {book.author_name}
              </li>
            ))}
          </ul>
        </>
      )}

      {otherSiteBooks.length > 0 && (
        <>
          <h2>other (ordered by rating descending)</h2>
          <ul>
            {otherSiteBooks.map(book => (
              <li key={book.book_id}>
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  {book.title}
                </a>{' '}
                by {book.author_name}
              </li>
            ))}
          </ul>
        </>
      )}

      {favoriteBooks.length === 0 && otherSiteBooks.length === 0 && (
        <p>No books found. Check back later!</p>
      )}
    </div>
  );
}
