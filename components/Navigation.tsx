'use client';

import Link from 'next/link';

const allLinks = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  { href: 'https://www.linkedin.com/in/akilrammohan/', label: 'linkedin', external: true },
  { href: '/resume.pdf', label: 'resume', external: true },
  { href: 'https://github.com/akilrammohan', label: 'github', external: true },
  { href: 'https://x.com/kilrmcgee', label: 'x', external: true },
  { href: 'https://open.spotify.com/user/akster213', label: 'spotify', external: true },
  { href: 'https://www.goodreads.com/user/show/109135301-akil-rammohan', label: 'goodreads', external: true },
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

export default function Navigation() {
  return (
    <nav className="nav-container">
      <ul className="nav-links floating">
        {allLinks.map((link) => (
          <NavLink key={link.label} {...link} />
        ))}
      </ul>
    </nav>
  );
}
