'use client';

import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

const socialLinks = [
  { href: 'https://github.com/akilrammohan', label: 'github' },
  { href: 'https://x.com/kilrmcgee', label: 'x' },
  { href: 'https://www.linkedin.com/in/akilrammohan/', label: 'linkedin' },
  { href: 'https://www.goodreads.com/user/show/109135301-akil-rammohan', label: 'goodreads' },
  { href: 'https://open.spotify.com/user/akster213', label: 'spotify' },
];

const SocialLink = ({ href, label }: { href: string; label: string }) => {
  const elementRef = useRef<HTMLLIElement>(null);
  const { registerElement, unregisterElement } = useConcentricContext();
  const id = `social-${label.toLowerCase()}`;

  useEffect(() => {
    registerElement(id, 'social', elementRef.current);
    return () => unregisterElement(id);
  }, [id, registerElement, unregisterElement]);

  return (
    <li ref={elementRef} className="social-link-item">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </li>
  );
};

export const SocialLinks = () => {
  return (
    <ul className="social-links">
      {socialLinks.map((link) => (
        <SocialLink key={link.label} href={link.href} label={link.label} />
      ))}
    </ul>
  );
};
