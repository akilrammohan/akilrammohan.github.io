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
  var earthen = ['#a85545','#b89045','#7a9670','#5e7a8e','#9a7585'];
  var autumn  = ['#b65437','#c89039','#a86a3a','#3a8585','#7a3a4a','#8a5a82'];
  function s(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  window.__colorizeLinks = function() {
    var theme = document.documentElement.getAttribute('data-theme');
    var sh = s(theme === 'dark' ? autumn : earthen);
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
        <link href="https://fonts.googleapis.com/css2?family=Benne&display=swap" rel="stylesheet" />
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
