'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

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
      <PageHeader title="Akil Rammohan" />
      <div className="container">
        <p>
          I'm a software engineer at <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a>, where I build reinforcement learning environments and evals for software engineering tasks.
        </p>

        <p>
          I'm from the bay area, I went to the University of Wisconsin-Madison, and my name is pronounced UH-kill (<a href="https://en.wikipedia.org/wiki/International_Phonetic_Alphabet" target="_blank" rel="noopener noreferrer" className="ipa">/ˈʌkɪl/</a>). I like AI, <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a>, <Link href="/bookshelf">reading</Link>, edtech, tennis, trivia, and games (all types).
        </p>

        <p>
          Before <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a> I did AI in VR research at <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>, built a news aggregator with the <a href="https://nplus1.wisc.edu/" target="_blank" rel="noopener noreferrer">N+1 Institute</a>, and did data analysis at <a href="https://www.fastersmarter.io/" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>. Check out my <a href="/resume.pdf">resume</a> or <a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">linkedin</a> for more info.
        </p>

        <p>
          {recentlyReadBook && (
            <>The last book I read was <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a>. </>
          )}
          {topAlbum && (
            <>My favorite album at the moment is <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a>.</>
          )}
        </p>
      </div>
    </>
  );
};
