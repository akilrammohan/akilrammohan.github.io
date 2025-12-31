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
        I'm a senior at the University of Wisconsin, majoring in CS and Data Science. My name is pronounced UH-kill (<span className="ipa">/əˈkɪl/</span> if you want to be precise).
      </p>

      <p>
        I've worked on AI in VR research at the{' '}
        <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">
          NeuroErgonomics Lab
        </a>, agentic AI with the{' '}
        <a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">
          N+1 Institute
        </a>, and data analytics at{' '}
        <a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">
          Think Fast Talk Smart
        </a>, a business communication podcast.
        For more on my work experience, see my{' '}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a>.
      </p>

      <p>
        My interests include agentic AI, edtech, and information retrieval/recommender systems. I hope to build software that helps people use AI intentionally, without making them dumber.
      </p>

      <p>
        I've already found today's AI immensely helpful for learning, and as models improve I'm sure the impact on education will be enormous. I'm currently working on something to bridge today's AI with our failing education system, so if you want to chat about that please reach out!
      </p>

      <p>
        In my free time I love reading
        {recentlyReadBook && (
          <> (most recently read <em>{recentlyReadBook.title}</em>)</>
        )}, playing tennis, lifting weights, and playing games.
      </p>

      {initialTrack && (
        <p>
          I last listened to{' '}
          <a href={initialTrack.trackUrl} target="_blank" rel="noopener noreferrer">
            {initialTrack.title}
          </a>{' '}
          by{' '}
          <a href={initialTrack.artistUrl} target="_blank" rel="noopener noreferrer">
            {initialTrack.artist}
          </a>,
          {initialTrack.album && initialTrack.albumUrl && (
            <>{' '}from the album{' '}
              <a href={initialTrack.albumUrl} target="_blank" rel="noopener noreferrer">
                {initialTrack.album}
              </a>
            </>
          )}.
        </p>
      )}

      <ul className="external-links">
        <li><a href="https://github.com/akilrammohan" target="_blank" rel="noopener noreferrer">GitHub</a></li>
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
