/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', // Optimized for containerized environments like Google Cloud Run
    swcMinify: true,
    images: {
        domains: [],
    },
}

module.exports = nextConfig