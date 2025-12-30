import { Abril_Fatface, Exo_2, Istok_Web } from 'next/font/google';

export const abrilFatface = Abril_Fatface({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abril',
  display: 'swap',
});

export const exo2 = Exo_2({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
});

export const istokWeb = Istok_Web({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-istok',
  display: 'swap',
});

// BBH Bogle is loaded via Google Fonts link in the layout
// because it's not available in next/font/google package
