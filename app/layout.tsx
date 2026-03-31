import { Analytics } from '@vercel/analytics/react';
import { ClientColorizer } from '@/components/ClientColorizer';
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
  new MutationObserver(function(_, obs) {
    if (document.querySelectorAll('a').length > 0) {
      obs.disconnect();
      window.__colorizeLinks();
    }
  }).observe(document, { childList: true, subtree: true });
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
        <link href="https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: colorizerScript }} />
      </head>
      <body>
        <ClientColorizer />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
