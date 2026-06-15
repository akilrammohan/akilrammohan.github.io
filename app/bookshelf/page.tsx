import { fetchShelf } from '@/lib/goodreads';
import { PageHeader } from '@/components/PageHeader';

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
    <>
      <PageHeader title="Akil Rammohan's Bookshelf" />
      <div className="container">
        <p>
          I've loved reading my whole life, and figured I should try to track it on{' '}
          <a href="https://www.goodreads.com/user/show/109135301-akil-rammohan" target="_blank" rel="noopener noreferrer">goodreads</a>. Here's a list of my favorites + the books I remembered reading off the top of my head when I joined goodreads.
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
    </>
  );
}
