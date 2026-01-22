'use client';

import { useState, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const colors = [
  '--color-tet-1', '--color-tet-2', '--color-tet-3', '--color-tet-4',
  '--color-tet-5', '--color-tet-6', '--color-tet-7', '--color-tet-8',
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const ThemeToggle = () => {
  const { theme, mounted, toggleTheme } = useTheme();
  const [linkColor, setLinkColor] = useState(getRandomColor);

  const handleToggle = useCallback(() => {
    toggleTheme();
    setLinkColor(getRandomColor());
  }, [toggleTheme]);

  // Render consistent placeholder during SSR and initial hydration
  if (!mounted) {
    return (
      <span className="theme-toggle">
        <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>light</span>
        <span style={{ color: 'var(--text-color)', fontWeight: 600 }}> / </span>
        <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>dark</span>
      </span>
    );
  }

  return (
    <span className="theme-toggle">
      {theme === 'light' ? (
        <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>light</span>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
          className="theme-toggle-link"
          style={{ color: `var(${linkColor})`, fontWeight: 600 }}
        >
          light
        </a>
      )}
      <span style={{ color: 'var(--text-color)', fontWeight: 600 }}> / </span>
      {theme === 'dark' ? (
        <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>dark</span>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
          className="theme-toggle-link"
          style={{ color: `var(${linkColor})`, fontWeight: 600 }}
        >
          dark
        </a>
      )}
    </span>
  );
};
