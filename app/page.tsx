import { fetchShelf } from '@/lib/goodreads';
import { getRecentTracks } from '@/lib/lastfm';

export const dynamic = 'force-dynamic'; // Fetch fresh data on every request

export default async function HomePage() {
  const [siteBooks, initialTrack] = await Promise.all([
    fetchShelf('site'),
    getRecentTracks(),
  ]);

  const recentlyReadBook = siteBooks.sort((a, b) => {
    const dateA = a.user_read_at ? new Date(a.user_read_at).getTime() : 0;
    const dateB = b.user_read_at ? new Date(b.user_read_at).getTime() : 0;
    return dateB - dateA;
  })[0];

  return (
    <>
      <h1>Akil Rammohan</h1>

      <p>
        Akil Rammohan is a computer science student at the University of Wisconsin. His name is pronounced UH-kill (<span className="ipa">/ˈʌkɪl/</span> to be precise).
      </p>

      <p>
        He's worked on AI in VR research at the{' '}
        <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">
          NeuroErgonomics Lab
        </a>, agentic AI with the{' '}
        <a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">
          N+1 Institute
        </a>, and data analytics at{' '}
        <a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">
          Think Fast Talk Smart
        </a>, a business communication podcast.
        Check out his{' '}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a> for more.
      </p>

      <p>
        Interests include reading{recentlyReadBook && (
          <> (most recently, <em>{recentlyReadBook.title}</em>)</>
        )}; music{initialTrack && (
          <> (most recently, <a href={initialTrack.trackUrl} target="_blank" rel="noopener noreferrer">{initialTrack.title}</a> by <a href={initialTrack.artistUrl} target="_blank" rel="noopener noreferrer">{initialTrack.artist}</a>)</>
        )}; <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a>; <a href="https://github.com/akilrammohan/lifecal-ios-shortcut" target="_blank" rel="noopener noreferrer">vibe coding</a>; and agentic AI in edtech (<a href="#">link soon</a>).
      </p>

      <p>
        He is currently building something to apply AI to the failing, fragmented education system. If that sounds interesting, reach out to him at akilan[dot]rammohan[at]gmail[dot]com.
      </p>

      <ul className="external-links">
        <li><a href="https://github.com/akilrammohan" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li className="separator">-</li>
        <li><a href="https://x.com/kilrmcgee" target="_blank" rel="noopener noreferrer">X</a></li>
        <li className="separator">-</li>
        <li><a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li className="separator">-</li>
        <li><a href="https://www.goodreads.com/user/show/109135301-akil-rammohan" target="_blank" rel="noopener noreferrer">Goodreads</a></li>
        <li className="separator">-</li>
        <li><a href="https://open.spotify.com/user/akster213" target="_blank" rel="noopener noreferrer">Spotify</a></li>
        <li className="separator">-</li>
        <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
      </ul>
    </>
  );
}
