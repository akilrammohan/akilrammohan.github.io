'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

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
    <div className="container">
      <h1>Akil Rammohan</h1>
      <Navigation />

      <p>
        I'm a junior software engineer at <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a>, where I build reinforcement learning environments to completely automate software engineering. I'm also finishing my CS degree at the University of Wisconsin-Madison.
      </p>

      <p>
        I'm from the bay area, and my name is pronounced UH-kill (/ˈʌkɪl/). I'm interested in AI, <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a>, <Link href="/bookshelf">reading</Link>, edtech, tennis, trivia, and games (of any form).
      </p>

      <p>
        I've done AI in VR research at the <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>, worked on agentic AI for information diets at the <a href="https://nplus1.wisc.edu" target="_blank" rel="noopener noreferrer">N+1 Institute</a>'s Summer AI Lab (funded by OpenAI with API credits + a $1,500 scholarship), and analyzed podcast data to improve ad revenue at <a href="https://www.fastersmarter.io" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>.
      </p>

      <p>
        I'm currently working on a tool to help professors better engage their students with AI. If that sounds interesting reach out at akilan[dot]rammohan[at]gmail[dot]com!
      </p>

      <p>
        {recentlyReadBook && (
          <>The last book I read was <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a>. </>
        )}
        {topAlbum && (
          <>The last album I listened to was <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a>.</>
        )}
      </p>

      <p>
        <a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">linkedin</a> · <a href="/resume.pdf">resume</a> · <a href="https://github.com/akilrammohan" target="_blank" rel="noopener noreferrer">github</a> · <a href="https://x.com/kilrmcgee" target="_blank" rel="noopener noreferrer">x</a> · <a href="https://open.spotify.com/user/akster213" target="_blank" rel="noopener noreferrer">spotify</a> · <a href="https://www.goodreads.com/user/show/109135301-akil-rammohan" target="_blank" rel="noopener noreferrer">goodreads</a>
      </p>
    </div>
  );
};
