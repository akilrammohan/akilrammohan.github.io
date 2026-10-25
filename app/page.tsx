import { effectiveReadDate, fetchShelf } from '@/lib/goodreads';
import { getTopAlbumWeekly } from '@/lib/lastfm';
import { HomeContent } from '@/components/HomeContent';

export const revalidate = 3600; // Serve static HTML, refresh data in the background hourly

export default async function HomePage() {
  const [siteBooks, topAlbum] = await Promise.all([
    fetchShelf('site'),
    getTopAlbumWeekly(),
  ]);

  const recentlyReadBook = [...siteBooks].sort(
    (a, b) => effectiveReadDate(b) - effectiveReadDate(a)
  )[0];

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
