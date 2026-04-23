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
        I build reinforcement learning environments at <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a>. We're trying to completely automate software engineering.
      </p>

      <p>
        I'm from the bay area, I went to the University of Wisconsin, and my name is pronounced UH-kill (/ˈʌkɪl/). My interests include AI, <a href="https://github.com/akilrammohan/canon" target="_blank" rel="noopener noreferrer">information diets</a>, <Link href="/bookshelf">reading</Link>, edtech, tennis, trivia, and games (of any form).
      </p>

      <p>
        Before <a href="https://www.mechanize.work" target="_blank" rel="noopener noreferrer">Mechanize</a> I worked at the <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>, the <a href="https://nplus1.wisc.edu/" target="_blank" rel="noopener noreferrer">N+1 Institute</a>, and <a href="https://www.fastersmarter.io/" target="_blank" rel="noopener noreferrer">Think Fast Talk Smart</a>. Check out my <a href="/resume.pdf">resume</a> or <a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">LinkedIn</a> for more info.
      </p>

      <p>
        {recentlyReadBook && (
          <>The last book I read was <a href={recentlyReadBook.link} target="_blank" rel="noopener noreferrer">{recentlyReadBook.title}</a> by <a href={`https://www.goodreads.com/search?q=${encodeURIComponent(recentlyReadBook.author_name)}&search_type=authors`} target="_blank" rel="noopener noreferrer">{recentlyReadBook.author_name}</a>. </>
        )}
        {topAlbum && (
          <>The last album I listened to was <a href={topAlbum.albumUrl} target="_blank" rel="noopener noreferrer">{topAlbum.name}</a> by <a href={topAlbum.artistUrl} target="_blank" rel="noopener noreferrer">{topAlbum.artist}</a>.</>
        )}
      </p>

      <div className="title-images" aria-label="Akil">
        <img src="/letter-A.jpg" alt="A" />
        <img src="/letter-K.jpg" alt="K" />
        <img src="/letter-I.jpg" alt="I" />
        <img src="/letter-L.jpg" alt="L" />
      </div>

      <p className="social-links">
        <a href="https://www.linkedin.com/in/akilrammohan/" target="_blank" rel="noopener noreferrer">linkedin</a> · <a href="/resume.pdf">resume</a> · <a href="https://github.com/akilrammohan" target="_blank" rel="noopener noreferrer">github</a> · <a href="https://x.com/kilrmcgee" target="_blank" rel="noopener noreferrer">x</a> · <a href="https://open.spotify.com/user/akster213" target="_blank" rel="noopener noreferrer">spotify</a> · <a href="https://www.goodreads.com/user/show/109135301-akil-rammohan" target="_blank" rel="noopener noreferrer">goodreads</a>
      </p>
    </div>
  );
};
