import { Analytics } from '@vercel/analytics/react';
import { Benne } from 'next/font/google';
import { ClientColorizer } from '@/components/ClientColorizer';
import { Navigation } from '@/components/Navigation';
import { SiteFooter } from '@/components/SiteFooter';
import '@/styles/globals.css';

const benne = Benne({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Akil Rammohan',
    template: '%s | Akil Rammohan',
  },
};

const colorizerScript = `
(function() {
  var order;
  function s(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function stamp() {
    document.querySelectorAll('a').forEach(function(l, i) {
      l.setAttribute('data-c', order[i % order.length]);
    });
  }
  window.__colorizeLinks = function(reshuffle) {
    if (!order || reshuffle) order = s([0, 1, 2, 3, 4]);
    stamp();
  };
  window.__colorizeLinks();
  // Auto-stamp anchors added later (e.g. the theme toggle swapping its
  // label from a span to a link) without reshuffling existing colors.
  // Only ClientColorizer reshuffles, since only it knows a navigation
  // happened rather than an in-place DOM change.
  new MutationObserver(stamp).observe(document.body, {
    childList: true,
    subtree: true,
  });
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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={benne.className}>
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
