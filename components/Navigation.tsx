'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';
import { useDraggable } from '@/lib/useDraggable';

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
  const { dragHandlers, offset, isDragging } = useDraggable(id);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const wasDragged = useRef(false);

  useEffect(() => {
    registerElement(id, 'nav', elementRef.current);
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
      className="nav-item"
      onMouseDown={handleMouseDown}
      onTouchStart={dragHandlers.onTouchStart}
      onClick={handleClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
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
