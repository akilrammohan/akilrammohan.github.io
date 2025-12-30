import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.gr-assets.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
    ],
  },
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
