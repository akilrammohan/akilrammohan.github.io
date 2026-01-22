'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const internalLinks = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
];

const externalLinks = [
  { href: 'https://www.linkedin.com/in/akilrammohan/', label: 'linkedin' },
  { href: '/resume.pdf', label: 'resume' },
  { href: 'https://github.com/akilrammohan', label: 'github' },
  { href: 'https://x.com/kilrmcgee', label: 'x' },
  { href: 'https://open.spotify.com/user/akster213', label: 'spotify' },
  { href: 'https://www.goodreads.com/user/show/109135301-akil-rammohan', label: 'goodreads' },
];

interface NavLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

const NavLink = ({ href, label, external }: NavLinkProps) => {
  return (
    <li className="nav-link-item floating">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link href={href}>{label}</Link>
      )}
    </li>
  );
};

// Internal navigation (home, bookshelf) - fixed top left
export const InternalNav = () => {
  return (
    <nav className="internal-nav">
      <ul className="nav-links floating">
        {internalLinks.map((link) => (
          <NavLink key={link.label} {...link} />
        ))}
      </ul>
      <div className="theme-toggle-wrapper floating" style={{ marginTop: '0.5rem' }}>
        <ThemeToggle />
      </div>
    </nav>
  );
};

// External/social links - stays with the bottom left content
export default function Navigation() {
  return (
    <nav className="nav-container">
      <ul className="nav-links floating">
        {externalLinks.map((link) => (
          <NavLink key={link.label} href={link.href} label={link.label} external />
        ))}
      </ul>
    </nav>
  );
}
