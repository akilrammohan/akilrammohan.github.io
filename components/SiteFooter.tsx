import { Fragment } from 'react';

const links = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/akilrammohan/', external: true },
  { label: 'resume', href: '/resume.pdf', external: false },
  { label: 'github', href: 'https://github.com/akilrammohan', external: true },
  { label: 'x', href: 'https://x.com/kilrmcgee', external: true },
  { label: 'spotify', href: 'https://open.spotify.com/user/akster213', external: true },
  { label: 'goodreads', href: 'https://www.goodreads.com/user/show/109135301-akil-rammohan', external: true },
];

export const SiteFooter = () => (
  <footer className="site-footer">
    {links.map((link, i) => (
      <Fragment key={link.label}>
        {i > 0 && <span className="sep" aria-hidden="true">·</span>}
        <a
          href={link.href}
          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {link.label}
        </a>
      </Fragment>
    ))}
  </footer>
);
