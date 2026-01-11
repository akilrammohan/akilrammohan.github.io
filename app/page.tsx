import { fetchShelf } from '@/lib/goodreads';
import { getTopAlbumWeekly } from '@/lib/lastfm';
import { HomeContent } from '@/components/HomeContent';

export const dynamic = 'force-dynamic'; // Fetch fresh data on every request

export default async function HomePage() {
  const [siteBooks, topAlbum] = await Promise.all([
    fetchShelf('site'),
    getTopAlbumWeekly(),
  ]);

  const recentlyReadBook = siteBooks.sort((a, b) => {
    const dateA = a.user_read_at ? new Date(a.user_read_at).getTime() : 0;
    const dateB = b.user_read_at ? new Date(b.user_read_at).getTime() : 0;
    return dateB - dateA;
  })[0];

  return (
    <HomeContent
      recentlyReadBook={recentlyReadBook ? {
        title: recentlyReadBook.title,
        author_name: recentlyReadBook.author_name,
        link: recentlyReadBook.link,
      } : null}
      topAlbum={topAlbum}
    />
  );
}
