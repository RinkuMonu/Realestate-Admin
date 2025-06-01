let userConfig = undefined;
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async redirects() {
    // return [
    //   {
    //     // Non-www ko www par redirect karega
    //     source: '/(.*)',
    //     has: [
    //       {
    //         type: 'host',
    //         value: 'sevenunique.com',
    //       },
    //     ],
    //     destination: 'https://www.sevenunique.com/:1',
    //     permanent: true,
    //   },
    // ];
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'adminrealestate.sevenunique.com' }],
        destination: 'https://adminrealestate.sevenunique.com/:path*',
        permanent: true,
      },
    ];
  },
};

if (userConfig) {
  const config = userConfig.default || userConfig;

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key]) &&
      typeof config[key] === 'object' &&
      !Array.isArray(config[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
