'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  // { href: '/writing', label: 'writing' },
  { href: '/resume.pdf', label: 'resume', external: true },
];

const NavItem = ({
  link,
  isActive,
}: {
  link: { href: string; label: string; external?: boolean };
  isActive: boolean;
}) => {
  const elementRef = useRef<HTMLLIElement>(null);
  const { registerElement, unregisterElement } = useConcentricContext();
  const id = `nav-${link.label.toLowerCase()}`;

  useEffect(() => {
    registerElement(id, 'nav', elementRef.current);
    return () => unregisterElement(id);
  }, [id, registerElement, unregisterElement]);

  return (
    <li ref={elementRef} className="nav-item">
      {link.external ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      ) : (
        <Link href={link.href} className={isActive ? 'active' : ''}>
          {link.label}
        </Link>
      )}
    </li>
  );
};

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
        {navLinks.map((link) => (
          <NavItem key={link.href} link={link} isActive={isActive(link.href)} />
        ))}
      </ul>
    </nav>
  );
}
