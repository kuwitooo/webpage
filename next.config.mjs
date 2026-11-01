const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS === 'true' ? '/webpage' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['172.23.240.1'],
}

export default nextConfig
