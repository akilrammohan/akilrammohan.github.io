'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  { href: '/publications', label: 'publications' },
];

export const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav className="site-nav">
      {links.map((link) => {
        const active =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <div
            key={link.label}
            className={'nav-item' + (active ? ' active' : '')}
          >
            {active ? (
              <span>{link.label}</span>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
