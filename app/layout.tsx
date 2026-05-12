import { Analytics } from '@vercel/analytics/react';
import { ClientColorizer } from '@/components/ClientColorizer';
import { Navigation } from '@/components/Navigation';
import { SiteFooter } from '@/components/SiteFooter';
import '@/styles/globals.css';

export const metadata = {
  title: {
    default: 'Akil Rammohan',
    template: '%s | Akil Rammohan',
  },
};

const colorizerScript = `
(function() {
  var berryDeep = ['#c6397d','#7d39c6','#b58a4a','#397dc6','#8ab54a'];
  var berry     = ['#d878a8','#a878d8','#c8a878','#78a8d8','#a8c878'];
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
    var sh = s(theme === 'dark' ? berry : berryDeep);
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
        <div className="site">
          <aside className="sidebar">
            <Navigation />
          </aside>
          <main className="main">
            {children}
            <SiteFooter />
          </main>
        </div>
        <script dangerouslySetInnerHTML={{ __html: colorizerScript }} />
        <Analytics />
      </body>
    </html>
  );
}
