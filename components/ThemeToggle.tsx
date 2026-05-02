'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark' || current === 'light') {
        if (current !== theme) setTheme(current);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    const colorize = (window as unknown as { __colorizeLinks?: () => void }).__colorizeLinks;
    if (colorize) colorize();
  }, [theme]);

  const toggle = (next: Theme) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setTheme(next);
  };

  return (
    <div className="theme-toggle">
      {theme === 'light' ? (
        <span className="toggle-item" data-text="light">light</span>
      ) : (
        <a href="#" className="toggle-item" data-text="light" onClick={toggle('light')}>light</a>
      )}
      <span className="sep">/</span>
      {theme === 'dark' ? (
        <span className="toggle-item" data-text="dark">dark</span>
      ) : (
        <a href="#" className="toggle-item" data-text="dark" onClick={toggle('dark')}>dark</a>
      )}
    </div>
  );
};
