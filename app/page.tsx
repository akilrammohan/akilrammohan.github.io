import { fetchShelf } from '@/lib/goodreads';
import { getTopAlbumWeekly } from '@/lib/lastfm';
import { ExpandableSection } from '@/components/ExpandableSection';

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
    <>
      <h1>Akil Rammohan</h1>

      <div className="sections-grid">
        <div className="sections-column">
          <ExpandableSection label="bio">
            <p>
              senior at u of wisconsin<br />
              computer science & data science<br />
              los altos, ca<br />
              name pronounced UH-kill (<span className="ipa">/ˈʌkɪl/</span>)
            </p>
          </ExpandableSection>

          <ExpandableSection label="experience">
            <p>
              AI in VR research (<a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>)<br />
              agentic AI (<a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">N+1 Institute</a>)<br />
              data analytics (<a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>)<br />
            </p>
          </ExpandableSection>
        </div>

        <div className="sections-column">
          <ExpandableSection label="interests">
            <p>
              reading{recentlyReadBook && (
                <> (<a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a>)</>
              )}<br />
              music{topAlbum && (
                <> (<a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a>)</>
              )}<br />
              <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a><br />
              <a href="https://github.com/akilrammohan/lifecal-ios-shortcut" target="_blank" rel="noopener noreferrer">short-lived personal software</a><br />
              edtech
            </p>
          </ExpandableSection>

          <ExpandableSection label="currently">
            <p>
              building edtech with AI<br />
              reach out: akilan[dot]rammohan[at]gmail[dot]com
            </p>
          </ExpandableSection>
        </div>
      </div>

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
