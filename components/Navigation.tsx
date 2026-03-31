'use client';

import Link from 'next/link';

const links = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  { href: '/publications', label: 'publications' },
];

export const Navigation = () => {
  return (
    <nav>
      {links.map((link) => (
        <Link key={link.label} href={link.href}>{link.label}</Link>
      ))}
    </nav>
  );
};
