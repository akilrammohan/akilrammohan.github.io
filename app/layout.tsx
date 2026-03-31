import { Analytics } from '@vercel/analytics/react';
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
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
