import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import { ClientColorizer } from '@/components/ClientColorizer';
import { Navigation } from '@/components/Navigation';
import { SiteFooter } from '@/components/SiteFooter';
import '@/styles/globals.css';

// Ostrich Sans Medium (The League of Moveable Type, OFL): a caps-only
// condensed face with one usable weight; globals.css thickens it with a
// hairline stroke and the browser synthesizes bold for links.
const ostrichSans = localFont({
  src: './fonts/OstrichSans-Medium.woff2',
  weight: '400',
  display: 'swap',
});

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
  // Auto-stamp anchors added later (e.g. by client-side re-renders)
  // without reshuffling existing colors.
  // Only ClientColorizer reshuffles, since only it knows a navigation
  // happened rather than an in-place DOM change.
  new MutationObserver(stamp).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ostrichSans.className}>
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
