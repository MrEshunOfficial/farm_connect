/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  reactStrictMode: true,
  headers: async () => {
    return [
      {
        source: "/service-worker.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
