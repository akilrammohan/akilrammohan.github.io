'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useConcentricContext } from '@/contexts/ConcentricContext';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/bookshelf', label: 'bookshelf' },
  { href: '/resume.pdf', label: 'resume', external: true },
];

const NavLink = ({ href, label, external }: { href: string; label: string; external?: boolean }) => {
  const elementRef = useRef<HTMLLIElement>(null);
  const { registerElement, unregisterElement } = useConcentricContext();
  const id = `nav-${label.toLowerCase()}`;

  useEffect(() => {
    registerElement(id, 'nav', elementRef.current);
    return () => unregisterElement(id);
  }, [id, registerElement, unregisterElement]);

  return (
    <li ref={elementRef} className="nav-link-item">
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
    <ul className="nav-links">
      {navLinks.map((link) => (
        <NavLink key={link.label} {...link} />
      ))}
    </ul>
  );
}
