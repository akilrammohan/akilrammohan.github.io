'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/bookshelf', label: 'Bookshelf' },
  { href: '/writing', label: 'Writing' },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav>
      <ul>
        {navLinks.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
