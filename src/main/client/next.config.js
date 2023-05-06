/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "platform-lookaside.fbsbx.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
