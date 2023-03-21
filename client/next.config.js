/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
};

const withPWA = require('next-pwa');
module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/*',
        destination: 'https://bunnychat.vercel.app/*',
      },
    ];
  },
};

module.exports = nextConfig;
