'use client';

import Link from 'next/link';
import { ExpandableSection } from '@/components/ExpandableSection';
import { GroupedSections } from '@/components/GroupedSections';
import Navigation, { InternalNav } from '@/components/Navigation';

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
    <>
      <InternalNav />
      <div className="main-content-column">
        <Navigation />
        <h1 className="floating-title">Akil Rammohan</h1>

      <GroupedSections>
        <ExpandableSection
          label="bio"
          lines={[
            'senior at u of wisconsin',
            'computer science & data science',
            'bay area, ca',
            <>name pronounced UH-kill (<span className="ipa">/ˈʌkɪl/</span>)</>,
          ]}
        />

        <ExpandableSection
          label="experience"
          lines={[
            <>AI in VR research (<a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>)</>,
            <>agentic AI (<a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">N+1 Institute</a>)</>,
            <>data analytics (<a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>)</>,
          ]}
        />

        <ExpandableSection
          label="interests"
          lines={[
            <><a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a></>,
            'edtech',
            <><Link href="/bookshelf">reading fiction</Link></>,
            'tennis',
            'lifting weights'
          ]}
        />

        <ExpandableSection
          label="currently"
          lines={[
            'building edtech with AI',
            'reach out: akilan[dot]rammohan[at]gmail[dot]com',
          ]}
        />

        <ExpandableSection
          label="recently"
          lines={[
            recentlyReadBook && (
              <>finished reading <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a></>
            ),
            topAlbum && (
              <>listened to <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a></>
            ),
          ]}
        />
      </GroupedSections>
      </div>
    </>
  );
};
