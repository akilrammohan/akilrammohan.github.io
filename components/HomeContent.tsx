'use client';

import { ExpandableSection } from '@/components/ExpandableSection';
import { GroupedSections } from '@/components/GroupedSections';
import Navigation from '@/components/Navigation';

interface Book {
  title: string;
  author_name: string;
  link: string;
}

interface Album {
  name: string;
  artist: string;
  albumUrl: string;
  artistUrl: string;
}

interface HomeContentProps {
  recentlyReadBook: Book | null;
  topAlbum: Album | null;
}

export const HomeContent = ({ recentlyReadBook, topAlbum }: HomeContentProps) => {
  return (
    <div className="main-content-column">
      <Navigation />
      <h1 className="floating-title">Akil Rammohan</h1>

      <GroupedSections>
        <ExpandableSection label="bio">
          <p>
            senior at u of wisconsin<br />
            computer science & data science<br />
            bay area, ca<br />
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

        <ExpandableSection label="interests">
          <p>
            <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a><br />
            edtech<br />
            <a href="https://github.com/akilrammohan/bmarxs" target="_blank" rel="noopener noreferrer">clis for agents</a><br />
            tennis + lifting weights<br />
            <a href="https://github.com/akilrammohan/lifecal-ios-shortcut" target="_blank" rel="noopener noreferrer">short-lived personal software</a>
          </p>
        </ExpandableSection>

        <ExpandableSection label="currently">
          <p>
            building edtech with AI<br />
            reach out: akilan[dot]rammohan[at]gmail[dot]com
          </p>
        </ExpandableSection>

        <ExpandableSection label="recently">
          <p>
            {recentlyReadBook && (
              <>finished reading <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a><br /></>
            )}
            {topAlbum && (
              <>listened to <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a></>
            )}
          </p>
        </ExpandableSection>
      </GroupedSections>
    </div>
  );
};
