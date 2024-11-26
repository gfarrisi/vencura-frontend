import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  publicRuntimeConfig: {
    dynamicEnvironmentId: process.env.DYNAMIC_ENVIRONMENT_ID,
    appEnvironment: process.env.NODE_ENV,
  },
};

export default nextConfig;
