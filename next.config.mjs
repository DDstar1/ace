/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["idkuekkbsqflbbopkqec.supabase.co"], // Add your Supabase domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
