import nextTranslate from 'next-translate-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...nextTranslate({
    // other next-translate options if any
  }),
};

export default nextConfig;
