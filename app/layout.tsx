import { Analytics } from '@vercel/analytics/react';
import { ClientColorizer } from '@/components/ClientColorizer';
import { ThemeToggle } from '@/components/ThemeToggle';
import '@/styles/globals.css';

export const metadata = {
  title: {
    default: 'Akil Rammohan',
    template: '%s | Akil Rammohan',
  },
};

const colorizerScript = `
(function() {
  var c = ['#c75a5a','#c9a84c','#6ab06a','#5a8fbf','#9a6abf'];
  function s(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  window.__colorizeLinks = function() {
    var sh = s(c);
    document.querySelectorAll('a').forEach(function(l, i) {
      l.style.color = sh[i % sh.length];
    });
  };
  window.__colorizeLinks();
})();
`;

const themeInitScript = `
(function() {
  try {
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ClientColorizer />
        <ThemeToggle />
        {children}
        <script dangerouslySetInnerHTML={{ __html: colorizerScript }} />
        <Analytics />
      </body>
    </html>
  );
}
