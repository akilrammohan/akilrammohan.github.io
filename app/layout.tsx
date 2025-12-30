import { abrilFatface, exo2, istokWeb } from '@/lib/fonts';
import Navigation from '@/components/Navigation';
import ClientColorizer from '@/components/ClientColorizer';
import '@/styles/globals.css';

export const metadata = {
  title: {
    default: 'Akil Rammohan',
    template: '%s | Akil Rammohan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${abrilFatface.variable} ${exo2.variable} ${istokWeb.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* BBH Bogle from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=BBH+Bogle&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="layout">
          <aside className="sidebar">
            <Navigation />
          </aside>
          <main className="content">
            {children}
          </main>
        </div>
        <ClientColorizer />
      </body>
    </html>
  );
}
