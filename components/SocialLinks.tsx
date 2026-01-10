'use client';

import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';
import { useDraggable } from '@/lib/useDraggable';

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
  const { dragHandlers, offset, isDragging } = useDraggable(id);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const wasDragged = useRef(false);

  useEffect(() => {
    registerElement(id, 'social', elementRef.current);
    return () => unregisterElement(id);
  }, [id, registerElement, unregisterElement]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    wasDragged.current = false;
    dragHandlers.onMouseDown(e);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Check if this was a drag (moved more than 5px)
    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) {
        wasDragged.current = true;
      }
    }

    // Prevent navigation if we dragged
    if (wasDragged.current) {
      e.preventDefault();
    }

    dragStartPos.current = null;
  };

  return (
    <li
      ref={elementRef}
      className="social-link-item"
      onMouseDown={handleMouseDown}
      onTouchStart={dragHandlers.onTouchStart}
      onClick={handleClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
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
