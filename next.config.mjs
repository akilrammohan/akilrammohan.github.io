import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/resume.pdf',
        destination: '/api/resume',
      },
    ];
  },
};

export default withContentlayer(nextConfig);
