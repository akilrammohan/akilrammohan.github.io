'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  // { href: '/writing', label: 'writing' },
  { href: '/resume.pdf', label: 'resume', external: true },
];

const NavItem = ({ link }: { link: { href: string; label: string; external?: boolean } }) => {
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
        <Link href={link.href}>{link.label}</Link>
      )}
    </li>
  );
};

export default function Navigation() {
  return (
    <nav>
      <ul>
        {navLinks.map((link) => (
          <NavItem key={link.href} link={link} />
        ))}
      </ul>
    </nav>
  );
}
