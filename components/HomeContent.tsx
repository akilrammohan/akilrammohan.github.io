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
          I work at <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a>, where I build reinforcement learning environments and evals for software engineering tasks. We&apos;re trying to fully automate software engineering.
        </p>

        <p>
          I&apos;m from the bay area originally, and went to the University of Wisconsin-Madison. Outside of work I love <Link href="/bookshelf">reading</Link>, trivia, tennis, and games.
        </p>

        <p>
          Also my name is pronounced UH-kill (<a href="https://en.wikipedia.org/wiki/International_Phonetic_Alphabet" target="_blank" rel="noopener noreferrer" className="ipa">/ˈʌkɪl/</a>).
        </p>

        <p>
          Before Mechanize I was an inaugural SAIL fellow at the <a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">N+1 Institute</a>, building an agentic AI news aggregator, while also doing data analysis at <a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>. Before that I was an undergraduate researcher at the <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a> working on embodied AI in XR. Check out my <a href="/resume.pdf">resume</a> or <a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">linkedin</a> for more info.
        </p>

        <p>
          {recentlyReadBook && (
            <>The last book I read was <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a>. </>
          )}
          {topAlbum && (
            <>My most listened to album over the last week was <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a>.</>
          )}
        </p>
      </div>
    </>
  );
};
