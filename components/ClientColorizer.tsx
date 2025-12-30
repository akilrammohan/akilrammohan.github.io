'use client';

import { useEffect } from 'react';

export default function ClientColorizer() {
  useEffect(() => {
    const colors = [
      '--color-tet-1', '--color-tet-2', '--color-tet-3',
      '--color-tet-4', '--color-tet-5', '--color-tet-6'
    ];

    // Fisher-Yates shuffle to create random color order
    function shuffle(array: string[]) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const shuffledColors = shuffle(colors);

    // Select all links in DOM order and apply cycling colors
    document.querySelectorAll('a').forEach((link, i) => {
      link.style.color = `var(${shuffledColors[i % 6]})`;
    });
  }, []);

  return null;
}
