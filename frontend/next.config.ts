import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          punycode: false,
        },
      }
    }
    return config
  },
}

export default nextConfig